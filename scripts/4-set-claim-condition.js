import sdk from './1-initialize-sdk.js';

const bundleDrop = sdk.getBundleDropModule(
    "0x94891bBb0ad95a541dCEe30363DEe7Edfc6777F1",
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

