import sdk from "./1-initialize-sdk.js";

// get app module the thirdweb thingy

const appModule = sdk.getAppModule("0xe7daFa34cAB41D06d1B7928Ca33CBFad59e26136");

(async () => {
    try {
        const voteModule = await appModule.deployVoteModule({
            // give governance contract a name;
            name: "theDAO's Proposals",

            // voting token address
            votingTokenAddress: "0x93b336766918b2a9F696A0F4bfB516209EbB95b8",

            // when can people start voting?
            proposalStartWaitTimeInSeconds: 0,

            // how long for the vote on the proposal?
            proposalVotingTimeInSeconds: 24*60*60,

            votingQuorumFraction: 0,
            
            // minimum tokens for a user to start a vote
            minimumNumberOfTokensNeededToPropose: "0",
        });

        console.log("Successfully deployed vote module, address: ", voteModule.address);
    } catch (error ) {
        console.error("Failed to deploy vote module", error);
    }
})();