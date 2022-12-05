# Continuum for React using JavaScript, Jest, and Enzyme

This is a sample Continuum 5.0.0 project that tests a barebones React application (packaged with this sample project) for accessibility concerns using JavaScript, specifically Jest and Enzyme.

See `App.test.js`.
For the first full DOM rendering example, Access Engine is injected into Node's native window document prior to the React application being mounted using Enzyme's 'mount' function to make sure we test the entire page.
For the second shallow rendering example, Access Engine is injected into Node's native window document prior to the App component being shallow rendered using Enzyme's 'shallow' function.
For reasons detailed in the comments in `App.test.js`, we generally don't recommend using shallow rendering as it can artificially limit the accessibility concerns that Continuum can detect.

## Prerequisites
* Node

## Installation
1. Install dependencies:

        npm install

## Usage
1. Run accessibility tests:

        npm test

## Support
Rich API documentation for all the functionality supported out of the box with our Continuum JavaScript SDK, which this sample project uses, can be found [here](https://tools.levelaccess.net/continuum/docs/latest/jsdoc/index.html).

Questions can be emailed to Level Access support at support@levelaccess.com.
