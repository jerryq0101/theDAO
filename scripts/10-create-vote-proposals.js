import {ethers} from "ethers";
import sdk from "./1-initialize-sdk.js";

//the voting contract
const voteModule = sdk.getVoteModule("0xea81b38fB40D71A38bEcB5e4c53af336663889B2");

// erc 20 contract 
const tokenModule = sdk.getTokenModule("0x93b336766918b2a9F696A0F4bfB516209EbB95b8");

(async () => {
    try {
        const amount = 1_000;
        // proposal to mint 1000 more tokens to the treasury 

    
            await voteModule.propose(
                "Should theDAO mint an additional " + amount + " Tokens into the treasury?", 
                [
                    {
                        // we want to send 0 eth (native token) in the proposal
                        nativeTokenValue: 0,
                        transactionData: tokenModule.contract.interface.encodeFunctionData(
                            // do a mint!. minting to the votemodule
                            "mint", 
                            [
                                voteModule.address,
                                ethers.utils.parseUnits(amount.toString(), 18),
                            ]
                        ),
                        // tokenModule executes the mint
                        toAddress: tokenModule.address,
                    },
                ]
            );
            console.log("Created proposal to mint tokens!");
    } 
    catch (error) {
        console.error("Failed to create first proposal", error);
        process.exit(1);
    }

    try {
        const amount = 100;
        // proposal to transfer 100 tokens to our own eth address because we are goat

        await voteModule.propose(
            "Should theDAO transfer " +amount + " Tokens to " + process.env.WALLET_ADDRESS + " for being a goat?",
            [
                {
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        // a transfer to us
                        "transfer",
                        [
                            process.env.WALLET_ADDRESS,
                            ethers.utils.parseUnits(amount.toString(), 18),
                        ]
                    ),
                    // executes the transfer
                    toAddress: tokenModule.address,
                }
            ]
        )
        console.log("Successfully created proposal to give ourself 100 tokens");
    } catch (error) {
        console.error ("Failed to create second proposal", error);
    }
})();