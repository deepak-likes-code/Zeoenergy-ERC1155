/* pages/my-assets.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
    nftaddress
} from '../config'


import NFT from '../artifacts/contracts/NFT.sol/MyToken.json'

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')


    useEffect(() => {
        connectToWallet()
    }, [])


    const connectToWallet = async () => {
        if (window.ethereum) {

            loadNFTs()
            // Handle if the account is changed
            window.ethereum.on('accountsChanged', (account) => {
                console.log('changed Account=', account[0])
                // connectToWallet()
            })
            // Handle Chain change from Rinkeby
            window.ethereum.on('chainChanged', (chainId) => {
                if (chainId !== 4) {
                    alert("Switch to Rinkeby")
                }
            })

        } else {
            alert("Get Metamask")
        }
    }


    async function loadNFTs() {
        const web3Modal = new Web3Modal({
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = await provider.getSigner()
        const signerAddress = await signer.getAddress()
        const NFTContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        console.log(NFTContract)
        console.log(signerAddress)
        // const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const data1 = await NFTContract.fetchBoughtNFTs();
        console.log('fetched data: ', data1)
        // const data2 = await NFTContract.creatorTokens(signerAddress, 1);

        // const cost = ethers.utils.formatUnits(data.cost.toString(), 'ether')
        // console.log(data)
        // console.log(data2)

        // console.log('Total Supply :', data.totalSupply.toNumber())

        // const items = [];


        let items = await Promise.all(data1.map(async i => {
            // const meta = await axios.get(tokenUri)
            let price = await ethers.utils.formatUnits(i.cost.toString(), 'ether')
            let item = {
                name: await i[2],
                price,
                tokenId: await i[0].toNumber(),
                seller: await i[1],
                owner: "me",
                image: i.mediaUrl
            }
            return item
        })
        )


        console.log('items:', items)




        // console.log(items)
        setLoadingState('loaded')
        setNfts(items)

    }


    // if (loadingState === 'loaded' && nfts.length===0) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
    return (



        <div className="flex justify-center">

            {nfts.length === 0 && (
                <h1 className="p-4 font-bold text-2xl">No items in your Possesion</h1>
            )}

            {nfts.length > 0 && (
                <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                        {
                            nfts.map((nft, i) => (
                                <div key={i} className="border shadow rounded-xl overflow-hidden">
                                    <embed src={nft.image} className="rounded p2" />
                                    <div className="p-4 bg-black">
                                        {/* <a className="text-2xl font-bold text-white" rel="opener" href={nft.image} >link</a> */}
                                        <p className="text-2xl font-bold text-white">Name - {nft.name} </p>
                                        <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                        <a className="text-2xl font-bold text-blue-500" href={nft.image} >Link  </a>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}





        </div>
    )
}