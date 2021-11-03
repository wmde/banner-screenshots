# TODOs Message Queue refactoring
- [ ] Move queue names into constants
- [ ] Delete BatchRunner and getBrowsers method
- [ ] Add metadata queue and processor
	- [ ] Initialize metadata file when creating tests
	- [ ] Update metadata file when test returns. Write last known status
		into metadata.

# TODOs
- [ ] Add tests for ScreenshotGenerator
- [ ] Collect start and end time of each test, write it to metadata and console output
- [ ] Better type definitions and check for Metadata JSON (to ensure compatibility with Shutterbug)
- [ ] More/different test functions for mobile banners (go to 2nd page, close banner, etc)
- [ ] More validation of `test_matrix` configuration settings (to prevent
	  developer errors)
- [ ] Upload of images and metadata to hosting platform
- [ ] Add CI to check if screenshots are still working

