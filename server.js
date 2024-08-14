const express = require('express');
const Queue = require('bull');
const QueueMQ = require('bullmq');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullAdapter(new Queue('parse-dataset')),
    new BullAdapter(new Queue('regroup-dataset')),
    new BullAdapter(new Queue('combine-dataset')),
    new BullAdapter(new Queue('response-reports')),
    new BullAdapter(new Queue('invite-emails')),
    new BullAdapter(new Queue('refresh-surveys'))
    ],
  serverAdapter: serverAdapter,
});

const app = express();

app.use('/admin/queues', serverAdapter.getRouter());

// other configurations of your server

app.listen(3000, () => {
  console.log('Running on 3000...');
  console.log('For the UI, open http://localhost:3000/admin/queues');
  console.log('Make sure Redis is running on port 6379 by default');
});