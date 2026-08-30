from ape import accounts, project

def main():
    deployer = accounts.load("voting_deployer")  # ape accounts import voting_deployer

    duration_in_minutes = 60
    voting = deployer.deploy(project.Voting, duration_in_minutes)

    print(f"Voting contract deployed to: {voting.address}")
    print(f"Voting window: {duration_in_minutes} minutes")
