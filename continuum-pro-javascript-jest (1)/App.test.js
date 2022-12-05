import React from 'react';
import App from './App';
import Enzyme, {mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import {Continuum, ReportManagementStrategy, ModuleManagementStrategy} from '@continuum/continuum-javascript-professional';

Enzyme.configure({ adapter: new Adapter() });

// full DOM rendering example
describe('the entire React app', () => {
	beforeAll(async () => {
		await Continuum.setUp(null, require('path').resolve(__dirname, "./continuum.conf.js"), window);
	});

	it('should have no accessibility concerns', async () => {
		// best practice is to render React components inside a container element that's a child of the body element
		const containerDiv = window.document.createElement("div");
		window.document.body.appendChild(containerDiv);

		mount(<App />, {attachTo: containerDiv});
		const accessibilityConcerns = await Continuum.runAllTestsOnNode(containerDiv);

		try {
			expect(accessibilityConcerns.length).toBe(0);
		} finally {
			console.log(`${accessibilityConcerns.length} accessibility concern(s) found:`);
			console.log(JSON.stringify(accessibilityConcerns, null, 2));

			// to send these accessibility concerns from Continuum to AMP, uncomment the line below and
			// edit the submitAccessibilityConcernsToAMP function according to our 'Sending Continuum Testing Results to AMP' support article:
			// https://support.levelaccess.com/hc/en-us/articles/360024510632-Sending-Continuum-Testing-Results-to-AMP
			//await submitAccessibilityConcernsToAMP(accessibilityConcerns);
		}
	});
});

// shallow rendering example
/*
	We advise caution when doing any kind of accessibility testing over shallowly-rendered components because some
	accessibility concerns cannot be identified without the contents of a component's children, their children's
	children, etc. For example, some of our best practices derived from accessibility standards deal with the contents
	of tables, so if a table is only shallowly rendered without its contents, those best practices cannot be tested for
	automatically by Continuum and therefore there might actually be accessibility concerns in your table that wouldn't
	appear in the list of accessibility concerns you get back from Continuum when that table is shallowly rendered as
	opposed to when it is fully rendered with all its contents.
 */
describe('the App component shallowly rendered', () => {
	beforeAll(async () => {
		await Continuum.setUp(null, require('path').resolve(__dirname, "./continuum.conf.js"), window);
	});

	it('should have no accessibility concerns', async () => {
		window.document.body.innerHTML = shallow(<App />).html();
		const rootComponentNode = window.document.querySelector('body > :first-child');
		const accessibilityConcerns = await Continuum.runAllTestsOnNode(rootComponentNode);
		// For Elevin scans, please use await Continuum.runAllTests() instead:
		// const accessibilityConcerns = await Continuum.runAllTests();

		try {
			expect(accessibilityConcerns.length).toBe(0);
		} finally {
			console.log(`${accessibilityConcerns.length} accessibility concern(s) found:`);
			console.log(JSON.stringify(accessibilityConcerns, null, 2));

			// to send these accessibility concerns from Continuum to AMP, uncomment the line below and
			// edit the submitAccessibilityConcernsToAMP function according to our 'Sending Continuum Testing Results to AMP' support article:
			// https://support.levelaccess.com/hc/en-us/articles/360024510632-Sending-Continuum-Testing-Results-to-AMP
			//await submitAccessibilityConcernsToAMP(accessibilityConcerns);
			// to send to Elevin, uncomment the line below
			//await submitAccessibilityConcernsToElevin(accessibilityConcerns);
		}
	});
});

async function submitAccessibilityConcernsToAMP(accessibilityConcerns) {
	console.log("Submitting accessibility concerns to AMP...");

	const ampReportingService = Continuum.AMPReportingService;

	await ampReportingService.setActiveOrganization(12345);  // ID of AMP organization to submit test results to
	await ampReportingService.setActiveAsset(54321);  // ID of AMP asset to submit test results to
	await ampReportingService.setActiveReportByName("Example Report");
	await ampReportingService.setActiveModuleByName("Example Module", "Example Component");
	await ampReportingService.setActiveReportManagementStrategy(ReportManagementStrategy.OVERWRITE);
	await ampReportingService.setActiveModuleManagementStrategy(ModuleManagementStrategy.OVERWRITE);
	await ampReportingService.submitAccessibilityConcernsToAMP(accessibilityConcerns);

	console.log(`Accessibility concerns submitted to AMP: ${ampReportingService.activeModule.getAMPUrl()}`);
}

async function submitAccessibilityConcernsToElevin(accessibilityConcerns) {
	try {
		const ElevinReportingService = Continuum.ElevinReportingService;

		console.log("Submitting accessibility concerns to Elevin...");
		await ElevinReportingService.beginScan();
		await ElevinReportingService.submit(accessibilityConcerns);
		await ElevinReportingService.completeScan();
		console.log(`Accessibility concerns submitted to Elevin`);
	} catch (e) {
		console.log(e.message);
	}
}
