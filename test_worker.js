import {TestCase} from './src/TestCase.js';
import {shootBanner} from './src/test_functions/shootBanner.js'
import { BrowserFactory, CONNECTION, factoryOptions } from "./src/TBBrowserFactory.js";
import {CapabilityFactory} from "./src/TBCapabilityFactory.js";
import {createImageWriter} from "./src/writeImageData.js";
import ampqlib from 'amqplib';

const browserFactory = new BrowserFactory( CONNECTION,
	new CapabilityFactory( factoryOptions )
);

const q = 'tasks';

const conn = await ampqlib.connect('amqp://localhost');
const ch = await conn.createChannel();
await ch.assertQueue(q);
// Since our processing function is async, we have to wait with fetching 
// until we have acknowledged the message
await ch.prefetch(1);

console.log("Connection established, hit Ctrl-C to quit worker");

ch.consume(q, async function(msg) {
  if (msg !== null) {
	  const msgData = JSON.parse(msg.content.toString());
	  console.log("processing message", msgData);  
	const writeImageData = await createImageWriter( msgData.outputDirectory );
	const testCase = new TestCase(msgData.dimensionKeys, msgData.dimensionValues, msgData.bannerUrl);
	  // TODO check if test case is valid and skip if not
	const browser = await browserFactory.getBrowser(testCase);
	  // TODO get test function from msgData and check it
	try {
		await shootBanner(browser, testCase, writeImageData);
	} catch (e) {
		console.log(e);
	}
	  // TODO create finish message in "metadata" queue with state of test case

	ch.ack(msg);
  }
});

