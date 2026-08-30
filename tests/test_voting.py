import pytest
import ape


@pytest.fixture
def owner(accounts):
    return accounts[0]


@pytest.fixture
def voter1(accounts):
    return accounts[1]


@pytest.fixture
def voter2(accounts):
    return accounts[2]


@pytest.fixture
def voting(owner, project):
    return owner.deploy(project.Voting, 10)  # 10-minute voting window


def test_only_owner_can_add_candidates(voting, owner, voter1):
    voting.addCandidate("Alice", sender=owner)

    with ape.reverts("OwnableUnauthorizedAccount"):
        voting.addCandidate("Bob", sender=voter1)


def test_valid_vote_is_recorded(voting, owner, voter1):
    voting.addCandidate("Alice", sender=owner)
    voting.vote(1, sender=voter1)

    _, _, vote_count = voting.getCandidate(1)
    assert vote_count == 1
    assert voting.hasVoted(voter1) is True


def test_rejects_double_voting(voting, owner, voter1):
    voting.addCandidate("Alice", sender=owner)
    voting.vote(1, sender=voter1)

    with ape.reverts("Already voted"):
        voting.vote(1, sender=voter1)


def test_rejects_invalid_candidate(voting, owner, voter1):
    voting.addCandidate("Alice", sender=owner)

    with ape.reverts("Invalid candidate"):
        voting.vote(99, sender=voter1)


def test_rejects_votes_after_window_ends(voting, owner, voter1, chain):
    voting.addCandidate("Alice", sender=owner)
    chain.pending_timestamp += 11 * 60  # fast-forward 11 minutes

    with ape.reverts("Voting has ended"):
        voting.vote(1, sender=voter1)


def test_returns_all_results(voting, owner, voter1, voter2):
    voting.addCandidate("Alice", sender=owner)
    voting.addCandidate("Bob", sender=owner)
    voting.vote(1, sender=voter1)
    voting.vote(2, sender=voter2)

    results = voting.getAllResults()
    assert len(results) == 2
    assert results[0].voteCount == 1
    assert results[1].voteCount == 1
