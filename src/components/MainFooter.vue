<template>
  <footer :class="isMobilePhone ? 'background-brand' : ''">
    <div class="wrap flex">
      <nav>
        <div class="flex">
          <a>{{ $t('message.aboutus') }}</a>
          <a v-if="!isMobilePhone">{{ $t('message.reviews') }}</a>
          <a v-if="!isMobilePhone">{{ $t('message.privacy') }}</a>
          <a v-on:click="gotoSettingsPage" href="./settings.html">
            {{
            $t('message.settings')
            }}
          </a>
        </div>
      </nav>
      <LangSwitch v-if="settings.i18n.showLangSwitch" />
      <p
        class="flex-align-r copyright"
      >{{ "© " + new Date().getFullYear() + " " + $t('message.copyright') }}</p>
    </div>
  </footer>
</template>

<script>
import { mainconfig } from '../global';
import LangSwitch from './widgets/LangSwitch.vue';

export default {
  data() {
    return mainconfig;
  },
  components: {
    LangSwitch,
  },
  methods: {
    gotoSettingsPage(event) {
      mainconfig.currentPage = 'settings.html';
      if (this.$gtag) {
        this.$gtag.pageview({
          page_path: mainconfig.currentPage,
        });
      }
      window.history.pushState({}, '', 'settings.html');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      event.preventDefault();
    },
  },
};
</script>
