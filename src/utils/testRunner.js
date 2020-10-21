import chai from 'chai'

function makeLogger (type, requests, logs) {
  return (name, msg, index) => {
    const request = requests[index]

    if (typeof logs[index] === 'undefined') {
      logs[index] = {
        name: request ? request.name : '[INVALID]',
        results: []
      }
    }

    const log = { type, name }

    if (msg) {
      log.msg = msg
    }

    logs[index].results.push(log)
  }
}

export default function testRunner (sendRequest, requests, code) {
  return new Promise(resolve => {
    // Test logs:
    const logs = []

    // Test Logger methods:
    const logger = {
      pass: makeLogger('PASS', requests, logs),
      fail: makeLogger('FAIL', requests, logs),
      skip: makeLogger('SKIPPED', requests, logs),
      invalid: makeLogger('INVALID', requests, logs)
    }

    // The test globals:
    const globals = {}

    // The Insomnia namespace:
    const ins = {}

    // The test queue:
    const tests = []

    // Function to add tests:
    ins.test = function test (index, name, test) {
      tests.push({ index, name, test })
    }

    // Function to add grouped tests:
    ins.testsFor = function testsFor (index, runner) {
      runner((name, test) => ins.test(index, name, test))
    }

    // BDD style assertion:
    ins.expect = function expect (assertion, message) {
      return chai.expect(assertion, message)
    }

    // Test Globals:
    ins.globals = {
      all () {
        return { ...globals }
      },
      get (key, def = undefined) {
        return globals[key] ?? def
      },
      set (key, value) {
        return (globals[key] = value)
      },
      has (key) {
        return !!globals[key]
      },
      unset (key) {
        delete globals[key]
      },
      clear () {
        return (globals = {})
      }
    }

    // End the testing session:
    function done () {
      resolve(logs)
    }

    // Test runner:
    function run () {
      let testToRun
      let i = 0

      async function next (err) {
        // Log status for last test run:
        if (testToRun) {
          logger[err ? 'fail' : 'pass'](
            `${err ? '❌' : '✅'} ${testToRun.name}`,
            err ? err.message : '',
            testToRun.index
          )
        }

        // Abort if we ran out of tests:
        if (!(testToRun = tests[i++])) return done()

        // Run test:
        try {
          const request = requests[testToRun.index]

          if (typeof request === 'undefined') {
            logger.invalid(
              '🤔 Invalid Request Index',
              `Request with index ${testToRun.index} does not exist`,
              testToRun.index
            )

            return done()
          }

          const response = await sendRequest(request)

          // Setup the assertions for the current test:
          ins.response = {
            url: ins.expect(response.url),
            headers: ins.expect(response.headers),
            status: ins.expect(response.statusCode),
            elapsedTime: ins.expect(response.elapsedTime),
            statusText: ins.expect(response.statusMessage)
          }

          // Run the test callback:
          testToRun.test.call(null, next)

          // Auto-advance to the next test
          // if the current one does not accept `next` parameter:
          if (testToRun.test.length !== 1) {
            next()
          }
        } catch (err) {
          // This will be handled at the beginning of the next test:
          next(err)
        }
      }

      next()
    }

    // Add tests:
    // TODO(devhammed): use a better way to evaluate code
    eval(code)

    // Let's run the test:
    run()
  })
}
