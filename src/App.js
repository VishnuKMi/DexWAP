import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  CONTRACT_A_ADDRESS,
  CONTRACT_B_ADDRESS
} from './constants'

const provider = new ethers.providers.InfuraProvider(
  'sepolia',
  process.env.REACT_APP_INFURA_KEY
)

function DexWAP () {
  const [account, setAccount] = useState('')
  const [connected, setConnected] = useState(false)
  const [balanceA, setBalanceA] = useState('')
  const [balanceB, setBalanceB] = useState('')
  const [balanceC, setBalanceC] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [swapError, setSwapError] = useState('')

  useEffect(() => {
    connectWallet()
    fetchBalances()
  })

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        setAccount(accounts[0])
        setConnected(true)
      } catch (error) {
        console.error('Error connecting to wallet:', error)
      }
    }
  }

  const fetchBalances = async () => {
    try {
      if (connected) {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider
        )
        const balanceA = await contract.getTokenABalance()
        const balanceB = await contract.getTokenBBalance()
        const balanceC = await contract.getTokenCBalance()
        setBalanceA(ethers.utils.formatUnits(balanceA, 18))
        setBalanceB(ethers.utils.formatUnits(balanceB, 18))
        setBalanceC(ethers.utils.formatUnits(balanceC, 18))
      }
    } catch (error) {
      console.error('Error fetching balances:', error)
    }
  }

  const handleSwapAforC = async () => {
    await handleSwap(CONTRACT_A_ADDRESS, amount)
  }

  const handleSwapBforC = async () => {
    await handleSwap(CONTRACT_B_ADDRESS, amount)
  }

  const handleSwap = async (tokenAddress, amount) => {
    try {
      setLoading(true)
      setSwapError('')
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      )
      const tx = await contract.swap(
        tokenAddress,
        ethers.utils.parseUnits(amount, 18)
      )
      await tx.wait()

      // Update the balances after a successful swap
      await fetchBalances()

      setLoading(false)
    } catch (error) {
      console.error('Error swapping tokens:', error)
      setSwapError('Error swapping tokens')
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold mb-4'>DexWAP</h1>
      {connected ? (
        <div>
          <p>Connected Account: {account}</p>
          <div className='my-4'>
            <p>Balance of Token A: {balanceA}</p>
            <p>Balance of Token B: {balanceB}</p>
            <p>Balance of Token C: {balanceC}</p>
          </div>
          <div className='flex my-4'>
            <input
              type='number'
              placeholder='Amount'
              className='border rounded-l px-4 py-2'
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded-r'
              onClick={handleSwapAforC}
              disabled={loading}
            >
              Swap A for C
            </button>
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded-r'
              onClick={handleSwapBforC}
              disabled={loading}
            >
              Swap B for C
            </button>
          </div>
          {swapError && <p className='text-red-500'>{swapError}</p>}
        </div>
      ) : (
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded'
          onClick={connectWallet}
          disabled={loading}
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}

export default DexWAP
