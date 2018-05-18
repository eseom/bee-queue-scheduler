## Overview

a simple cron scheduler for [bee-queue](https://github.com/bee-queue/bee-queue)
## Installation

```bash
yarn add bee-queue-scheduler
```

## Usage

```javascript
const Queue = require('bee-queue-scheduler');
const queue = new Queue('example');

const job = queue.createJob({x: 2, y: 3})
// job.save();
// simply use schedule method instead of save. that's all!
job.schedule('*/10 * * * * *', 'Asia/Seoul')

// Process the job every 10 seconds
queue.process(function (job, done) {
  console.log(`Processing job ${job.id}`);
  return done(null, job.data.x + job.data.y);
});
```

## Development

```
# clone
yarn
docker-compose up -d
node example
```
