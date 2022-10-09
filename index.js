import {ethers} from "./ethers-5.6.esm.min.js"
import {abi, contractAddress} from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const withdrawButton = document.getElementById("withdrawButton")
const balanceButton = document.getElementById("balanceButton")
connectButton.onclick = connect
fundButton.onclick = fund
withdrawButton.onclick = withdraw
balanceButton.onclick = getBalance

console.log(ethers)


async function connect() {
    if (typeof window.ethereum !== "undefined") {
        window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Connect Wallet"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}


async function fund(ethAmount) {
    console.log(`Funding ${ethAmount} ETH`)
    ethAmount = document.getElementById("ethAmount").value
    if (typeof window.ethereum !== "undefined") {

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
        const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) })
        await listenForTransactionMine(transactionResponse, provider)
        console.log(`Funded ${ethAmount} ETH`)
        } catch (e) {
            console.log(e)
        }
        
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining transaction ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(`Transaction mined ${transactionReceipt.transactionHash}`)
        resolve(transactionReceipt)
    })

    })
}

async function withdraw() {

    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
        const transactionResponse = await contract.withdraw()
        await listenForTransactionMine(transactionResponse, provider)
        
        } catch (e) {
            console.log(e)
        }
    }
}