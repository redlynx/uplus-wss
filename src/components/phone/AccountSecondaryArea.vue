<template>
  <div>
    <div class="secondary-card margin-t-0 quick-links-account">
      <h2>{{ $t('message.phone_quick_links_title') }}</h2>
      <nav>
        <ul>
          <li v-for="(item, index) in visibleQuickLinks" :key="index">
            <a v-on:click="selectLink(item.originalIndex)">{{
              item.title[currentLocale]
            }}</a>
          </li>
        </ul>
      </nav>
    </div>
    <div
      class="secondary-card"
      v-if="settings.pega_marketing.Host === '' || settings.pega_marketing.accountPage.placement === '' ||
     settings.pega_marketing.accountPage.containerName === '' || (loading && !settings.pega_marketing.showLoadingIndicator)"
    >
      <section
        class="offer-card-col"
        v-for="item in app.offers"
        :key="item.title"
      >
        <img
          class="offer-img"
          :src="'./img/' + item.img"
          :alt="$t('message.' + item.title)"
        />
        <div class="content">
          <h3>{{ $t('message.' + item.title) }}</h3>
          <p>{{ $t('message.' + item.message) }}</p>
          <a v-on:click="gotoOfferPage" href="./offer.html">{{
            $t('message.learnmore')
          }}</a>
        </div>
      </section>
    </div>
    <div
      class="secondary-card loading-container"
      style="min-height: 300rem"
      v-else-if="settings.pega_marketing.Host!== '' && loading && settings.pega_marketing.showLoadingIndicator"
    >
    <span class="loading">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </span>
    </div>
    <div class="secondary-card" v-else>
      <Offer v-for="item in data" :key="item.title" v-bind:offer="item" />
    </div>
  </div>
</template>

<script>
import Offer from '../widgets/Offer.vue';
import { mainconfig } from '../../global';
import { initNBAM } from '../../CDHIntegration';

export default {
  data() {
    return {
      ...mainconfig,
      loading: true,
      data: [],
    };
  },
  mounted() {
    if (
      this.settings.pega_marketing.Host !== '' &&
      this.settings.pega_marketing.accountPage.placement !== '' &&
      this.settings.pega_marketing.accountPage.containerName !== ''
    ) {
      const self = this;
      let customerID = '';
      if (this.userId !== -1 && this.settings.users[this.userId].customerID) {
        customerID = this.settings.users[this.userId].customerID;
      }
      setTimeout(() => {
        initNBAM(
          self,
          'accountPage',
          customerID,
          self.previousPage,
          'account.html',
        );
      }, 200);
    }
  },
  computed: {
    visibleQuickLinks() {
      return this.settings.quicklinks.filter((item, index) => {
        item.originalIndex = index;
        return item.hide !== true;
      });
    },
  },
  methods: {
    selectLink(index) {
      mainconfig.quickLinkId = index;
    },
    gotoOfferPage(event) {
      mainconfig.phonePageName = 'offer.html';
      if (this.$gtag) {
        this.$gtag.pageview({
          page_path: mainconfig.phonePageName,
        });
      }
      window.history.pushState({}, '', 'offer.html');
      mainconfig.offerIndex = 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      event.preventDefault();
    },
  },
  components: {
    Offer,
  },
};
</script>
