<template>
  <DefaultPage v-if="currentPage.indexOf('index.html') === 0" />
  <OfferPage v-else-if="currentPage.indexOf('offer') === 0" />
  <SettingsPage v-else-if="currentPage.indexOf('settings.html') === 0" />
  <LandingPage v-else-if="currentPage.indexOf('landingpage.html') === 0" />
  <CategoryPage v-else-if="currentPage.indexOf('category.html') === 0" />
  <DefaultPage v-else />
</template>

<script>
import { mainconfig } from './global';
import DefaultPage from './DefaultPage.vue';
import OfferPage from './OfferPage.vue';
import SettingsPage from './SettingsPage.vue';
import LandingPage from './LandingPage.vue';
import CategoryPage from './CategoryPage.vue';

export default {
  data() {
    return mainconfig;
  },
  created() {
    this.currentPage = window.location.pathname.substring(
      window.location.pathname.lastIndexOf('/') + 1,
    );
    if (
      window.history &&
      window.history.state !== null &&
      typeof window.history.state.page !== 'undefined'
    ) {
      this.currentPage = window.history.state.page;
      window.history.replaceState(
        {},
        '',
        this.currentPage + window.location.search,
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (this.currentPage === 'heroaction') {
      mainconfig.homeHeroAction = 1;
    }
    if (this.currentPage.indexOf('offer') === 0 && this.currentPage.indexOf('offer.html') !== 0) {
      mainconfig.offerIndex = parseInt(this.currentPage.substring(5).replace('.html', ''), 10);
    }
    mainconfig.currentPage = this.currentPage;
    if (this.$gtag) {
      this.$gtag.pageview({
        page_path: mainconfig.currentPage,
      });
    }
  },
  components: {
    DefaultPage,
    OfferPage,
    SettingsPage,
    LandingPage,
    CategoryPage,
  },
};
</script>

<style>
@import url('./css/normalize.min.css');
@import url('./css/_init.css');
@import url('./css/_text.css');
@import url('./css/_layout.css');
@import url('./css/_controls.css');
@import url('./css/_color.css');
@import url('./css/_icons.css');
@import url('./css/_chat.css');
@import url('./css/_offer.css');
@import url('./css/_landing.css');
@import url('./css/_phone.css');
@import url('./css/_responsive.css');
</style>
