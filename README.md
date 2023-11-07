# Setup
## Stuff
## Stuff

# Documentation
This section details framework design, and discusses tests and functions.

## Framework Design
A conventional Cypress scaffolded project with an e2e, fixtures and support directory. I've introduced a `config` directory which contains files that list environment specific settings such as the baseurl, environment used, etc. Obviously, the page being tested is not hosted on different environments, but it is meant to paint the picture so to speak should the tests be written for a web app which runs on various environments where each environment might need different variables. Inside the `cypress.config.js` file the following is used to determine which environment file to get and use:

```const projectEnv = config.env.envForTests || 'test';```        
```return fs.readJSON(`cypress/config/${projectEnv}-env.json`)```

This would work neatly in the CI as well should you be wanting to run tests on different environments without having to worry about tweaking any settings during a pipeline build. The `projectEnv` variable looks for an environment variable called `envForTests` which needs to be set either locally or on the build agent/env itself. Alternatively, it will fallback to the `test` environment should such a variable not exist.

Furthermore, test specs should ideally be separated by page when testing the UI and by endpoint when testing an API. 

## Test Styleguide
- Test data should be managed predominantly in fixtures or functions that do not live in the test specs themselves.
- Tests descriptions should be read starting with the `it` as if it was the start of the sentence. | Example: `it clicks on the button`
- Test descriptions should not use the words `should` or `if`, the descriptions must clearly state what it expects. | Example: `it displays a welcome message when the button is clicked` NOT `it should display a welcome message if the button is clicked` - This then makes it far better to understand what is expected when a test fails.
- Whitespace or a blank line is encouraged between Cypress commands to further improve readability and convey the sequence of actions performed in the test, especially when not using Gherkin.
- File names should be in all lower case separated by hyphons and function/variable names should follow a camel case naming convention. 
- `context`

## Notable Bits of Code
Whilst most of the code is fairly straightforward, I've introduced a variety of "unnecessary" ways to test or handle certain features on the page solely to demonstrate some of my Cypress knowledge. For example, there was no need to stub one of the responses, etc.

The `onlyRunOn` function takes in an array of environment names and compares it to the current environment the project is running against to determine whether the test should run on this environment or not. This I have personally found is oft useful when not feature-branching should a feature rollback from a particular environment. If the test for this featture exists, then the test will fail usually and such a function becomes useful. 

`forEach` on a whole test; this is not something I typically use nor does Cypress "really" recommend for or against it. Looping a test one sometimes has to worry about state or `testIsolation` or parallelisation. When it comes to parallelisation however, specs run in parallel and not tests in a particular file (based on memory) but something worth thinking about eitherway. 

`cy.spy()` and `should(have.been.called)` this is a great Command and assertion to use as much as possible. I used this when pressing on submit buttons on the page. The reality however, is that frontend validation should kick in and no request should fire off, if we are being critical of the web page. Moreover, the a number of tests written in the `home-page` spec use endpoint assertions whilst the tests interact with the web page. This I find is one of the core built in advantages of Cypress, enabling us to truely integration-test.
