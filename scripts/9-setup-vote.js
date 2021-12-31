import {ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// governance contract
const voteModule = sdk.getVoteModule("0x010F127FA91e0f6187341f20F4916505a210Ad74");

//erc 20 contract
const tokenModule = sdk.getTokenModule("0xF6Ee7D41532570306497209f216296f2bBf70877");

(async ()=>{
    try {
        // give treasury power to mint tokens
        await tokenModule.grantRole("minter", voteModule.address);

        console.log("Successfully gave vote module permissions to act on token module");
    } catch (error) {
        console.error("Failed to grant vote module permissions on token module", error);
        process.exit(1);
    }

    try {
        // get token balance
        const ownedTokenBalance = await tokenModule.balanceOf(process.env.WALLET_ADDRESS);

        // get 90% of supply 
        const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
        const percent90 = ownedAmount.div(10).mul(9);

        // give 90% to contract 
        await tokenModule.transfer(
            voteModule.address,
            percent90
        );

        console.log("Successfully transferred tokens to vote module");
    } catch (error) {
        console.error("Failed to transfer tokens to vote module", error)
    }
})();