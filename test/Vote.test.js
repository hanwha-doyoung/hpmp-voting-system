const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const { ZERO_ADDRESS } = constants

const { assert } = require('chai');
const { web3 } = require('openzeppelin-test-helpers/src/setup');
const VOTE = artifacts.require("Vote");

const PROPOSAL_1 = "proposal1";
const PROPOSAL_2 = "proposal2";
const PROPOSAL_3 = "proposal3";


contract("Vote", async accounts => {
    const chairperson = accounts[0];

    const personA = accounts[1];
    const personB = accounts[2];
    const personC = accounts[3];
    const personD = accounts[4];

    before(async function() {
        // deploy vote
        this.vote = await VOTE.new(
            {from: chairperson}
        );
        console.log(`Vote Contract Address: ${this.vote.address}`);
    });

   it("1. Chairperson adds proposals", async function() {
       await this.vote.addProposal(PROPOSAL_1);
       await this.vote.addProposal(PROPOSAL_2);
       await this.vote.addProposal(PROPOSAL_3);

       console.log(`proposals length : ${await this.vote.getNumberOfProposals()}`);
       assert.equal(await this.vote.getNumberOfProposals(), 3);

       // console.log(`personA : ${await this.vote.getWeight(personA)}`);
       // console.log(`personA : ${await this.vote.getVoted(personA)}`);
       // console.log(`personA : ${await this.vote.getVote(personA)}`);
       // console.log(`personA : ${await this.vote.getDelegate(personA)}`);

   });
    it("2. PersonA votes for proposal1", async function() {
        await this.vote.giveRightToVote(
            personA,
            {from: chairperson}
        );
        await this.vote.vote(
            0,
            {from: personA}
        );

        console.log(`proposal1 voteCount : ${await this.vote.getProposalVoteCount(0)}`);

    });
    it("3-1. PersonB cannot vote because chairperson did not give right to vote", async function() {
        await expectRevert.unspecified(
            this.vote.vote(
                0,
                {from: personB}
            )
        );
    });
    it("4-1. PersonA cannot delegate to PersonB because he has already voted", async function() {
        await expectRevert.unspecified(
            this.vote.delegateTo(
                personB,
                {from: personA}
            )
        );
    });
    it("4-2. PersonC cannot delegate his vote to PersonA because chairperson did not give right to vote", async function() {
        await expectRevert.unspecified(
            this.vote.delegateTo(
                personA,
                {from: personC}
            )
        );
    });
    it("4-3. PersonA cannot delegate to zero address", async function() {
        await expectRevert.unspecified(
            this.vote.delegateTo(
                ZERO_ADDRESS,
                {from: personA}
            )
        );
    });
    it("4-4. PersonA cannot delegate to oneself", async function() {
        await expectRevert.unspecified(
            this.vote.delegateTo(
                personA,
                {from: personA}
            )
        );
    });
    it("5. PersonC delegates his vote to PersonA", async function() {
        await this.vote.giveRightToVote(
            personC,
            {from: chairperson}
        );
        await this.vote.vote(
            0,
            {from: personA}
        );
    });

})