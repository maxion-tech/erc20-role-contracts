import { ethers } from "hardhat";

async function main() {
  if (!process.env.TOKEN_NAME || !process.env.TOKEN_SYMBOL)
    throw new Error("Please ensure environment variable is complete");
  const ERC20Token = await ethers.getContractFactory("ERC20Token");
  const erc20Token = await ERC20Token.deploy(
    process.env.TOKEN_NAME,
    process.env.TOKEN_SYMBOL
  );

  await erc20Token.deployed();

  console.log(
    `${process.env.TOKEN_SYMBOL} token deployed to ${erc20Token.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
