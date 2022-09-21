# ropsten network location 
`https://ropsten.etherscan.io/address/0x2ea2B80043522DA651e7CfD5B0031957F7467F6E#code`

# interacting with network
`npx hardhat run scripts/<node.js file>`

# deploying a contract to a network
`npx hardhat run scripts/deploy.js --network <network>` 

# verify your contract 
`npx hardhat verify --network rinkeby 0x7A8e6b1daFb2720EA19F09892432B71B66DC59a8`

# re compile contract
`npx hardhat compile`

# sequelize 
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all

# pushing subdirectory to heroku
git subtree push --prefix frontend/ heroku main

# how to run tests
`npx hardhat test`

