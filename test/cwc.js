// test/Box.test.js
// Load dependencies
const { expect } = require("chai");
const hre = require("hardhat");
const contract = require("../artifacts/contracts/CWC.sol/Chickens_Who_Code.json");

TEST_ADDRESS1 = {
  publicKey: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  privateKey:
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
};

TEST_ADDRESS2 = {
  publicKey: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
  privateKey:
    "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82",
};

TEST_ADDRESS3 = {
  publicKey: "0xa0ee7a142d267c1f36714e4a8f75612f20a79720",
  privateKey:
    "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
};

TEST_ADDRESS4 = {
  publicKey: "0xdd2fd4581271e230360230f9337d5c0430bf44c0",
  privateKey:
    "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
};

TEST_ADDRESS5 = {
  publicKey: "0x2546bcd3c84621e976d8185a91a922ae77ecec30",
  privateKey:
    "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0",
};

const signMintTransaction = async (
  publicKey,
  privateKey,
  contractAddress,
  mintAmount,
  amountOfEth
) => {
  const chickensWhoCodeContract = new hre.web3.eth.Contract(
    contract.abi,
    contractAddress
  );

  const nonce = await hre.web3.eth.getTransactionCount(publicKey, "latest");

  const amountToSend = amountOfEth * mintAmount;
  const esimatedGas = await web3.eth.estimateGas({
    to: contractAddress,
    data: chickensWhoCodeContract.methods.mint(mintAmount).encodeABI(),
    // value: hre.web3.utils.toWei(amountToSend.toString(), "ether"),
  });
  const tx = {
    from: publicKey,
    nonce: nonce,
    to: contractAddress,
    gas: esimatedGas,
    maxPriorityFeePerGas: 2999999987, //tip we give the miner
    data: chickensWhoCodeContract.methods.mint(mintAmount).encodeABI(),
    // value: hre.web3.utils.toWei(amountToSend.toString(), "ether"),
  };

  try {
    const signedTx = await hre.web3.eth.accounts.signTransaction(
      tx,
      privateKey
    );
    await hre.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  } catch (error) {
    console.log(error.message);
  }
};

const signWithdrawTransaction = async (
  publicKey,
  privateKey,
  contractAddress
) => {
  const chickensWhoCodeContract = new hre.web3.eth.Contract(
    contract.abi,
    contractAddress
  );

  const nonce = await hre.web3.eth.getTransactionCount(publicKey, "latest");

  const esimatedGas = await web3.eth.estimateGas({
    to: contractAddress,
    data: chickensWhoCodeContract.methods.withdrawAll().encodeABI(),
  });

  const tx = {
    from: publicKey,
    nonce: nonce,
    to: contractAddress,
    gas: esimatedGas,
    // maxPriorityFeePerGas: 2999999987, //tip we give the miner
    data: chickensWhoCodeContract.methods.withdrawAll().encodeABI(),
  };

  const signedTx = await hre.web3.eth.accounts.signTransaction(
    tx,
    privateKey
  );
  await hre.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
};

const signSetWithDrawTransaction = async (
  publicKey,
  privateKey,
  contractAddress,
  newAddress
) => {
  const chickensWhoCodeContract = new hre.web3.eth.Contract(
    contract.abi,
    contractAddress
  );

  const nonce = await hre.web3.eth.getTransactionCount(publicKey, "latest");

  const esimatedGas = await web3.eth.estimateGas({
    to: contractAddress,
    data: chickensWhoCodeContract.methods
      .setWithdrawAddress(newAddress)
      .encodeABI(),
  });

  const tx = {
    from: publicKey,
    nonce: nonce,
    to: contractAddress,
    gas: esimatedGas,
    // maxPriorityFeePerGas: 2999999987, //tip we give the miner
    data: chickensWhoCodeContract.methods
      .setWithdrawAddress(newAddress)
      .encodeABI(),
  };


  const signedTx = await hre.web3.eth.accounts.signTransaction(
    tx,
    privateKey
  );
  await hre.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
};

