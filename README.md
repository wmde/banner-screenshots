# WMDE Banner screenshots

This is a tool for taking screenshots of WMDE fundraising banners on wikipedia.org in different browsers and resolutions.

## Creating Screenshots

To run the tool, you need to set your testingbot credentials. You can get them by logging in on testingbot.com:

    export TB_KEY=<testingbot team account key>
    export TB_SECRET=<testingbot team account secret>

Then you can run the screenshot tool:

    node -r esm index.js -c ../fundraising-banners/campaign_info.toml <CAMPAIGN_NAME>

The `-c` parameter is for locating the campaign configuration from the
[`wmde/fundraising-banners`
repository](https://github.com/wmde/fundraising-banners).
`<CAMPAIGN_NAME>` must be one one the configuration keys of that
configuration file, e.g. `desktop` or `mobile`.

The screenshot tool will create a directory inside the `banner-shots` directory. The campaign directory contains the 
screenshot images and file `metadata.json` with all the meta data about the test case.

Instead of using the `-c` parameter, you can also create a symbolic link
from your local copy of `wmde/fundraising-banners` to the screenshot tool
directory.


### Configuration file format

The TOML file has the following (abbreviated) format

```toml
[campaign]
campaign_tracking = 211215-ba-11
preview_url = "https://example.com/banner/{{PLACEHOLDER}}"
...


[campaign.banners.ctrl]
pagename = "B21_WMDE_Test_11_ctrl"
...


[campaign.test_matrix]

platform = ["edge", "firefox_win10" ]
resolution = ["1280x960", "1024x768"]

```

`[campaign]` is the key you pass to the screenshot tool. The TOML file can
contain several campaigns, each one for a specific *channel* (a
combination of device type and language). `[campaign]` in the example
above is just a placeholder, the campaign name can consist of all
alphanumeric characters, e.g. `desktop` or `ipad_en`.

Each campaign will also have at least one banner, configured with the
`[campaign.banners.BANNER_NAME]`. Usually, `BANNER_NAME` is `ctrl` or `var`.
Each banner has a unique `pagename` which designates its page name in
CentralNotice. To preview a banner (and to render the screenshot), you
replace the `{{PLACEHOLDER}}` with the banner name in the `preview_url` of
the campaign. The screenshot tool will run the test matrix for each
banner.

The `[campaign.test_matrix]` key can contain one of two test dimensions:
`device` and `orientation` (for mobile devices) or `platform` and
`resolution` (for desktop browsers).

To see the available values for `platform` and `device`, look at the
`CapabilityFactory` class that defines what these values mean in the
context of the testing service (testingbot.com or saucelabs.com).

All values are arrays with at least one element. The screenshot tool will
use each matrix key with each other matrix key and the banners.  
Example:
`platform=["edge", "safari", "chrome_linux"]`, `resolutions=["1280x960",
"1024x768"]` and 2 banners, `ctrl` and `var`, will create 12 (3*2*4)
screenshots.


## Different test functions for different banners

Add a different test function to the `src/test_functions/` directory,
im- and export it in `src/test_functions/index.js` and specify its name in
`testFunctionName` in `index.js`.

## Updating the screenshot metadata
To update the metadata summary for the [Shutterbug UI](https://github.com/wmde/shutterbug), run the command

    node -r esm ./metadata_summary.js

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
