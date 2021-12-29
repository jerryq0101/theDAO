import sdk from "./1-initialize-sdk.js";

//erc20
const tokenModule = sdk.getTokenModule("0x93b336766918b2a9F696A0F4bfB516209EbB95b8");

(async () => {
    try {
        console.log("Roles that exist right now:", await tokenModule.getAllRoleMembers());

        // revoke all superpowers of my wallet
        await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
        console.log("Roles after revoking ourselves", await tokenModule.getAllRoleMembers());
        console.log("Successfully revoked our superpowers from the erc20 contract");
    } catch (error) {
        console.error ("Failed to revoke our powers from the erc20 contract", error);
    }
})();