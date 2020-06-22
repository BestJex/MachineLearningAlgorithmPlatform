<template>
  <div>
    <!-- <keep-alive :exclude="['Document', 'MailSend', 'MailDetail', 'MailInbox']"> -->
      <router-view :key="key" />
    <!-- </keep-alive> -->
  </div>

</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  computed: {
    key() {
      return this.$route.path
    },
  },
  methods: {
  }
}
</script>