import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0xEA05ca8bAC4707E1D147149762b19bC319Ae2EC8");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule(
            {
                // The collection name
                name: "the Membership",

                description: "It is the DAO",
                image: readFileSync("scripts/assets/hotdog.jpg"),

                primarySaleRecipientAddress: "0x328f4fade8026b82D0fcA401BDc4A230Cca77664",
            }
        );

        console.log(
            "Successfully deployed bundledrop module, address:",
            bundleDropModule.address
        );

        console.log(
            "Bundledrop metadata:",
            await bundleDropModule.getMetadata()
        );

    } catch (error) {
        console.log("failed to deploy, error: ", error);
    }
})()