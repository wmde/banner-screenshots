import cartesian from '../Cartesian';
import {TestCase} from "./TestCase";
import { Dimension, isValidDimension } from "./Dimension";

/**
 * This is a builder class that creates TestCase instances from a list of dimensions
 */
export class TestCaseGenerator {
	testCases: TestCase[];
	dimensions: Map<Dimension, string[]>;
	pageNames: Map<string, string>;
	pageNamePlaceholder: string;
	bannerUrl: string;

	constructor( pageNames: Map<string,string>, bannerUrl: string, pageNamePlaceholder: string ) {
		this.testCases = [];
		this.dimensions = new Map();

		this.pageNames = pageNames;
		this.bannerUrl = bannerUrl;
		this.pageNamePlaceholder = pageNamePlaceholder;
	}


	addDimension( key: string, values: string[] ): TestCaseGenerator {
		if( !isValidDimension( key ) ) {
			throw new Error( `Invalid dimension: ${ key }` );
		}
		this.dimensions.set( key as Dimension, values );
		return this;
	}


	build(): void {
		this.validate();

		const matrix = cartesian.apply( this, Array.from( this.dimensions.values() ) );
		const dimensionKeys = Array.from( this.dimensions.keys() );

		matrix.forEach( (dimensionValues: string[]): void => {
			this.testCases.push(
				TestCase.create( dimensionKeys, dimensionValues, this.getBannerUrl( dimensionKeys, dimensionValues ) )
			);
		} );
	}


	getBannerUrl( dimensionKeys: string[], dimensionValues: string[] ): string {
		const bannerIndex = dimensionKeys.indexOf( Dimension.BANNER );
		return this.bannerUrl.replace( this.pageNamePlaceholder, this.pageNames.get( dimensionValues[ bannerIndex ] ) );
	}

	private validate(): void {
		this.validateDimensions();
	}

	private validateDimensions(): void {
		if( this.dimensions.has( Dimension.DEVICE ) ) {
			return;
		}

		if( !this.dimensions.has( Dimension.PLATFORM ) ) {
			throw new Error( 'Dimensions are missing a required column, please specify a device name or a combination of browser and OS' );
		}
	}


	getTestCases(): TestCase[] {
		return this.testCases;
	}


	getValidTestCases(): TestCase[] {
		return this.testCases.filter( testCase => testCase.isValid() );
	}

}
