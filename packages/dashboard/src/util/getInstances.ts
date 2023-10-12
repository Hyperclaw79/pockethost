import { browser } from '$app/environment'
import { client } from '$src/pocketbase'
import { instance } from '$src/routes/app/instances/[instanceId]/store'
import { globalInstancesStore } from '$util/stores'
import {
  LoggerService,
  assertExists,
  createCleanupManager,
  type InstanceFields,
} from '@pockethost/common'
import { onDestroy, onMount } from 'svelte'

export const getInstances = async () => {
  const { error } = LoggerService()

  onMount(() => {
    if (browser) {
      ;(async () => {
        const { getAllInstancesById } = client()

        const instances = await getAllInstancesById()

        globalInstancesStore.set(instances)

        client()
          .client.collection('instances')
          .subscribe<InstanceFields>('*', (data) => {
            globalInstancesStore.update((instances) => {
              instances[data.record.id] = data.record
              return instances
            })
          })
      })().catch(error)
    }
  })

  // Stop listening to the db if this component unmounts
  onDestroy(() => {
    if (browser) {
      client().client.collection('instances').unsubscribe('*').catch(error)
    }
  })
}

export const getSingleInstance = async (instanceId: string) => {
  const cm = createCleanupManager()
  // Only run this on the browser
  if (browser) {
    const { dbg, error } = LoggerService().create(`layout.svelte`)

    const { watchInstanceById } = client()

    watchInstanceById(instanceId, (r) => {
      dbg(`Handling instance update`, r)
      const { action, record } = r
      assertExists(record, `Expected instance here`)

      // Update the page state with the instance information
      instance.set(record)
    })
      .then(cm.add)
      .catch(error)
  }
}