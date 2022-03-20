import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import providerOptions from './providerOptions'

export async function isConnected(store) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const accounts = await provider.listAccounts()
  if (accounts[0]) {
    // vuex state initialization
    store.dispatch('web3/updateIsConnected', true)
    const accounts = await provider.listAccounts()
    store.dispatch('web3/updateAccount', accounts[0])
    const { chainId, name } = await provider.getNetwork()
    store.dispatch('web3/updateNetwork', {
      chainId,
      name,
      ableToSwap: chainId === 137 || chainId === 4 || chainId === 56,
    })
  }
  return {
    isConnected: store.getters['web3/getIsConnected'],
    provider,
    signer,
    accounts,
  }
}

const _getWeb3Modal = () => {
  // const network = process.env.NODE_ENV === 'development' ? 'testnet' : 'mainnet';
  const web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions,
  })

  return web3Modal
}

export async function callWeb3Modal() {
  const web3Modal = _getWeb3Modal()
  const web3ModalProvider = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(web3ModalProvider)
  const accounts = await provider.listAccounts()

  return {
    account: accounts[0],
    provider,
  }
}

export async function getEnsName(provider, account) {
  const network = await provider.getNetwork()
  let ensName
  if (network.chainId === 1) {
    ensName = await provider.lookupAddress(account)
  } else {
    ensName = null
  }
  return ensName
}

export function shortenAccount(account) {
  let shortAccount = ''
  shortAccount += account.slice(0, 5)
  shortAccount += '...'
  shortAccount += account.slice(-4, -1)
  shortAccount += account.slice(-1)
  return shortAccount
}

export async function getExplorerLink(store, txHash) {
  const { chainId } = await store.getters['web3/getNetwork']
  let explorerLink
  switch (chainId) {
    case 137:
      explorerLink = `https://polygonscan.com/tx/${txHash}`
      break
    case 4:
      explorerLink = `https://rinkeby.etherscan.io/tx/${txHash}`
      break
    case 56:
      explorerLink = `https://bscscan.com/tx/${txHash}`
      break
    default:
      explorerLink = ''
  }
  return explorerLink
}

export async function suggestAddToken(store) {
  try {
    const { chainId } = await store.getters['web3/getNetwork']
    let wasAdded
    if (chainId === 4) {
      wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: process.env.YENTESTRinkebyAddress,
            symbol: 'YENTEST',
            decimals: 18,
            image: 'https://app.yenshop.jp/_nuxt/img/logo.051d2ad.png',
          },
        },
      })
    } else {
      wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: process.env.YENProxyAddress,
            symbol: 'YEN',
            decimals: 18,
            image: 'https://app.yenshop.jp/_nuxt/img/logo.051d2ad.png',
          },
        },
      })
    }

    if (wasAdded) {
      console.log('added')
    } else {
      console.log('failed adding...')
    }
  } catch (e) {
    console.error(e)
  }
}

export default {
  isConnected,
  callWeb3Modal,
  getEnsName,
  shortenAccount,
  getExplorerLink,
  suggestAddToken,
}