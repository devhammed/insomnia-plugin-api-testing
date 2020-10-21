import chai from 'chai'

function makeLogger (setLogs, requests, logs) {
  return type => (name, msg, index) => {
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

    setLogs(logs)
  }
}

export default function testRunner (
  setLogs,
  readFile,
  sendRequest,
  requests,
  code
) {
  return new Promise(resolve => {
    // Test logs:
    const logs = []

    // Logger Factory instance:
    const loggerFactory = makeLogger(setLogs, requests, logs)

    // Test Logger methods:
    const logger = {
      pass: loggerFactory('PASS'),
      fail: loggerFactory('FAIL'),
      invalid: loggerFactory('INVALID')
    }

    // The test globals:
    const globals = {}

    // The Insomnia namespace:
    const ins = {}

    // The test queue:
    const tests = []

    // Function to add tests for requests:
    ins.testsFor = function testsFor (index, runner) {
      if (typeof runner !== 'function') {
        return logger.invalid(
          'Invalid Request Test Runner',
          `Request with index ${testToRun.index} test runner is not a function`,
          index
        )
      }

      runner((name, test) => tests.push({ index, name, test }))
    }

    // BDD style assertion:
    ins.expect = chai.expect

    // Throw a failure:
    ins.fail = chai.expect.fail

    // Test Globals:
    ins.globals = {
      all () {
        return { ...globals }
      },
      get (key, def = undefined) {
        return globals[key] ? globals[key] : def
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
            testToRun.name,
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
              'Invalid Request Index',
              `Request with index ${testToRun.index} does not exist`,
              testToRun.index
            )

            return done()
          }

          const response = await sendRequest(request)

          // Setup the response assertions for the current test:
          ins.response = {
            response: response,
            url: ins.expect(response.url),
            headers: ins.expect(
              // convert array of objects to an object
              response.headers.reduce((acc, { name, value }) => {
                if (name in acc) {
                  if (typeof acc[name] === 'string') {
                    acc[name] = [acc[name], value]
                  } else {
                    acc[name].push(value)
                  }
                } else {
                  acc[name] = value
                }

                return acc
              }, {})
            ),
            body: {
              text: (() => {
                try {
                  const data = readFile(response.bodyPath, 'utf8')

                  ins.response.body._data = data

                  return ins.expect(data)
                } catch (e) {
                  return ins.expect(null)
                }
              })(),
              json: (() => {
                try {
                  return ins.expect(JSON.parse(ins.response.body._data))
                } catch (e) {
                  return ins.expect(null)
                }
              })()
            },
            status: ins.expect(response.statusCode),
            size: ins.expect(response.bytesContent),
            elapsedTime: ins.expect(response.elapsedTime),
            contentType: ins.expect(response.contentType),
            statusText: ins.expect(response.statusMessage)
          }

          // Setup the request assertions for the current test:
          ins.request = {
            request: request
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
