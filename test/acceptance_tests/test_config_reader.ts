import { HttpConfigReader } from '../../src/ConfigReader/HttpConfigReader';

// This is an "acceptance test" script with live data from the server.
// Unit-testing with mocking the http and https modules is too hard.

const cr = new HttpConfigReader(
	'https://raw.githubusercontent.com/wmde/fundraising-banners/',
	'C22_WMDE_Test_03'
);

cr.getConfig()
	.then( t => console.log( "got config", t ) )
	.catch( e => console.log( "A fetch error occurred", e ) );
