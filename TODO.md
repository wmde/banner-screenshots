# TODOs
- [ ] Optimize testingbot interaction: Don't create new browser instances
	for CTRL and VAR, make banner list a "special" dimension that reuses
	existing browser. This will create a 2x speed up!
- [ ] Add tests for ScreenshotGenerator
- [ ] Collect start and end time of each test, write it to metadata and console output
- [ ] More/different test functions for mobile banners (go to 2nd page, close banner, etc)
- [ ] More validation of `test_matrix` configuration settings (to prevent
	  developer errors)
- [ ] Add CI to check if screenshots are still working

