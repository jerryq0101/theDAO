import sdk from './1-initialize-sdk.js';
import {readFileSync} from 'fs';

const bundleDrop = sdk.getBundleDropModule(
    "0x52C85539c26bA42d100F9735E626D4C2d907b97f",
);

(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: "The Airpods",
                description: "These airpods will give you access to the DAO!",
                image: readFileSync("scripts/assets/airpods.png"),
            },
        ]);
        console.log("Successfully created a new NFT in the drop!")
    } catch (error) {
        console.error("Failed to create the new NFT: L", error)
    }
})()