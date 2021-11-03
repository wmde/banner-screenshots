// A simple "message echo" worker to test the server

import ampqlib from 'amqplib';

// Simulate long processing task
const TASK_DELAY = 3000;
const q = 'tasks';

const conn = await ampqlib.connect('amqp://localhost');
const ch = await conn.createChannel();
await ch.assertQueue(q);
// Since our processing function is async, we have to wait with fetching 
// until we have acknowledged the message
await ch.prefetch(1);

console.log("Connection established, hit Ctrl-C to quit worker");

// "consume" will run in an endless loop, where the client waits for new messages
ch.consume(q, async function(msg) {
  if (msg !== null) {
	  const msgData = JSON.parse(msg.content.toString());
	  console.log("processing message", msgData);
	  return new Promise( (resolve) => setTimeout( () => {
		  ch.ack(msg);
		  resolve();
	  }, TASK_DELAY ) );
  }
});


