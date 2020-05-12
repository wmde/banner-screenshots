# WMDE Banner screenshots

This is a tool for taking screenshots of WMDE fundraising banners on wikipedia.org in different browsers and resolutions.

To run the tool, you need to set your SauceLabs credentials:

    export SAUCE_USERNAME=your_username
    export SAUCE_KEY=your_api_keys

Then you can run the screenshot tool:

    npm -r esm index.js
    

## Running the unit tests

    npm run test

Use the following command to run individual tests

    node_modules/.bin/mocha -r esm test/specs/name_of_your_test.js 