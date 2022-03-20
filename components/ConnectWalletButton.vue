<template>
  <v-btn class="connect-btn mx-auto" @click="connectWallet">
    {{ $t('appbar.connectWallet') }}
  </v-btn>
</template>

<script>
import web3 from '@/helpers/web3'
export default {
  methods: {
    async connectWallet() {
      const { account, provider } = await web3.callWeb3Modal()
      const signer = await provider.getSigner()
      this.$store.dispatch('web3/updateAccount', account)
      this.$emit('transferWeb3', {
        provider,
        signer,
      })
      this.$store.dispatch('web3/updateIsConnected', true)
      this.$emit('updateIsConnected')
    },
  },
}
</script>

<style lang="scss" scoped>
.connect-btn {
  background: linear-gradient(90deg, #ffccd9 0%, #da46e7 100%);
  border-radius: 8px;
  color: #fff;
}
</style>