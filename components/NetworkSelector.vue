<template>
  <div class="selector-wrapper">
    <div class="current-network d-flex">
      <slot />
      <v-icon class="ml-2" color="white">mdi-chevron-down</v-icon>
    </div>
    <div class="selector py-4 px-6 text-center">
      <p>{{ $t('appbar.selectNetwork') }}</p>
      <div
        v-for="network in networks"
        :key="network.chainId"
        class="network d-flex my-1 py-2 px-8"
        @click="changeNetwork(network)"
      >
        <img
          :src="network.imgSrc"
          :alt="network.imgAlt"
          width="20"
          height="20"
          class="mr-2"
        />
        <p class="mb-0">
          {{ network.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import contract from '@/helpers/contract'
import BSCLogo from '@/assets/images/bsc.jpeg'
import PolygonLogo from '@/assets/images/polygon.jpeg'
export default {
  data: () => ({
    networks: [
      {
        chainId: 137,
        name: 'Polygon',
        imgSrc: PolygonLogo,
        imgAlt: 'Polygon Network',
      },
      {
        chainId: 56,
        name: 'BSC',
        imgSrc: BSCLogo,
        imgAlt: 'BSC Network',
      },
    ],
  }),
  methods: {
    async changeNetwork(network) {
      const formattedChainId = await contract.hexStripZeros(
        await contract.hexlify(network.chainId)
      )
      // console.log(formattedChainId)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: formattedChainId }],
        })
        await this.$router.go()
      } catch (e) {
        // console.log(e)
        if (e.code === 4902) {
          // await library.provider.request({
          //   method: 'wallet_addEthereumChain',
          //   params: [
          //     {
          //       chainId: formattedChainId,
          //       chainName: info.label,
          //       rpcUrls: getRpcUrls(chainId),
          //       nativeCurrency: info.nativeCurrency,
          //       blockExplorerUrls: [info.explorer],
          //     },
          //   ],
          // })
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.selector-wrapper {
  position: relative;
  @media (max-width: 560px) {
    display: none;
  }
  &:hover {
    .current-network {
      transition: 0.7s;
      opacity: 0.8;
    }
    .selector {
      transition: 0.8s;
      opacity: 1;
      visibility: visible;
    }
  }
  .current-network {
    background: linear-gradient(90deg, #ffccd9 0%, #da46e7 100%);
    border-radius: 8px;
    color: #fff;
    display: inline-block;
    padding: 10px 20px;
  }
  .selector {
    position: absolute;
    top: 108%;
    left: -28%;
    opacity: 0;
    visibility: hidden;
    background: rgba(255, 205, 237, 0.6);
    border-radius: 8px;
    color: rgba(0, 0, 0, 0.6);
    .network {
      cursor: pointer;
      border-radius: 8px;
      &:hover {
        transition: 0.8s;
        background: rgba(0, 0, 0, 0.08);
      }
      img {
        margin-top: 2px;
      }
    }
  }
}
</style>