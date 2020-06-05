# TODOs
- [ ] Add command line arguments for campaign name, output directory test
	  function, etc to index.js
- [ ] More/different test functions for mobile banners (go to 2nd page, close banner, etc)
- [ ] More validation of `test_matrix` configuration settings (to prevent
	  developer errors)
- [ ] Use `platform` presets instead of individual settings for OS,
	  browser and resulution in the test matrix, similar to the mobile 
	  platforms. This avoids errors for unsupported resolutions and 
	  large empty rows/columns where the test is "invalid".
- [ ] Better error handling when something goes wrong (e.g. during browser
	  setup or in the test function): continue screenshotting the rest of 
	  the cases, mark failed test case as failed in the metadata. 
- [ ] Upload of images and metadata to hosting platform
- [ ] progress and silent mode: Lower log level for web driver, display test progress

