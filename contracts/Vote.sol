pragma solidity 0.5.0;
pragma experimental ABIEncoderV2;

contract Vote {
    struct Voter {
        uint weight;
        bool voted;
        uint vote;
    }

    struct Proposal {
        string name;
        uint voteCount;
    }

    struct Account {
        address eoa;
        string passphrase;
        string keystore;
    }

    event rightToVoteGiven(address voter);
    event voted(address voter);
    event proposalAdded(string proposal);
    event accountAdded(address eoa);

    modifier onlyChairperson() {
        require(_isChairperson(), "Not Authorized");
        _;
    }


    address public chairperson;
    Proposal[] public proposals;
    Account[] public accountPool;

    // mapping from voter address to Voter struct
    mapping(address => Voter) internal _voters;

    /**
     * @dev Initialize Voting System
     */
    constructor(string[] memory input) public {
        chairperson = msg.sender;
        // To make proposal[0] empty
        addProposal("EMPTY");
        for(uint8 i=0; i<input.length; i++) {
            addProposal(input[i]);
        }
    }

    /**
     * @dev Check if msg.sender is chairperson
     * @return true if `msg.sender` is the owner of the contract
     */
    function _isChairperson() internal view returns (bool) {
        return msg.sender == chairperson;
    }


    function _rand() private view returns(uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(
                block.timestamp + block.difficulty +
                ((uint256(keccak256(abi.encodePacked(block.coinbase)))) / (now)) +
                block.gaslimit +
                ((uint256(keccak256(abi.encodePacked(msg.sender)))) / (now)) +
                block.number
            )));

        return (seed - ((seed / 1000) * 1000))%accountPool.length;
    }


    function addToPool(address e, string memory p, string memory k) public onlyChairperson returns (uint) {
        giveRightToVote(e);
        accountPool.push(Account({
            eoa: e,
            passphrase: p,
            keystore: k
        }));
        emit accountAdded(e);

        return accountPool.length;
    }

    function getAddress(uint256 i) public view returns (address) {
        return accountPool[i].eoa;
    }


    function giveAccount() public view returns (Account memory) {
        return accountPool[_rand()];
    }
    /**
     * @dev Check if msg.sender is chairperson
     * @return true if `msg.sender` is the owner of the contract
     */
    function isChairperson(address sender) public view returns (bool) {
        return sender == chairperson;
    }
    /**
     * @dev Get address of chairperson
     * @return address of chairperson
     */
    function getChairperson() public view returns (address) {
        return chairperson;
    }

    /**
    * @dev Get weight of the voter
    * @return weight of the voter
    */
    function getWeight(address voter) public view returns (uint) {
        return _voters[voter].weight;
    }

    /**
    * @dev Check if voter has voted
    * @return true if voter has already voted
    */
    function getVoted(address voter) public view returns (bool) {
        return _voters[voter].voted;
    }

    /**
     * @dev Give voting right to a voter by the chairperson
     * @param voter Address of the voter that will receive the right to vote
     */
    function giveRightToVote(address voter) public onlyChairperson {
        require(!_voters[voter].voted);
        _voters[voter].weight = 1;

        emit rightToVoteGiven(voter);
    }

    /**
     * @dev Adds proposal by the chairperson
     * @param proposalName Name of the proposal that will be added
     */
    function addProposal(string memory proposalName) public onlyChairperson {
        proposals.push(Proposal({
            name : proposalName,
            voteCount : 0
        }));

        emit proposalAdded(proposalName);
    }

    function getAllProposals() public view returns(string[] memory) {
        string[] memory result = new string[](proposals.length);
        for(uint8 i=0; i<proposals.length; i++) {
            result[i] = proposals[i].name;
        }
        return result;
    }

    function getProposalName(uint idx) public view returns (string memory) {
        return proposals[idx].name;
    }
    function getProposalVoteCount(uint idx) public view returns (uint) {
        return proposals[idx].voteCount;
    }

    function getAllProposalVoteCount() public view returns (uint[] memory) {
        uint[] memory result = new uint[](proposals.length);
        for(uint8 i=0; i<proposals.length; i++) {
            result[i] = getProposalVoteCount(i);
        }
        return result;
    }

    function getNumberOfProposals() public view returns (uint) {
        return proposals.length;
    }

    /**
     * @dev Voter votes for the proposal
     * @param proposal Index of the proposal that voter will vote for
     */
    function vote(uint proposal) public {
        Voter memory sender = _voters[msg.sender];
        require(!sender.voted);
        require(sender.weight > 0);

        sender.voted = true;
        sender.vote = proposal;

        proposals[proposal].voteCount += sender.weight;

        emit voted(msg.sender);
    }

    /**
     * @dev Get the proposal of the most votes(index of the proposal)
     * @return index of the proposal of the most votes
     */
    function winningProposal() public view returns (uint) {
        uint winningVoteCount = 0;
        uint winningProposalIdx = 0;
        for(uint p = 0; p < proposals.length; p++) {
            if(proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposalIdx = p;
            }
        }
        return winningProposalIdx;
    }

    /**
     * @dev Get the proposal name of the most votes
     * @return name of the proposal of the most votes
     */
    function winnerName() public view returns (string memory) {
        return proposals[winningProposal()].name;
    }

}