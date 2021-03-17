import { CronJob } from 'cron'

const job = new CronJob(
  // at midnight everyday
  '0 0 0 * * *',
  // '* * * * * *',
  function () {
    console.log('You will see this message every second')
  },
  // null,
  // true,
)

job.start()
// console.log('here')
