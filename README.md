# WMDE Banner screenshots

This is a tool for taking screenshots of WMDE fundraising banners on wikipedia.org in different browsers and resolutions.

## Creating Screenshots

To run the tool, you need to set your SauceLabs credentials:

    export SAUCE_USERNAME=your_username
    export SAUCE_KEY=your_api_keys

Then you can run the screenshot tool:

    npm -r esm index.js
    
This will create a campaign directory inside the `banner-shots` directory. The campaign directory contains the 
screenshot images and file `metadata.json` with all the meta data about the test case.

## Updating the screenshot metadata
To update the metadata summary for the [Shutterbug UI](https://github.com/wmde/shutterbug), run the command

    ./metadata_summary.js

Without any parameters, this will search the `banner-shots` directory for campaign directories and process their 
`metadata.json` files. 

## Running the unit tests

    npm run test

Use the following command to run individual tests

    node_modules/.bin/mocha -r esm test/specs/name_of_your_test.js 