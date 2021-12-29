import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// erc1155 nft membership contract
const bundleDropModule = sdk.getBundleDropModule("0x52C85539c26bA42d100F9735E626D4C2d907b97f");

// erc20 token
const tokenModule = sdk.getTokenModule("0x93b336766918b2a9F696A0F4bfB516209EbB95b8");

(async () => {
    try {
        // grab people who own the membership nft
        const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0")
        
        if (walletAddresses.length === 0) {
            console.log(
                "No NFTs have been claimed yet , maybe get some friends to claim your free NFTS!",
            );
            process.exit(0);
        }

        // loop through the array of addresses/
        const airdropTargets = walletAddresses.map((address) => {
            // pick random # from 10 to 100
            const randomAmount = Math.floor(Math.random() * (100 - 10 + 1) + 10);
            console.log("Going to airdrop", randomAmount, "Tokens to", address);

            const airdropTarget = {
                address,
                amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
            };

            return airdropTarget
        });

        console.log("Starting airdrop!!!")
        await tokenModule.transferBatch(airdropTargets);
        console.log("Successfully airdropped tokens to all the holders of the NFT!!!");
    } catch (error){
        console.error("Failed to airdrop to the holders:", error)
    }
})();