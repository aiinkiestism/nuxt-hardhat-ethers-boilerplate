<template>
  <div class="web3-profile mx-auto">
    {{ ensName ? ensName : shortAccount }}
  </div>
</template>

<script>
import web3 from '@/helpers/web3'
export default {
  props: ['provider', 'signer'],
  data: () => ({
    account: '',
    ensName: '',
    shortAccount: '',
  }),
  mounted() {
    this.initialize()
  },
  methods: {
    async initialize() {
      this.account = this.$store.getters['web3/getAccount']
      if (!this.account) {
        const accounts = await this.provider.listAccounts()
        this.account = accounts[0]
      }
      if (this.account) {
        this.shortAccount = web3.shortenAccount(this.account)
      }
      this.ensName = await web3.getEnsName(this.provider, this.account)
    },
  },
}
</script>

<style lang="scss" scoped>
.web3-profile {
  background: linear-gradient(90deg, #ffccd9 0%, #da46e7 100%);
  border-radius: 8px;
  color: #fff;
  display: inline-block;
  padding: 10px 20px;
  @media (max-width: 560px) {
    display: none;
  }
}
</style>