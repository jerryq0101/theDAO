import sdk from './1-initialize-sdk.js';
import {readFileSync} from 'fs';

const bundleDrop = sdk.getBundleDropModule(
    "0x94891bBb0ad95a541dCEe30363DEe7Edfc6777F1",
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