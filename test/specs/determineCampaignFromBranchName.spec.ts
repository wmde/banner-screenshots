import { strict as assert } from 'assert';
import {determineCampaignFromBranchName } from '../../src/CommandLine/determineCampaignFromBranchName';

describe("determineCampaignFromBranchName", () => {
	it("returns desktop for WMDE prefix without other modifiers", () => {
		assert.equal(
			determineCampaignFromBranchName('C21_WMDE_Test_01'),
			'desktop'
		);
	} );

	it("returns english for WMDE prefix and EN part", () => {
		assert.equal(
			determineCampaignFromBranchName('C21_WMDE_Test_EN_01'),
			'english'
		);
		assert.equal(
			determineCampaignFromBranchName('C21_WMDE_EN_Test_01'),
			'english'
		);
	} );

	it("returns mobile for mobile campaigns", () =>  {
		assert.equal(
			determineCampaignFromBranchName('C21_WMDE_Mobile_Test_01'),
			'mobile'
		);
	} );

	it("returns mobile_english for English mobile campaigns", () =>  {
		assert.equal(
			determineCampaignFromBranchName('C21_WMDE_Mobile_EN_Test_01'),
			'mobile_english'
		);
		assert.equal(
			determineCampaignFromBranchName('C21_WMDE_EN_Mobile_Test_01'),
			'mobile_english'
		);
	} );

	it("returns pad for iPad campaigns", () =>  {
		assert.equal(
			determineCampaignFromBranchName('C21_WMDE_Pad_Test_01'),
			'pad'
		);
		assert.equal(
			determineCampaignFromBranchName('C21_WMDE_iPad_Test_01'),
			'pad'
		);
	} );

	it("returns pad_en for English iPad campaigns", () =>  {
		assert.equal(
			determineCampaignFromBranchName('C21_WMDE_pad_EN_Test_01'),
			'pad_en'
		);
		assert.equal(
			determineCampaignFromBranchName('C21_WMDE_EN_iPad_Test_01'),
			'pad_en'
		);
	} );

	it("returns wikipediade for WPDE prefix without other modifiers", () => {
		assert.equal(
			determineCampaignFromBranchName('C21_WPDE_Test_01'),
			'wikipediade'
		);
	} );

	it("returns wikipediade_mobile for WPDE prefix without other modifiers", () => {
		assert.equal(
			determineCampaignFromBranchName('C21_WPDE_Test_Mobile_01'),
			'wikipediade_mobile'
		);
		assert.equal(
			determineCampaignFromBranchName('C21_WPDE_Test_Mob01'),
			'wikipediade_mobile'
		);
	} );

	it("fails when site specifier (WMDE/WPDE) is missing", () => {
		assert.throws(() => determineCampaignFromBranchName('some_branch'), 'it should throw')
	} );
})
