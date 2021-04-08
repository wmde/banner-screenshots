import {BANNER, BROWSER, DEVICE, OPERATING_SYSTEM, RESOLUTION, TestCaseGenerator} from "../../src/TestCaseGenerator";
import {createGrid} from "../../src/createGrid";
import { strict as assert } from 'assert';


const BANNER_URL = 'http://de.wikipedia.org/{{PLACEHOLDER}}';
const PLACEHOLDER = '{{PLACEHOLDER}}';
const PAGE_NAMES = [ ['ctrl', 'B19WMDE_21_191221_ctrl'], [ 'var', 'B19WMDE_21_191221_var' ] ];

describe('createGrid', () => {

	const generator = new TestCaseGenerator(
		new Map( PAGE_NAMES ),
		BANNER_URL,
		PLACEHOLDER
	);

	generator.addDimension( BANNER, [ 'ctrl', 'var' ] )
		.addDimension( RESOLUTION, [ '1280x1024', '800x600' ] )
		.addDimension( OPERATING_SYSTEM, [ 'win10' ] )
		.addDimension( BROWSER, [ 'firefox', 'chrome' ] )
		.build();

	const testCases = generator.getTestCases();

	it( 'can create a grid from banner dimension', () => {
		const rowDimensions = new Map( [ [ BANNER, [ 'ctrl', 'var' ] ] ] );
		const orderByDimensions = [ RESOLUTION, OPERATING_SYSTEM, BROWSER ];
		const grid = createGrid( testCases, rowDimensions, orderByDimensions);

		assert.strictEqual( grid.length, 2 );
		assert.strictEqual( grid[0][0].getDimension( BANNER ), 'ctrl' );
		assert.strictEqual( grid[1][0].getDimension( BANNER ), 'var' );
	} );

	it( 'sorts the columns', () => {
		const rowDimensions = new Map( [ [ BANNER, [ 'ctrl', 'var' ] ] ] );
		const orderByDimensions = [ BROWSER, RESOLUTION ]; // different order than dimensions in generator
		const grid = createGrid( testCases, rowDimensions, orderByDimensions);

		assert.strictEqual( grid[0].length, 4 );
		assert.strictEqual( grid[0][0].getScreenshotFilename(), 'ctrl__1280x1024__win10__chrome.png' );
		assert.strictEqual( grid[0][1].getScreenshotFilename(), 'ctrl__800x600__win10__chrome.png' );
		assert.strictEqual( grid[0][2].getScreenshotFilename(), 'ctrl__1280x1024__win10__firefox.png' );
		assert.strictEqual( grid[0][3].getScreenshotFilename(), 'ctrl__800x600__win10__firefox.png' );
	} );

	it( 'can create a grid from multiple banner dimensions', () => {
		const rowDimensions = new Map( [ [ BANNER, [ 'ctrl', 'var' ] ], [ BROWSER, ['firefox', 'chrome' ] ] ] );
		const orderByDimensions = [ RESOLUTION, OPERATING_SYSTEM ];
		const grid = createGrid( testCases, rowDimensions, orderByDimensions);

		assert.strictEqual( grid.length, 4 );
		assert.strictEqual( grid[0][0].getScreenshotFilename(), 'ctrl__1280x1024__win10__chrome.png' );
		assert.strictEqual( grid[0][1].getScreenshotFilename(), 'ctrl__800x600__win10__chrome.png' );
		assert.strictEqual( grid[1][0].getScreenshotFilename(), 'ctrl__1280x1024__win10__firefox.png' );
		assert.strictEqual( grid[1][1].getScreenshotFilename(), 'ctrl__800x600__win10__firefox.png' );
		assert.strictEqual( grid[2][0].getScreenshotFilename(), 'var__1280x1024__win10__chrome.png' );
		assert.strictEqual( grid[2][1].getScreenshotFilename(), 'var__800x600__win10__chrome.png' );
		assert.strictEqual( grid[3][0].getScreenshotFilename(), 'var__1280x1024__win10__firefox.png' );
		assert.strictEqual( grid[3][1].getScreenshotFilename(), 'var__800x600__win10__firefox.png' );
	} );
} );