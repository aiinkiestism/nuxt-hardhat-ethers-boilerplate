<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="400"
      class="overflow-hidden"
    >
      <v-card :class="{ 'text-center': true, 'pb-4': !enableOK }">
        <v-card-title class="text-h5">
          <p class="mx-auto mb-4">
            {{ title }}
          </p>
        </v-card-title>
        <v-card-text v-if="desc">{{ desc }}</v-card-text>
        <div v-if="enableBtn" class="text-center mb-2">
          <v-btn @click="addTokenToWallet">
            {{
              chainId === 4
                ? $t('dialog.completeSwap.addTestToken')
                : $t('dialog.completeSwap.addToken')
            }}
          </v-btn>
        </div>
        <div v-if="enableLink" class="text-center">
          <a :href="explorerLink" target="_blank" rel="noopener">
            <p v-if="chainId === 137" class="mb-0">View on PolygonScan</p>
            <p v-else-if="chainId === 4" class="mb-0">View on EtherScan</p>
            <p v-else-if="chainId === 56" class="mb-0">View on BSCScan</p>
          </a>
        </div>
        <v-card-actions v-if="enableOK">
          <v-row>
            <v-col cols="8"></v-col>
            <v-col cols="4">
              <v-btn color="green darken-1" text @click="dialog = false">
                OK
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import web3 from '@/helpers/web3'
export default {
  data() {
    return {
      dialog: false,
      title: '',
      desc: '',
      enableBtn: false,
      enableLink: false,
      explorerLink: '',
      chainId: '',
      enableOK: true,
    }
  },
  methods: {
    showDialog(
      title,
      desc,
      enableBtn,
      enableLink,
      explorerLink,
      chainId,
      enableOK
    ) {
      this.title = title
      if (this.desc) this.desc = desc
      this.enableBtn = enableBtn
      this.chainId = chainId
      this.enableLink = enableLink
      this.explorerLink = explorerLink
      this.enableOK = enableOK
      this.dialog = true
      // setTimeout(() => {
      //   this.dialog = false
      // }, 10000)
    },
    hideDialog() {
      this.dialog = false
    },
    async addTokenToWallet() {
      await web3.suggestAddToken(this.$store)
    },
  },
}
</script>

<style lang="scss" scoped></style>