<template>
  <header class="flex flex-col flex-mid-align">
    <a v-on:click="gotoHomePage" href="./index.html">
      <img class="logo" :src="'./img/uplus-logo.png'" alt="U+" />
    </a>
  </header>
</template>

<script>
import { mainconfig } from '../../global';

export default {
  data() {
    return mainconfig;
  },
  methods: {
    gotoHomePage(event) {
      mainconfig.currentPage = 'index.html';
      if (this.$gtag) {
        this.$gtag.pageview({
          page_path: mainconfig.currentPage,
        });
      }
      window.history.replaceState(
        {},
        '',
        mainconfig.isAuthenticated ? 'account' : 'index.html',
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      event.preventDefault();
    },
  },
};
</script>
