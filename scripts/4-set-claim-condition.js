import sdk from './1-initialize-sdk.js';

const bundleDrop = sdk.getBundleDropModule(
    "0x52C85539c26bA42d100F9735E626D4C2d907b97f",
);

(async () => {
    try {
        const claimConditionFactory = bundleDrop.getClaimConditionFactory();
        claimConditionFactory.newClaimPhase({
            startTime: new Date(),
            maxQuantity: 10_000,
            maxQuantityPerTransaction: 1,
        });

        await bundleDrop.setClaimCondition(0, claimConditionFactory);
        console.log("Successfully set claim condition on bundle drop: ", bundleDrop.address);
    } catch (error) {
        console.error("Failed to set claim condition: ", error);
    }
})()

