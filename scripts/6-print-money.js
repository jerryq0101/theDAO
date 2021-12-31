import {ethers} from 'ethers';
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
    "0xF6Ee7D41532570306497209f216296f2bBf70877",
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