import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { useEffect, useMemo, useState } from "react";
import {ThirdwebSDK} from '@3rdweb/sdk';
// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";
import {ethers} from "ethers"
// unsupported network error
import {UnsupportedChainIdError} from "@web3-react/core";

const sdk = new ThirdwebSDK("rinkeby");

//refence to the erc1155
const bundleDropModule = sdk.getBundleDropModule(
  "0x52C85539c26bA42d100F9735E626D4C2d907b97f",
);


function App() {

  const {connectWallet, address, error, provider} = useWeb3()
  console.log("Address: ", address)

  //signer required to sign txs on chain
  // without the thing we can only read not write 
  const signer = provider ? provider.getSigner() : undefined;

  // variable for havethey claimed the nft yet?
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // is claiming the nft right now? 
  const [isClaiming, setIsClaiming] = useState(false);

  /* DAO MAIN PAGE CONSTRUCTION */ 

  // section 3 last part
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // getting all proposals 
  useEffect (() => {
    if (!hasClaimedNFT) {
      return;
    } 
    // to get all proposals
    (async () => {

      try {
        // list of proposals
        const pr = await voteModule.getAll();
        // set the state
        setProposals(pr);
        console.log("Proposals: ", proposals);
      } 
      catch (error) {
        console.error("Failed to get proposals", error);
      }
    })();
    
  }, [hasClaimedNFT]);

  // check if user had voted 
  useEffect(() => {
    if (!hasClaimedNFT){
      return;
    }


    // check if finished retrieving proposals from useeffect
    if (!proposals.length) {
      return;
    }

    // check if user has voted on first proposal 
    (async () => {
      try {
        const hasVoted = await voteModule.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted){
          console.log("User has already voted")
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);
      }
    })();
    
  }, [hasClaimedNFT, proposals, address]);

  // erc 1155
      const bundleDropModule = sdk.getBundleDropModule("0x52C85539c26bA42d100F9735E626D4C2d907b97f");
      //erc20
      const tokenModule = sdk.getTokenModule(
          "0x93b336766918b2a9F696A0F4bfB516209EbB95b8",
      );
      // vote contract
      const voteModule = sdk.getVoteModule("0xea81b38fB40D71A38bEcB5e4c53af336663889B2");


      // amount of token each member in a state
      const [memberTokenAmounts, setMemberTokenAmounts] = useState({});

      // array of member addresses
      const [memberAddresses, setMemberAddresses] = useState([]);

      // shortens wallet address;
      const shortenAddress = (str) => {
          return str.substring(0, 6) + "..." + str.substring(str.length -4);
      }


      // Addresses get 
      useEffect(() => {

          // no member
          if (!hasClaimedNFT) {
              return;
          }
          (async () => {
          try {
              // get token holder id 0
              const addresses = await bundleDropModule.getAllClaimerAddresses("0");
              // state thingy for addresses
              setMemberAddresses(addresses);
          } catch (error) {
              console.error("Failed to get member list: ", error);
          }
          })();

          
      }, [hasClaimedNFT]);

      // Grab the balances
      useEffect(() => {

          // not members yet
          if (!hasClaimedNFT) {
              return;
          }

          (async () => {
          try {    
              // get all of the balances
              const userbalances = await tokenModule.getAllHolderBalances();
              setMemberTokenAmounts(userbalances);
              console.log("Amounts: ", userbalances)
          }
          catch (error ) {
              console.error("Failed to get token amounts", error)
          }
          }
          )();
      }, [hasClaimedNFT]);


      // combine it all together 
      const memberList = useMemo(() => {
          return memberAddresses.map((address) => {
              return {
                  address,
                  tokenAmount: ethers.utils.formatUnits(memberTokenAmounts[address] || 0,
                      18, 
                  ),
              };
          });
      }, [memberAddresses, memberTokenAmounts]);


  /* DAO MAIN PAGE CONSTRUCTION END */ 

  /*
    Doing the part for the proposal creation 
  */

  // Create two states
  const [proposeDetails, setProposeDetails] = useState({
    address: "",
    amount: 0,
  }); 

  // Handles the input thingys
  function handleProposal(event){
    const varName = event.target.id;
    const newVal = event.target.value;
    setProposeDetails((prevState) => {
      return (
        {
          ...prevState,
          [varName]: newVal
        }
      )
    });
  }

  const [isCreatingNewProposal, setIsCreatingNewProposal] = useState(false);
  const [finishedCreationProposal, setFinishedCreationProposal] = useState(false);
  // Submit the new proposal onto site

  async function handleSubmitProposal(){
    if (!hasClaimedNFT){
      return;
    }

    const usrAddress = proposeDetails.address;
    const amount = proposeDetails.amount;

    // Proposal to transfer the [amount] of tokens into [usrAddress]
    (async () => {
      try {
        setIsCreatingNewProposal(true);
        await voteModule.propose(
         "Should theDAO mint an additional " + amount + " Tokens and transfer it to " + usrAddress + "?",
         [ 
            { // the mint
                nativeTokenValue: 0,
                transactionData: tokenModule.contract.interface.encodeFunctionData(
                  "mint",
                  [
                    voteModule.address,
                    ethers.utils.parseUnits(amount.toString(), 18),
                  ]
                ),
                toAddress: tokenModule.address,
            },

            { // the transfer
              nativeTokenValue: 0,
              transactionData: tokenModule.contract.interface.encodeFunctionData(
                "transfer", 
                [
                  usrAddress,
                  ethers.utils.parseUnits(amount.toString(), 18)
                ]
              ),
              toAddress: tokenModule.address,
            }
         ]
       )
       setIsCreatingNewProposal(false);
       setFinishedCreationProposal(true);
       console.log("Successfully created new proposal! ");

       

      } catch (error) {
        console.error("Failed to create new proposal", error);
      }

    })();
  }

  // Temp fix for the reloading problem
  let displayButtonText;
  if (!isCreatingNewProposal && !finishedCreationProposal){
    displayButtonText = "Submit Request!"
  } else if (isCreatingNewProposal){
    displayButtonText = "Creating Proposal! Wait up"
  } else if (finishedCreationProposal){
    displayButtonText = "Finished Creation! Reload the site!"
  }
  
  
  useEffect(() => {
    // passing the signer to sdk
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    // exist if no address
    if (!address) {
      return;
    }
    // does the address have nft? 
    return bundleDropModule.balanceOf(address, "0")
    .then((balance) => {
      // gt = greater than something
      if (balance.gt(0)) {
        setHasClaimedNFT(true);
        console.log("this user has a membership NFT")
      } else {
        setHasClaimedNFT(false);
        console.log("THis user doesn't have a membership nft.")
      }
    })
    .catch((error) => {
      setHasClaimedNFT(false);
      console.error("Failed to nft balance", error);
    });
  }, [address]);

  if (error instanceof UnsupportedChainIdError) {
    return (
      <div className="unsupported-network">
        <h2>Please Connect to Rinkeby, I am begging you</h2>
        <p>
          This dapp only works on the rinkeby network, please
          switch networks in metamask or something
        </p>
      </div>
    )
  }


  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to theDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet 
        </button>
      </div>
    )
  }

  



  // DAO Main Page for nft claimed people
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>theDAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* new part  */}
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  let voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await tokenModule.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === ethers.constants.AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await tokenModule.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async (vote) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await voteModule.get(vote.proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return voteModule.vote(vote.proposalId, vote.vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async (vote) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await voteModule.get(
                            vote.proposalId
                          );

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return voteModule.execute(vote.proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal, index) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + vote.type}
                          name={proposal.proposalId}
                          value={vote.type}
                          //default the "abstain" vote to chedked
                          defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + vote.type}>
                          {vote.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            </form>
          </div>
          
          {/* Create a proposal form */}


          <div className="proposalCreation">
            <h2>Propose a deposit into an address</h2>
            <form>
              <input id="address" type="text" placeholder="Address to Mint To" onChange={handleProposal}></input>
              <input id="amount" type="text" placeholder="Amount of Coins To transfer" onChange={handleProposal}></input>
            </form>
            <button className="submitProposal" onClick={handleSubmitProposal}>
              {displayButtonText}
            </button>
                
          </div>

        </div>
      </div>
    );
  };

  const mintNft = () => {
    console.log("clicked!")
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
    .claim("0", 1)
    .then(() => {
      // Set claim state.
      setHasClaimedNFT(true);
      // Show user their fancy new NFT!
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      );
    })
    .catch((err) => {
      console.error("failed to claim", err);
    })
    .finally(() => {
      // Stop loading state.
      setIsClaiming(false);
    });
  }

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free the Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
}

export default App;