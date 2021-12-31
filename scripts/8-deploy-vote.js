import sdk from "./1-initialize-sdk.js";

// get app module the thirdweb thingy

const appModule = sdk.getAppModule("0xEA05ca8bAC4707E1D147149762b19bC319Ae2EC8");

(async () => {
    try {
        const voteModule = await appModule.deployVoteModule({
            // give governance contract a name;
            name: "theDAO's Proposals",

            // voting token address
            votingTokenAddress: "0xF6Ee7D41532570306497209f216296f2bBf70877",

            // when can people start voting?
            proposalStartWaitTimeInSeconds: 0,

            // how long for the vote on the proposal?
            proposalVotingTimeInSeconds: 60*30,

            votingQuorumFraction: 0,
            
            // minimum tokens for a user to start a vote
            minimumNumberOfTokensNeededToPropose: "0",
        });

        console.log("Successfully deployed vote module, address: ", voteModule.address);
    } catch (error ) {
        console.error("Failed to deploy vote module", error);
    }
})();