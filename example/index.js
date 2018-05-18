const Queue = require('../src')

const queue1 = new Queue('sample1', {
  redis: {
    url: 'redis://localhost:16901',
  },
  removeOnSuccess: true,
})

const queue2 = new Queue('sample2', {
  redis: {
    url: 'redis://localhost:16901',
  },
  removeOnSuccess: true,
})

queue1
  .createJob({ data: 'queue1' })
  .schedule('*/10 * * * * *', 'Asia/Seoul')

queue2
  .createJob({ data: 'queue2' })
  .schedule('*/5 * * * * *', 'Asia/Seoul')

queue1.process((job, done) => {
  console.log('process 1:', new Date(), job.data.data)
  done()
})

queue2.process((job, done) => {
  console.log('process 2:', new Date(), job.data.data)
  done()
})
