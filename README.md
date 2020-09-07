# WMDE Banner screenshots

This is a tool for taking screenshots of WMDE fundraising banners on wikipedia.org in different browsers and resolutions.

## Creating Screenshots

To run the tool, you need to set your SauceLabs credentials:

    export SAUCE_USERNAME=your_username
    export SAUCE_KEY=your_api_keys

Then you can run the screenshot tool:

    node -r esm index.js
    
This will create a campaign directory inside the `banner-shots` directory. The campaign directory contains the 
screenshot images and file `metadata.json` with all the meta data about the test case.

## Different test functions for different banners

Add a different test function to the `src/test_functions/` directory,
im- and export it in `src/test_functions/index.js` and specify its name in
`testFunctionName` in `index.js`.

## Updating the screenshot metadata
To update the metadata summary for the [Shutterbug UI](https://github.com/wmde/shutterbug), run the command

    ./metadata_summary.js

Without any parameters, this will search the `banner-shots` directory for campaign directories and process their 
`metadata.json` files. 

To update the banner data on a remote server, use the `remote_metadata_summary.sh` script:

    ./remote_metadata_summary.sh username@your-server /remote/path/to/banner-shots

This will download all the metadata via scp, generate the summary file and upload the summary file.

The user needs write access in the specified directory!

## Running the unit tests

    npm run test

Use the following command to run individual tests

    node_modules/.bin/mocha -r esm test/specs/name_of_your_test.js 