describe("Chickens_Who_Code", function () {
  before(async function () {
    this.Chickens_Who_Code = await hre.ethers.getContractFactory(
      "Chickens_Who_Code"
    );
    this.chickensWhoCode = await this.Chickens_Who_Code.deploy();
    const response = await this.chickensWhoCode.deployed();
    this.owner = await response.owner();
    this.contractAddress = response.address;
  });

  // Test case
  it("returns mintStatus", async function () {
    const mintStatus = await this.chickensWhoCode.mintStatus();
    expect(mintStatus).to.equal(false);
  });

  it("changeMintStatus changes mint status from false to true", async function () {
    const mintStatus = await this.chickensWhoCode.mintStatus();
    expect(mintStatus).to.equal(false);

    await this.chickensWhoCode.changeMintStatus();
    const newMintStatus = await this.chickensWhoCode.mintStatus();
    expect(newMintStatus).to.equal(true);
  });

  it("changePublicMintStatus changes public mint status from false to true", async function () {
    const publicMintStatus = await this.chickensWhoCode.publicMint();
    expect(publicMintStatus).to.equal(false);

    await this.chickensWhoCode.changePublicMintStatus();
    const newPublicMintStatus = await this.chickensWhoCode.publicMint();
    expect(newPublicMintStatus).to.equal(true);
  });

  it("should add addresses to premintList", async function () {
    await this.chickensWhoCode.addAddressToPremintList([
      "0x8DC6e137D62e50E9B0f15908e145F97Aa9335A08",
      "0xF43F83a769c448929AE8049718Bb8D1900FB4048",
      "0xa0ee7a142d267c1f36714e4a8f75612f20a79720",
    ]);

    const walletAddressAdded =
      await this.chickensWhoCode.searchWalletAddressPremint(
        "0x8DC6e137D62e50E9B0f15908e145F97Aa9335A08"
      );

    expect(walletAddressAdded).to.equal(true);

    const walletAddressNotAdded =
      await this.chickensWhoCode.searchWalletAddressPremint(
        "0x4a36d0CAFE9a052493725B99AeF80A70C25598cD"
      );
    expect(walletAddressNotAdded).to.equal(false);
  });

  it("should not allow you to mint if mintStatus is false", async function () {
    const mintStatus = await this.chickensWhoCode.mintStatus();
    if (mintStatus === true) {
      await this.chickensWhoCode.changeMintStatus();
    }

    try {
      await signMintTransaction(
        TEST_ADDRESS5.publicKey,
        TEST_ADDRESS5.privateKey,
        this.contractAddress,
        1,
        0.03
      );
    } catch (error) {
      console.log(error.message);
      expect(error.message).to.equal(
        "VM Exception while processing transaction: reverted with reason string 'Minting not yet open'"
      );
    }
  });

  it("should mint an NFT if you're on premint list", async function () {
    await this.chickensWhoCode.addAddressToPremintList([
      TEST_ADDRESS1.publicKey,
    ]);

    const mintStatus = await this.chickensWhoCode.mintStatus();
    if (mintStatus === false) {
      await this.chickensWhoCode.changeMintStatus();
    }
    const publicMintStatus = await this.chickensWhoCode.publicMint();
    if (publicMintStatus === true) {
      await this.chickensWhoCode.changePublicMintStatus();
    }
    await signMintTransaction(
      TEST_ADDRESS1.publicKey,
      TEST_ADDRESS1.privateKey,
      this.contractAddress,
      1,
      0.03
    );

    const currentToken = await this.chickensWhoCode.currentToken();
    expect(currentToken.toNumber()).to.equal(1);
  });

  it("should not mint an NFT if you're not on premint list", async function () {
    const mintStatus = await this.chickensWhoCode.mintStatus();
    if (mintStatus === false) {
      await this.chickensWhoCode.changeMintStatus();
    }

    const publicMintStatus = await this.chickensWhoCode.publicMint();
    if (publicMintStatus === true) {
      await this.chickensWhoCode.changePublicMintStatus();
    }

    try {
      await signMintTransaction(
        TEST_ADDRESS2.publicKey,
        TEST_ADDRESS2.privateKey,
        this.contractAddress,
        1,
        0.03
      );
    } catch (error) {
      console.log(error.message);
      expect(error.message).to.equal(
        "VM Exception while processing transaction: reverted with reason string 'Exceeded mint limit'"
      );
    }
  });

  it("should not mint an amount of 0 NFTs if you're not on premint list", async function () {
    const mintStatus = await this.chickensWhoCode.mintStatus();
    if (mintStatus === false) {
      await this.chickensWhoCode.changeMintStatus();
    }

    const publicMintStatus = await this.chickensWhoCode.publicMint();
    if (publicMintStatus === true) {
      await this.chickensWhoCode.changePublicMintStatus();
    }

    try {
      await signMintTransaction(
        TEST_ADDRESS2.publicKey,
        TEST_ADDRESS2.privateKey,
        this.contractAddress,
        0,
        0.03
      );
    } catch (error) {
      console.log(error.message);
      expect(error.message).to.equal(
        "VM Exception while processing transaction: reverted with reason string 'Can't mint 0 amount'"
      );
    }
  });

  it("should not allow you mint more than premint limit of 2", async function () {
    const mintStatus = await this.chickensWhoCode.mintStatus();
    if (mintStatus === false) {
      await this.chickensWhoCode.changeMintStatus();
    }
    const publicMintStatus = await this.chickensWhoCode.publicMint();
    if (publicMintStatus === true) {
      await this.chickensWhoCode.changePublicMintStatus();
    }
    try {
      await signMintTransaction(
        TEST_ADDRESS3.publicKey,
        TEST_ADDRESS3.privateKey,
        this.contractAddress,
        3,
        0.03
      );
    } catch (error) {
      console.log(error.message);
      expect(error.message).to.equal(
        "VM Exception while processing transaction: reverted with reason string 'Exceeded mint limit'"
      );
    }
  });

  it("should allow you to mint if you're not on premint list and public mint open", async function () {
    const mintStatus = await this.chickensWhoCode.mintStatus();
    if (mintStatus === false) {
      await this.chickensWhoCode.changeMintStatus();
    }

    const publicMintStatus = await this.chickensWhoCode.publicMint();
    if (publicMintStatus === false) {
      await this.chickensWhoCode.changePublicMintStatus();
    }
    await signMintTransaction(
      TEST_ADDRESS4.publicKey,
      TEST_ADDRESS4.privateKey,
      this.contractAddress,
      9,
      0.03
    );
  });

  it("should not allow you to mint more than 10 at a time during public mint", async function () {
    const mintStatus = await this.chickensWhoCode.mintStatus();
    if (mintStatus === false) {
      await this.chickensWhoCode.changeMintStatus();
    }

    const publicMintStatus = await this.chickensWhoCode.publicMint();
    if (publicMintStatus === false) {
      await this.chickensWhoCode.changePublicMintStatus();
    }
    try {
      await signMintTransaction(
        TEST_ADDRESS4.publicKey,
        TEST_ADDRESS4.privateKey,
        this.contractAddress,
        11,
        0.03
      );
    } catch (error) {
      console.log(error.message);
      expect(error.message).to.equal(
        "VM Exception while processing transaction: reverted with reason string 'Exceeded max token purchase'"
      );
    }
  });

  it("should set a new base URI with setBaseURI", async function () {
    await this.chickensWhoCode.setBaseURI(
      "https://api.smilesss.com/metadata/smilesssvrs/"
    );

    const newBaseURI = await this.chickensWhoCode._baseURIextended();

    expect(newBaseURI).to.equal(
      "https://api.smilesss.com/metadata/smilesssvrs/"
    );

    const firstTokenURI = await this.chickensWhoCode.tokenURI(1);
    expect(firstTokenURI).to.equal(
      "https://api.smilesss.com/metadata/smilesssvrs/1"
    );
  });

  // it("should withdraw all funds to the withdraw address", async function () {
  //   const mintStatus = await this.chickensWhoCode.mintStatus();
  //   if (mintStatus === false) {
  //     await this.chickensWhoCode.changeMintStatus();
  //   }

  //   const publicMintStatus = await this.chickensWhoCode.publicMint();
  //   if (publicMintStatus === false) {
  //     await this.chickensWhoCode.changePublicMintStatus();
  //   }
  //   await signMintTransaction(
  //     TEST_ADDRESS4.publicKey,
  //     TEST_ADDRESS4.privateKey,
  //     this.contractAddress,
  //     9,
  //     0.03
  //   );
  //   const ownerBalance = parseFloat(
  //     parseFloat(
  //       hre.web3.utils.fromWei(
  //         await hre.web3.eth.getBalance(TEST_ADDRESS1.publicKey)
  //       )
  //     ).toFixed(3)
  //   );
  //   console.log(`Owner balance before withdrall: ${ownerBalance}`);
  //   const contractBalanceAfterMint = parseFloat(
  //     parseFloat(
  //       hre.web3.utils.fromWei(
  //         await hre.web3.eth.getBalance(this.contractAddress)
  //       )
  //     ).toFixed(3)
  //   );

  //   console.log(`Contract balance after mint: ${contractBalanceAfterMint}`);

  //   await signSetWithDrawTransaction(
  //     TEST_ADDRESS1.publicKey,
  //     TEST_ADDRESS1.privateKey,
  //     this.contractAddress,
  //     TEST_ADDRESS1.publicKey
  //   );

  //   const withdrawAddress = await this.chickensWhoCode.withdraw_address();
  //   console.log(withdrawAddress);

  //   await signWithdrawTransaction(
  //     TEST_ADDRESS1.publicKey,
  //     TEST_ADDRESS1.privateKey,
  //     this.contractAddress
  //   );

  //   const ownerBalanceAfterWithdrall = parseFloat(
  //     hre.web3.utils.fromWei(
  //       await hre.web3.eth.getBalance(TEST_ADDRESS1.publicKey)
  //     )
  //   ).toFixed(2);

  //   console.log(`Owner balance after withdrall: ${ownerBalanceAfterWithdrall}`);

  //   expect(ownerBalanceAfterWithdrall).to.equal(
  //     (contractBalanceAfterMint + ownerBalance).toFixed(2)
  //   );
  // });
  // it("should not allow you to withdraw all funds to the withdraw address if not owner", async function () {
  //   const mintStatus = await this.chickensWhoCode.mintStatus();
  //   if (mintStatus === false) {
  //     await this.chickensWhoCode.changeMintStatus();
  //   }

  //   const publicMintStatus = await this.chickensWhoCode.publicMint();
  //   if (publicMintStatus === false) {
  //     await this.chickensWhoCode.changePublicMintStatus();
  //   }
  //   await signMintTransaction(
  //     TEST_ADDRESS4.publicKey,
  //     TEST_ADDRESS4.privateKey,
  //     this.contractAddress,
  //     9,
  //     0.03
  //   );
  //   const ownerBalance = parseFloat(
  //     parseFloat(
  //       hre.web3.utils.fromWei(
  //         await hre.web3.eth.getBalance(TEST_ADDRESS1.publicKey)
  //       )
  //     ).toFixed(3)
  //   );
  //   console.log(`Owner balance before withdrall: ${ownerBalance}`);
  //   const contractBalanceAfterMint = parseFloat(
  //     parseFloat(
  //       hre.web3.utils.fromWei(
  //         await hre.web3.eth.getBalance(this.contractAddress)
  //       )
  //     ).toFixed(3)
  //   );

  //   console.log(`Contract balance after mint: ${contractBalanceAfterMint}`);

  //   await signSetWithDrawTransaction(
  //     TEST_ADDRESS1.publicKey,
  //     TEST_ADDRESS1.privateKey,
  //     this.contractAddress,
  //     TEST_ADDRESS1.publicKey
  //   );

  //   const withdrawAddress = await this.chickensWhoCode.withdraw_address();
  //   console.log(withdrawAddress);
    
  //   try {
  //     await signWithdrawTransaction(
  //       TEST_ADDRESS2.publicKey,
  //       TEST_ADDRESS2.privateKey,
  //       this.contractAddress
  //     );
  //   } catch (e) {
  //     console.log(e.message)
  //     expect(e.message).to.equal(
  //       "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
  //     );
  //   }
  // });

  // it("should allow you to set a new wallet address", async function() {
  //   const beforeWithdrawAddress = await this.chickensWhoCode.withdraw_address();
  //   console.log(beforeWithdrawAddress)
  //   await signSetWithDrawTransaction(
  //     TEST_ADDRESS1.publicKey,
  //     TEST_ADDRESS1.privateKey,
  //     this.contractAddress,
  //     TEST_ADDRESS2.publicKey
  //     );
  //   const withdrawAddress = await this.chickensWhoCode.withdraw_address();
  //   console.log(withdrawAddress)
  //   expect(withdrawAddress).to.equal(TEST_ADDRESS2.publicKey);
  // });

  // it("should not allow you to set a new wallet address if not owner", async function() {
  //   const beforeWithdrawAddress = await this.chickensWhoCode.withdraw_address();
  //   console.log(beforeWithdrawAddress)

  //   try {
  //     await signSetWithDrawTransaction(
  //       TEST_ADDRESS2.publicKey,
  //       TEST_ADDRESS2.privateKey,
  //       this.contractAddress,
  //       TEST_ADDRESS2.publicKey
  //       );
  //   } catch (e) {
  //     console.log(e.message)
  //     expect(e.message).to.equal(
  //       "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
  //     );
  //   }
  // });

});
