<template>
  <div class="token-balance" @click="addTokenToWallet">
    {{ network.chainId === 4 ? TOKENTESTShortBalance : TOKENShortBalance }}
    {{ network.chainId === 4 ? 'TOKENTEST' : 'TOKEN' }}
  </div>
</template>

<script>
import web3 from '@/helpers/web3'
import contract from '@/helpers/contract'
import ABI from '@/helpers/abi'
import RinkebyABI from '@/helpers/abi/Rinkeby'
export default {
  data: () => ({
    provider: {},
    signer: {},
    network: {},
    TOKENBalance: '',
    YENShortBalance: '',
    TOKENTESTBalance: '',
    TOKENTESTShortBalance: '',
  }),
  mounted() {
    setTimeout(async () => {
      await this.initialize()
      await this.getTOKENBalance()
      // await this.getTOKENTESTBalance()
    }, 0)
  },
  methods: {
    async initialize() {
      const { isConnected, provider, signer } = await web3.isConnected(
        this.$store
      )
      if (isConnected) {
        ;[this.provider, this.signer, this.isConnected] = [
          provider,
          signer,
          isConnected,
        ]
        this.network = this.$store.getters['web3/getNetwork']
      }
    },
    async getTOKENBalance() {
      if (
        (this.network.ableToSwap || this.network.chainId === 43114) &&
        this.network.chainId !== 4
      ) {
        const YENContract = await contract.getContract(
          process.env.YENProxyAddress,
          ABI.YENABI,
          this.signer
        )
        if (YENContract) {
          const balances = await contract.getBalance(
            YENContract,
            this.signer,
            true
          )
          this.TOKENBalance = balances.balance
          this.YENShortBalance = balances.shortBalance
        }
      }
    },
    async getTOKENTESTBalance() {
      let YENTESTContract
      if (this.network.chainId === 4) {
        YENTESTContract = await contract.getContract(
          process.env.YENTESTRinkebyAddress,
          RinkebyABI.YENTESTABI,
          this.signer
        )
        if (YENTESTContract) {
          const balances = await contract.getBalance(
            YENTESTContract,
            this.signer,
            true
          )
          this.TOKENTESTBalance = balances.balance
          this.TOKENTESTShortBalance = balances.shortBalance
        }
      }
    },
    async addTokenToWallet() {
      await web3.suggestAddToken(this.$store)
    },
  },
}
</script>

<style lang="scss" scoped>
.token-balance {
  background: linear-gradient(90deg, #ffccd9 0%, #da46e7 100%);
  border-radius: 8px;
  color: #fff;
  display: inline-block;
  padding: 10px 20px;
  cursor: pointer;
  @media (max-width: 560px) {
    display: none;
  }
}
</style>