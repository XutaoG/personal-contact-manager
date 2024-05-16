# COP4331C Small Project - Personal Contact Manager
## Group Members:
* Omar Castro (Front-end)
* Xutao Gao (Project Manager/Front-end)
* Tetiana Kotvitska (API)
* Cade Osborn (API)
* Luis Rodriguez-Rivera (Database)
## Git
For those not experienced with Git/Github, this will be a basic rundown of the commands you will need to pull/push your code.
### Cloning the Repository
To clone the repository, use `git clone git@github.com:XutaoG/cop4331-personal-contact-manager.git`. Make sure your Git SSH key authentication is properly configured, you will need to be authenticated to be able to push your work.
### Development Process
For this project, we will pivot towards a more feature-based development process where we will create a new git branch where you will work on new part of the project without disturbing the main branch. And only when the code on the branch you are current working on has been completed and tested will it be merged into the main branch by opening a pull request (confusing name, nothing to do with pulling). 

Here is a short YouTube video explaning it: https://www.youtube.com/watch?v=02aQhH5cNBg
### Staging and Commit Commands
* Add files into staging: `git add <file>` to add specified file
  * `git add --all` to add all modified files into staging
* Commit the changes: `git commit -m <commit_message>`
  * Make your commit message short and concise please
### Branching
* Show all existing branches: `git branch`
* Create a new branch: `git branch <new_branch_name>`
  * The new branch will first contain content based on which branch you are on when the command is executed.
* Switch to a branch: `git switch <branch_name>`
* For example, if you are on the API team, after you have cloned the repository onto your local machine, use `git branch api` to create a new api branch and use `git switch api` to switch to that branch. After finishing the work, add and commit the changes and push the changes into GitHub.
### Pushing
* Push a branch into GitHub: `git push origin <branch_to_push>`
### Getting Changes onto Local Machine (Very important)
* Before starting any work, making commits, or pushing the changes you have made into GitHub, make sure you current local repository is up to date with the cloud GitHub repository by pulling the new changes from GitHub using `git pull <branch_to_pull_from>`. This is to ensure that, in the case someone else changed some code you have worked, you will have the newest work.
  
These are the basic commands you will need, if you need any help or run into any issues/conflicts, message me on discord.
