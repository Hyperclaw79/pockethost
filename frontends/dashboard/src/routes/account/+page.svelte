<script lang="ts">
  import AuthStateGuard from '$components/helpers/AuthStateGuard.svelte'
  import PricingCard from '$src/routes/account/PricingCard.svelte'
  import { PLAN_NAMES, SubscriptionType } from '$shared'
  import { client } from '$src/pocketbase-client'
  import { isUserLegacy, userSubscriptionType } from '$util/stores'
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import FAQSection from '$src/routes/account/FAQSection.svelte'
  import PricingTable from '$components/tables/pricing-table/PricingTable.svelte'

  const founderMembershipsRemaining = writable(0)

  onMount(async () => {
    try {
      const membershipCount = await client()
        .client.collection('settings')
        .getFirstListItem(`name = 'founders-edition-count'`)
      founderMembershipsRemaining.set(membershipCount.value)
    } catch (e) {
      console.error(e)
    }
  })
</script>

<AuthStateGuard>
  <div class="">
    <main>
      <div class="mx-auto mt-16 max-w-7xl px-6 sm:mt-32 lg:px-8">
        <div class="mx-auto max-w-4xl text-center">
          <h1 class="text-base font-semibold leading-7 text-primary">
            Pricing
          </h1>
          <p
            class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Pricing plans for teams of all sizes
          </p>
        </div>

        <p
          class="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300"
        >
          Choose an affordable plan that’s packed with the best features for
          engaging your audience, creating customer loyalty, and driving sales.
        </p>

        <div
          class="mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {#if $isUserLegacy}
            <PricingCard
              name={PLAN_NAMES[SubscriptionType.Legacy]}
              description="Free forever. Use PocketHost for your next project and enjoy all the same features the paid tiers get."
              priceMonthly={0}
              priceAnnually={0}
              active={$userSubscriptionType === SubscriptionType.Legacy}
            />
          {:else}
            <PricingCard
              name={PLAN_NAMES[SubscriptionType.Free]}
              description="Free forever. Use PocketHost for your next project and enjoy all the same features the paid tiers get."
              priceMonthly={[0, 'free']}
              priceAnnually={[0, 'free']}
              active={$userSubscriptionType === SubscriptionType.Free}
            />
          {/if}

          <PricingCard
            name={PLAN_NAMES[SubscriptionType.Premium]}
            description="Want all your PocketHost projects in one place? That's what the Pro tier is all about."
            priceMonthly={[20, 'month']}
            priceAnnually={[199, 'year (save 20%)']}
            checkoutMonthURL="https://buy.stripe.com/fZe6sd8Mkfc30Kc4gg"
            checkoutYearURL="https://buy.stripe.com/aEUdUF7Igfc350s28a"
            active={$userSubscriptionType === SubscriptionType.Premium}
          />

          <PricingCard
            name={`${PLAN_NAMES[SubscriptionType.Lifetime]}`}
            {founderMembershipsRemaining}
            description="Super elite! The Founder's Edition is our way of saying thanks for supporting PocketHost in these early days. Choose between lifetime and annual options."
            priceMonthly={[300, 'once, use forever']}
            priceAnnually={[99, 'year (save 55%)']}
            checkoutMonthURL="https://buy.stripe.com/7sIg2N6Ecgg70KcdQT"
            checkoutYearURL="https://buy.stripe.com/aEUdUF7Igfc350s28a"
            active={$userSubscriptionType === SubscriptionType.Lifetime}
          />
        </div>

        <PricingTable />
      </div>

      <FAQSection />
    </main>
  </div>
</AuthStateGuard>
