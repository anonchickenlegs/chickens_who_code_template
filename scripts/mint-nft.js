require("dotenv").config();

const API_URL = process.env.API_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const contract = require("../artifacts/contracts/CWC.sol/Chickens_Who_Code.json");
const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);

async function mintNFT() {
    // Get Latest nonce
    /*
    the nonce specification is used to keep track of the number of transactions sent from your address— which we need for security purposes and to prevent replay attacks. 
    */
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");

    //the transaction 
    const tx = {
        'from' : PUBLIC_KEY,
        'to' : CONTRACT_ADDRESS,
        'nonce': nonce,
        'gas': 500000,
        'maxPriorityFeePerGas' : 2999999987,
        'data': nftContract.methods.mint(1).encodeABI()
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
}
mintNFT();