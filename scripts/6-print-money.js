import {ethers} from 'ethers';
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
    "0x93b336766918b2a9F696A0F4bfB516209EbB95b8",
);

(async () => {

    try{
    // supply
    const amount = 10_000;
    // convert amount to 18 deci
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);

    // minting tokens using the contract
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();

    console.log(
        "There are now is",
        ethers.utils.formatUnits(totalSupply,18),
        "$THE in circulation",
    );
    }
    catch (error) {
        console.error("Failed to mint tokens: ", error);
    }
})();