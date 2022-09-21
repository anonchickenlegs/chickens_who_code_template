require("dotenv").config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const API_URL = process.env.API_URL;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const contractABI = require("./contractABI.json");

const nftContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

async function mintNFT(amount, amountOfEth) {
  try {
    console.log(`---------minting ${amount} NFTs`);
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
    console.log(nonce)
    const amountToSend = amountOfEth * amount;
    console.log(`eth being sent ${amountToSend}`)
    const gasEstimate = await web3.eth.estimateGas({
      from: PUBLIC_KEY,
      to: CONTRACT_ADDRESS,
      data: nftContract.methods.mint(amount).encodeABI(),
      value: web3.utils.toWei(amountToSend.toString(), "ether")
    });

    console.log(gasEstimate)
    //the transaction
    const tx = {
      from: PUBLIC_KEY,
      to: CONTRACT_ADDRESS,
      nonce: nonce,
      gas: gasEstimate,
      data: nftContract.methods.mint(amount).encodeABI(),
      value: 
        web3.utils.toWei(amountToSend.toString(), "ether"),
    };
  
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log(`-----------Successfully Minted NFTS-------------`)
    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
  } catch (e) {
    console.log(e)
  }

}

async function simulateMinting() {
  while(true) {
    let randomNumber = Math.floor(Math.random() * 15);
    await mintNFT(randomNumber, 0.03)

    await new Promise((r) => setTimeout(r, 30000));
  }
}


// main();
simulateMinting();
