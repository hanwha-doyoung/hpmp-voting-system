pragma solidity 0.5.0;

contract Vote {
    struct Voter {
        uint weight;
        bool voted;
        uint vote;
        // address delegate;
    }

    struct Proposal {
        string name;
        uint voteCount;
    }

    event rightToVoteGiven(address voter);
    // event delegated(address voter, address delegate);
    event voted(address voter);
    event proposalAdded(string proposal);

    modifier onlyChairperson() {
        require(_isChairperson(), "Not Authorized");
        _;
    }


    address public chairperson;
    Proposal[] public proposals;
    // mapping from voter address to Voter struct
    mapping(address => Voter) internal _voters;


    /**
     * @dev Initialize Voting System
     */
    constructor () public {
        chairperson = msg.sender;
//        voters[chairperson].weight = 1;
        // To make proposal[0] empty
        addProposal("EMPTY");
    }

    /**
     * @dev Check if msg.sender is chairperson
     * @return true if `msg.sender` is the owner of the contract
     */
    function _isChairperson() internal view returns (bool) {
        return msg.sender == chairperson;
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
    * @dev Get index of proposal that voter has voted for
    * @return index of the proposal
    */
    // TODO: delete for final version, use only for checking when testing
    function getVote(address voter) public view returns (uint) {
        return _voters[voter].vote;
    }

    /**
    * @dev Get index of proposal that voter has voted for
    * @return index of the proposal
    */
//    function getDelegate(address voter) public view returns (address) {
//        return _voters[voter].delegate;
//    }

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

    function getProposalName(uint idx) public view returns (string memory) {
        return proposals[idx].name;
    }
    function getProposalVoteCount(uint idx) public view returns (uint) {
        return proposals[idx].voteCount;
    }

    function getNumberOfProposals() public view returns (uint) {
        return proposals.length;
    }
    /**
     * @dev Delegates voting right to another person
     * @param to Address of the delegate who will receive the right to vote of the sender
     */
//    function delegateTo(address to) public {
//        Voter memory sender = _voters[msg.sender];
//        require(!sender.voted, "Already voted account");
//        require(sender.weight > 0, "Right to vote not given by the chairperson");
//
//        // delegate should not be ZERO_ADDRESS and voter(msg.sender) self
//        require(_voters[to].delegate != address(0), "Cannot delegate to Zero Address");
//        require(_voters[to].delegate != msg.sender, "Cannot delegate to oneself");
//        to = _voters[to].delegate;
//
//        sender.voted = true;
//        sender.delegate = to;
//
//        emit delegated(msg.sender, to);
//
//        Voter memory delegate = _voters[to];
//        if(delegate.voted) { // if delegate has already voted(using his/her vote right, the delegated vote will also be the same as the given vote)
//            proposals[delegate.vote].voteCount += sender.weight;
//        } else { // if delegate has not voted, gives sender's vote right
//            delegate.weight += sender.weight;
//        }
//    }

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