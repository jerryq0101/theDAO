import sdk from './1-initialize-sdk.js';

const app = sdk.getAppModule("0xe7daFa34cAB41D06d1B7928Ca33CBFad59e26136");

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