import sdk from './1-initialize-sdk.js';

const app = sdk.getAppModule("0xEA05ca8bAC4707E1D147149762b19bC319Ae2EC8");

(async () => {
    try {
        // deploy erc20 contract
        const tokenModule = await app.deployTokenModule({
            // token name?
            name: "theDAO Governance Token",
            symbol: "THE",

        });

        console.log("✅ Successfully deployed token module, Address: ", tokenModule.address);
    }
    catch (error) {
        console.error("Deployment of governance token Failed: ", error);
    }
})();