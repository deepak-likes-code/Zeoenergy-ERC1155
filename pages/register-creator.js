import { ethers, Signer } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"





import {
    nftaddress
} from '../config'


import NFT from '../artifacts/contracts/NFT.sol/MyToken.json'

export default function Register() {



    const [creatorName, setCreatorName] = useState("");
    const [walletAddress, setWalletAddress] = useState("")


    const registerCreator = async () => {

        if (creatorName === "") {
            alert('Fill in the creator Name ')
        } else if (creatorName !== "") {


            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()

            const provider = new ethers.providers.Web3Provider(connection)
            const ownerWallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATEKEY, provider)
            console.log(ownerWallet)
            const signer = await provider.getSigner()
            // console.log(signer)
            const signerAddress = await signer.getAddress()
            console.log(signerAddress)

            let contract = new ethers.Contract(nftaddress, NFT.abi, ownerWallet)
            const isCreatorRegistered = await contract.registeredCreator(signerAddress);

            if (isCreatorRegistered[3]) {
                console.log('Creator already registered')
                alert('You are already registered, go create a NFT!')
            } else {
                const register = await contract.registerCreator(signerAddress, creatorName);
                console.log(register);
                console.log("New creator registered")
                alert("Yaay ! 🥳 You're registered , go create your NFT")

            }
        }
    }


    const checkIfAlreadyRegistered = async () => {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()

        const provider = new ethers.providers.Web3Provider(connection)
        const ownerWallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATEKEY, provider)
        console.log(ownerWallet)
        const signer = await provider.getSigner()
        // console.log(signer)
        const signerAddress = await signer.getAddress()
        console.log(signerAddress)

        let contract = new ethers.Contract(nftaddress, NFT.abi, ownerWallet)
        const isCreatorRegistered = await contract.registeredCreator(signerAddress);

        if (isCreatorRegistered[3]) {
            console.log('Creator already registered')
            alert('You are already registered, go create a NFT!')
        }
    }

    // Using Web3 JS

    useEffect(() => {
        connectToWallet()


    }, [])

    const connectToWallet = async () => {
        if (window.ethereum) {

            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)

            // console.log(provider)


            checkIfAlreadyRegistered()


            // Handle if the account is changed
            window.ethereum.on('accountsChanged', (account) => {
                console.log('changed Account=', account[0])
                setWalletAddress(account[0])
                checkIfAlreadyRegistered()
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

    // const registerCreator = async () => {
    //     const provider = window.ethereum;
    //     const web3 = new Web3(provider);
    //     const nftContract = new web3.eth.Contract(NFT.abi, nftaddress)
    //     console.log('nftcontract:', nftContract)
    //     const currentAddress = await provider.request({ method: 'eth_accounts' })

    //     console.log('walletAddress is', walletAddress)
    //     const isCreatorRegistered = await nftContract.methods.registeredCreator(walletAddress).call()

    //     if (isCreatorRegistered[3]) {
    //         console.log('The Creator is Already Registered')
    //         router.push('/create-item')
    //     } else {
    //         if (!creatorName) {
    //             alert('Enter all fields')
    //         } else if (creatorName) {

    //             signByOwner(creatorName)
    //         }

    //     }


    // }

    // const signByOwner = async () => {
    //     const ethProvider = window.ethereum;

    //     const provider = new HDWalletProvider({
    //         privateKeys: [ownerPrivateKey],
    //         providerOrUrl: ethProvider
    //     })

    //     const web3 = new Web3(provider);
    //     console.log('HDWAllet:', web3)
    //     const nftContract = new web3.eth.Contract(NFT.abi, nftaddress)
    //     console.log(nftContract);
    //     console.log('registering......')
    //     const registerCreator = await nftContract.methods.registerCreator(walletAddress, creatorName).send({ from: '0x99e4Ee279aE74e954fe06338379DD76219B072E0' })
    //     console.log('registered......')
    //     console.log(registerCreator)
    //     provider.engine.stop();

    // }



    return (
        <div className="flex justify-center">

            <div className="w-1/2 flex flex-col pb-12">
                <h1 className="mt-4 text-center font-bold">Creator KYC</h1>
                <input
                    placeholder="Random KYC stuff"
                    className="mt-8 border rounded p-4"
                // onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <input
                    placeholder="Creator Name"
                    className="mt-2 border rounded p-4"
                    onChange={e => setCreatorName(e.target.value)}
                />

                <button onClick={registerCreator} className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">
                    Register Creator
        </button>
            </div>
        </div>

    )

}