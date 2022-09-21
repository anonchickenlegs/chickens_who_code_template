async function main() {
  // Grab the contract factory
  const Chickens_Who_Code = await ethers.getContractFactory(
    "Chickens_Who_Code"
  );

  // Start deployment, returning a promise that resolves to a contract object
  const chickensWhoCode = await Chickens_Who_Code.deploy(); // Instance of the contract
  console.log("Contract deployed to address:", chickensWhoCode.address);
}
    
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
