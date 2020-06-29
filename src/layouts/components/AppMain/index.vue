<template>
  <section class="app-main-container">
    <vab-keel v-if="show && skeleton" style="margin: 15px;">
      <vab-keel-heading :img="true" />
      <vab-keel-text :lines="7" />
      <vab-keel-heading :img="true" />
      <vab-keel-text :lines="6" />
      <vab-keel-heading :img="true" />
      <vab-keel-text :lines="8" />
    </vab-keel>
    <transition mode="out-in" name="fade-transform">
      <keep-alive :include="cachedRoutes" :max="10">
        <router-view :key="key" style="min-height: 80.6vh;" />
      </keep-alive>
    </transition>
    <footer class="footer-copyright">
      xxx网吧管理
      <vab-icon :icon="['fas', 'copyright']"></vab-icon>
      <!-- {{ fullYear }} {{ copyright }} -->
      xxx
    </footer>
  </section>
</template>

<script>
import { VabKeel, VabKeelHeading, VabKeelText } from '@/plugins/vabKeel'
import { mapGetters } from 'vuex'
// import GithubCorner from '@/components/GithubCorner'
import { copyright } from '@/config/settings'

export default {
  name: 'AppMain',
  components: {
    VabKeel,
    VabKeelHeading,
    VabKeelText,
    // GithubCorner,
  },
  data() {
    return {
      show: true,
      nodeEnv: process.env.NODE_ENV,
      fullYear: new Date().getFullYear(),
      copyright,
    }
  },
  computed: {
    ...mapGetters({
      cachedRoutes: 'tagsBar/cachedRoutes',
      device: 'settings/device',
      skeleton: 'settings/skeleton',
    }),
    key() {
      return this.$route.path
    },
  },
  watch: {
    $route(to, from) {
      this.$nextTick(() => {
        if (this.$store.state.tagsBar.skeleton) {
          this.show = true
          setTimeout(() => {
            this.show = false
          }, 200)
        } else {
          this.show = false
        }
        if ('mobile' === this.device) {
          this.$store.dispatch('settings/foldSideBar')
        }
      })
    },
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.show = false
    }, 200)
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.app-main-container {
  position: relative;
  width: 100%;
  overflow: hidden;

  .footer-copyright {
    min-height: 55px;
    line-height: 55px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    background: #272a3d;
  }
}
</style>
