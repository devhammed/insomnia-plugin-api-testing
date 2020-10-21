import React, { useEffect, useState } from 'react'

import Logs from '../components/logs'
import Styles from '../components/styles'
import Editor from '../components/editor'
import testRunner from '../utils/test-runner'

function App ({ context, data }) {
  const [logs, setLogs] = useState([])
  const [code, setCode] = useState('')
  const [running, setRunning] = useState(false)
  const [showEditTest, setShowEditText] = useState(false)

  const handleShowEditTests = () => {
    setLogs([])
    setRunning(false)
    setShowEditText(false)
  }

  const handleRunTests = async () => {
    setRunning(true)

    await testRunner(setLogs, context.network.sendRequest, data.requests, code)

    setShowEditText(true)
  }

  return (
    <>
      <div className='api-testing-code-editor'>
        {running ? (
          <Logs logs={logs} />
        ) : (
          <Editor
            code={code}
            setCode={setCode}
            store={context.store}
            groupId={data.requestGroup._id}
          />
        )}
        {showEditTest ? (
          <button className='runner-button' onClick={handleShowEditTests}>
            Edit Tests
          </button>
        ) : (
          <button
            disabled={running}
            onClick={handleRunTests}
            className='runner-button'
          >
            {running ? 'Running Tests...' : 'Run Tests'}
          </button>
        )}
      </div>
      <Styles />
    </>
  )
}

export default App
