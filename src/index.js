const Queue = require('bee-queue')
const Job = require('bee-queue/lib/job')
const moment = require('moment')
const { CronTime } = require('cron')

const defaultTimezone = 'Asia/Seoul'

class Schedule {
  constructor(cronRule, originalJob, timezone = undefined) {
    this.timezone = timezone
    this.cronQueue = new Queue(`${originalJob.queue.name}:schedules`, {
      prefix: originalJob.queue.settings.prefix,
      redis: originalJob.queue.settings.redis,
      removeOnSuccess: true,
      activateDelayedJobs: true,
    })
    this.cronQueue.destroy()
    this.cronRule = cronRule
    this.cronQueue.process(async () => {
      try {
        (await Job.fromData(originalJob.queue, null, originalJob.toData())).save()
        this.registerNext()
      } catch (e) {
        console.error('error', e)
      }
    })
  }

  registerNext() {
    const cronTime = new CronTime(this.cronRule, this.timezone || defaultTimezone)
    const nextRun = cronTime.sendAt();
    const now = moment()
    this.cronQueue.createJob({ time: now })
      .delayUntil(nextRun.toDate())
      .save()
  }
}

Job.prototype.schedule = function (cronRule, timezone) {
  new Schedule(cronRule, this, timezone).registerNext()
}

module.exports = Queue
