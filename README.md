# tug-of-words-server
This is the repository that holds the server-side code for our CS 408 Project, Tug of Words
* * *

### Development
We will be using [yarn](https://yarnpkg.com/en/) rather than npm for dependency management.
#### Adding a dependency
- Always consult the team before adding a new dependency. If it is something small, you should write your own module instead of adding to the list of dependencies
`yarn add <dependency_name>`
- To add a developer dependency (such as testing framework)
`yarn add <dependency_name> --dev`
#### Removing a dependency
- Never remove a dependency you did not install yourself. Again, consult the team before removing a dependency.
`yarn remove <dependency_name>`
#### Best Practices
- Please follow the guidelines suggested [here](https://github.com/wearehive/project-guidelines)
### Testing
- To run tests:
`yarn test`
- You will not be able to commit code unless it passes all tests
### Linting
We are using [eslint](https://eslint.org/) with enforced [styles](https://github.com/airbnb/javascript) defined by Airbnb
- To lint the entire code:
`yarn lint`
- You will not be able to commit code unless it passes the linter checks
