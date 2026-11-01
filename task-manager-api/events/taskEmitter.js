const EventEmitter = require('events');

class TaskEventEmitter extends EventEmitter {}

const taskEmitter = new TaskEventEmitter();

/**
 * Event: 'task:created'
 * Asynchronously processes notifications without blocking main API response
 */
taskEmitter.on('task:created', (data) => {
  // Use setImmediate to guarantee this executes on the next tick of the event loop
  setImmediate(() => {
    const handlerExecutionTime = new Date().toISOString();
    const handlerHighRes = performance.now();
    const latencyMs = (handlerHighRes - data.apiResponseHighRes).toFixed(2);

    console.log(`\n🔔 [EVENT-DRIVEN NOTIFICATION] Event: 'task:created'`);
    console.log(`   Task Title: "${data.task.title}"`);
    console.log(`   Assigned User: ${data.user || 'student@btech.ac.in'}`);
    console.log(`   API Response Returned At:     ${data.apiResponseTimestamp}`);
    console.log(`   Event Handler Executed At:   ${handlerExecutionTime}`);
    console.log(`   Asynchronous Execution Delta: ${latencyMs}ms (Non-blocking)\n`);
  });
});

module.exports = taskEmitter;
