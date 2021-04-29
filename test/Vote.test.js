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
        //deploy vote
        this.vote = await VOTE.new(
            ["Alice", "Peter", "James"],
            {from: chairperson}
        );
        console.log(`Vote Contract Address: ${this.vote.address}`);
    });

   it("1. Chairperson adds proposals", async function() {
       await this.vote.addProposal(PROPOSAL_1);
       await this.vote.addProposal(PROPOSAL_2);
       await this.vote.addProposal(PROPOSAL_3);

       console.log(`proposals length : ${await this.vote.getNumberOfProposals()}`);
       // assert.equal(await this.vote.getNumberOfProposals(), 4);

       // console.log(`personA : ${await this.vote.getWeight(personA)}`);
       // console.log(`personA : ${await this.vote.getVoted(personA)}`);
       // console.log(`personA : ${await this.vote.getVote(personA)}`);
       // console.log(`personA : ${await this.vote.getDelegate(personA)}`);

   });
    it.skip("2. PersonA votes for proposal1", async function() {
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
    it.skip("3-1. PersonB cannot vote because chairperson did not give right to vote", async function() {
        await expectRevert.unspecified(
            this.vote.vote(
                0,
                {from: personB}
            )
        );
    });
    it.skip("4-1. PersonA cannot delegate to PersonB because he has already voted", async function() {
        await expectRevert.unspecified(
            this.vote.delegateTo(
                personB,
                {from: personA}
            )
        );
    });
    it.skip("4-2. PersonC cannot delegate his vote to PersonA because chairperson did not give right to vote", async function() {
        await expectRevert.unspecified(
            this.vote.delegateTo(
                personA,
                {from: personC}
            )
        );
    });
    it.skip("4-3. PersonA cannot delegate to zero address", async function() {
        await expectRevert.unspecified(
            this.vote.delegateTo(
                ZERO_ADDRESS,
                {from: personA}
            )
        );
    });
    it.skip("4-4. PersonA cannot delegate to oneself", async function() {
        await expectRevert.unspecified(
            this.vote.delegateTo(
                personA,
                {from: personA}
            )
        );
    });
    it.skip("5. PersonC delegates his vote to PersonA", async function() {
        await this.vote.giveRightToVote(
            personC,
            {from: chairperson}
        );
        await this.vote.vote(
            0,
            {from: personA}
        );
    });
    it.skip("Test Account Pool", async function() {
        let a = await this.vote.addToPool(
            '0xe0be176939875a6a6648e61545d9e8e766df2275',
            "ewogICAgInZlcnNpb24iOiAzLAogICAgImlkIjogIjllMGRiYmE3LWY3NTEtNDY3ZC1hN2U1LTUwZDAwNGFjNGNkYyIsCiAgICAiYWRkcmVzcyI6ICJlMGJlMTc2OTM5ODc1YTZhNjY0OGU2MTU0NWQ5ZThlNzY2ZGYyMjc1IiwKICAgICJjcnlwdG8iOiB7CiAgICAgICJjaXBoZXJ0ZXh0IjogImNiZDdmMTU0Y2U4MDk4YmJmYjVkMjA3N2JlMmQ2NDkzMDQwZTExMDc1MDM2NDE0YTMyYzJhYWRhNzhiNjAzYzIiLAogICAgICAiY2lwaGVycGFyYW1zIjogewogICAgICAgICJpdiI6ICIxZjcxYjFkNTY3NzI3NDJmNjZlNGZjYTcwZTA2NjlhYiIKICAgICAgfSwKICAgICAgImNpcGhlciI6ICJhZXMtMTI4LWN0ciIsCiAgICAgICJrZGYiOiAic2NyeXB0IiwKICAgICAgImtkZnBhcmFtcyI6IHsKICAgICAgICAiZGtsZW4iOiAzMiwKICAgICAgICAic2FsdCI6ICIwYWMyMzdjZjc2MjVkOTkzMjFjOTQyM2M1YTE4MWY2YTVkZDVkMzJlMTVlOTYyZmI1MDgyMmQxNmQ1ZDMxMDhmIiwKICAgICAgICAibiI6IDgxOTIsCiAgICAgICAgInIiOiA4LAogICAgICAgICJwIjogMQogICAgICB9LAogICAgICAibWFjIjogImVkNDQwMTY4NmM5ZTE0OGE4YjE0Yjg2ZGJlZTA3NWI0YWI4ZTEzYzEyMmNiZDU2ZjRlZjhlMGJmNWQzZGFlNDYiCiAgICB9CiAgfQ==\n",
            "1234",
            {from: chairperson}
        );
        console.log(await this.vote.getAddress(0));

        await this.vote.addToPool(
            '0xe0be176939875a6a6648e61545d9e8e766df2276',
            "ewogICAgInZlcnNpb24iOiAzLAogICAgImlkIjogIjllMGRiYmE3LWY3NTEtNDY3ZC1hN2U1LTUwZDAwNGFjNGNkYyIsCiAgICAiYWRkcmVzcyI6ICJlMGJlMTc2OTM5ODc1YTZhNjY0OGU2MTU0NWQ5ZThlNzY2ZGYyMjc1IiwKICAgICJjcnlwdG8iOiB7CiAgICAgICJjaXBoZXJ0ZXh0IjogImNiZDdmMTU0Y2U4MDk4YmJmYjVkMjA3N2JlMmQ2NDkzMDQwZTExMDc1MDM2NDE0YTMyYzJhYWRhNzhiNjAzYzIiLAogICAgICAiY2lwaGVycGFyYW1zIjogewogICAgICAgICJpdiI6ICIxZjcxYjFkNTY3NzI3NDJmNjZlNGZjYTcwZTA2NjlhYiIKICAgICAgfSwKICAgICAgImNpcGhlciI6ICJhZXMtMTI4LWN0ciIsCiAgICAgICJrZGYiOiAic2NyeXB0IiwKICAgICAgImtkZnBhcmFtcyI6IHsKICAgICAgICAiZGtsZW4iOiAzMiwKICAgICAgICAic2FsdCI6ICIwYWMyMzdjZjc2MjVkOTkzMjFjOTQyM2M1YTE4MWY2YTVkZDVkMzJlMTVlOTYyZmI1MDgyMmQxNmQ1ZDMxMDhmIiwKICAgICAgICAibiI6IDgxOTIsCiAgICAgICAgInIiOiA4LAogICAgICAgICJwIjogMQogICAgICB9LAogICAgICAibWFjIjogImVkNDQwMTY4NmM5ZTE0OGE4YjE0Yjg2ZGJlZTA3NWI0YWI4ZTEzYzEyMmNiZDU2ZjRlZjhlMGJmNWQzZGFlNDYiCiAgICB9CiAgfQ==\n",
            "2222",
            {from: chairperson}
        );
        console.log(await this.vote.getAddress(1));
        console.log(await this.vote.accountPool.length);

        await this.vote.addToPool(
            '0xe0be176939875a6a6648e61545d9e8e766df2277',
            "ewogICAgInZlcnNpb24iOiAzLAogICAgImlkIjogIjllMGRiYmE3LWY3NTEtNDY3ZC1hN2U1LTUwZDAwNGFjNGNkYyIsCiAgICAiYWRkcmVzcyI6ICJlMGJlMTc2OTM5ODc1YTZhNjY0OGU2MTU0NWQ5ZThlNzY2ZGYyMjc1IiwKICAgICJjcnlwdG8iOiB7CiAgICAgICJjaXBoZXJ0ZXh0IjogImNiZDdmMTU0Y2U4MDk4YmJmYjVkMjA3N2JlMmQ2NDkzMDQwZTExMDc1MDM2NDE0YTMyYzJhYWRhNzhiNjAzYzIiLAogICAgICAiY2lwaGVycGFyYW1zIjogewogICAgICAgICJpdiI6ICIxZjcxYjFkNTY3NzI3NDJmNjZlNGZjYTcwZTA2NjlhYiIKICAgICAgfSwKICAgICAgImNpcGhlciI6ICJhZXMtMTI4LWN0ciIsCiAgICAgICJrZGYiOiAic2NyeXB0IiwKICAgICAgImtkZnBhcmFtcyI6IHsKICAgICAgICAiZGtsZW4iOiAzMiwKICAgICAgICAic2FsdCI6ICIwYWMyMzdjZjc2MjVkOTkzMjFjOTQyM2M1YTE4MWY2YTVkZDVkMzJlMTVlOTYyZmI1MDgyMmQxNmQ1ZDMxMDhmIiwKICAgICAgICAibiI6IDgxOTIsCiAgICAgICAgInIiOiA4LAogICAgICAgICJwIjogMQogICAgICB9LAogICAgICAibWFjIjogImVkNDQwMTY4NmM5ZTE0OGE4YjE0Yjg2ZGJlZTA3NWI0YWI4ZTEzYzEyMmNiZDU2ZjRlZjhlMGJmNWQzZGFlNDYiCiAgICB9CiAgfQ==\n",
            "3333",
            {from: chairperson}
        );
        await this.vote.addToPool(
            '0xe0be176939875a6a6648e61545d9e8e766df2278',
            "ewogICAgInZlcnNpb24iOiAzLAogICAgImlkIjogIjllMGRiYmE3LWY3NTEtNDY3ZC1hN2U1LTUwZDAwNGFjNGNkYyIsCiAgICAiYWRkcmVzcyI6ICJlMGJlMTc2OTM5ODc1YTZhNjY0OGU2MTU0NWQ5ZThlNzY2ZGYyMjc1IiwKICAgICJjcnlwdG8iOiB7CiAgICAgICJjaXBoZXJ0ZXh0IjogImNiZDdmMTU0Y2U4MDk4YmJmYjVkMjA3N2JlMmQ2NDkzMDQwZTExMDc1MDM2NDE0YTMyYzJhYWRhNzhiNjAzYzIiLAogICAgICAiY2lwaGVycGFyYW1zIjogewogICAgICAgICJpdiI6ICIxZjcxYjFkNTY3NzI3NDJmNjZlNGZjYTcwZTA2NjlhYiIKICAgICAgfSwKICAgICAgImNpcGhlciI6ICJhZXMtMTI4LWN0ciIsCiAgICAgICJrZGYiOiAic2NyeXB0IiwKICAgICAgImtkZnBhcmFtcyI6IHsKICAgICAgICAiZGtsZW4iOiAzMiwKICAgICAgICAic2FsdCI6ICIwYWMyMzdjZjc2MjVkOTkzMjFjOTQyM2M1YTE4MWY2YTVkZDVkMzJlMTVlOTYyZmI1MDgyMmQxNmQ1ZDMxMDhmIiwKICAgICAgICAibiI6IDgxOTIsCiAgICAgICAgInIiOiA4LAogICAgICAgICJwIjogMQogICAgICB9LAogICAgICAibWFjIjogImVkNDQwMTY4NmM5ZTE0OGE4YjE0Yjg2ZGJlZTA3NWI0YWI4ZTEzYzEyMmNiZDU2ZjRlZjhlMGJmNWQzZGFlNDYiCiAgICB9CiAgfQ==\n",
            "4444",
            {from: chairperson}
        );

        console.log(await this.vote.getAddress(0));
        console.log(await this.vote.getAddress(1));
        console.log(await this.vote.getAddress(2));
        console.log(await this.vote.getAddress(3));



        console.log(await this.vote.accountPool.length);
        // console.log(await this.vote.giveAccount());
        // console.log(await this.vote.giveAccount());
        // console.log(await this.vote.giveAccount());
        // console.log(await this.vote.giveAccount());

    })

})


