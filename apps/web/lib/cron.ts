import schedule from 'node-schedule'

/**
 * Run a job every hour
 */
function main() {
  const job = schedule.scheduleJob('0 */1 * * *', function () {
    console.log('The answer to life, the universe, and everything!')
  })
}

// main()
