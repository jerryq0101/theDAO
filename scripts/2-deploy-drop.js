import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0xe7daFa34cAB41D06d1B7928Ca33CBFad59e26136");

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