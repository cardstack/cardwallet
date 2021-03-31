# Cardstack

This is the base project for the Cardstack greenfield project.

Anything that goes in this folder will automatically be added to the next phase of the project.

[This phase of the project is slated to begin in Q2 or Q3 of 2021]

_Please check back later._

## Releases and Tagging

* Workflows:
  * Create tag
    * Automated on Fridays or manual
    * Use current version in branch with unique identifier
    * Version must be bumped (patch, minor, major) through PR
  * Beta release off of a tag
    * Automated on Fridays off of most recent tag or manual off of given tag
  * Production release off of a tag
    * Manual off of given tag

## CI

GitHub actions are kicked off on every push to a branch (besides for `develop`) to verify that tests, coverage, and lint is passing. This check must pass before a PR can be merged.

To run tests and coverage:

`yarn test`

To run lint:

`yarn lint`

To run TypeScript:

`yarn ts-check`

To run all of the checks run in CI:

`yarn ci`

## Problems?

Please contact the authors of this repo for more help, or just take a look at our [Troubleshooting Guide.](./docs/troubleshooting.md')
