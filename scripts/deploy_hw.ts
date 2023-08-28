import { ethers } from "hardhat";
import { LedgerSigner } from "@ethersproject/hardware-wallets";
import hre from "hardhat";

async function main() {
  if (!process.env.TOKEN_NAME || !process.env.TOKEN_SYMBOL || !process.env.ADMIN_ADDRESS)
    throw new Error("Please ensure environment variable is complete");

  const networkUrl = (hre.network.config as any).url;

  if (!networkUrl) throw new Error("Please make sure all environment variable is loaded");

  //

  const provider = new ethers.providers.JsonRpcProvider(networkUrl);
  const type = 'hid';
  const path = `m/44'/60'/0'/0/0`;
  const signer = new LedgerSigner(provider, type, path);

  const address = await signer.getAddress();

  console.log(`Deploying from ${address}`);

  //

  const ERC20Token = await ethers.getContractFactory("ERC20Token");
  const erc20Token = await ERC20Token.connect(signer).deploy(
    process.env.TOKEN_NAME,
    process.env.TOKEN_SYMBOL,
    process.env.ADMIN_ADDRESS,
  );

  await erc20Token.deployed();

  console.log(
    `${process.env.TOKEN_SYMBOL} token deployed to ${erc20Token.address}`
  );

  console.log(`Verify with: npx hardhat verify --network ${hre.network.name} ${erc20Token.address} "${process.env.TOKEN_NAME}" "${process.env.TOKEN_SYMBOL}" ${process.env.ADMIN_ADDRESS}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
