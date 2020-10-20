import React, { useEffect, useState } from 'react'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'

function App ({ context, data }) {
  const codeStoreKey = `${data.requestGroup._id}_api_testing`

  const [code, setCode] = useState('')
  const [running, setRunning] = useState(false)

  const handleCodeChange = value => {
    setCode(value)
    context.store.setItem(codeStoreKey, value)
  }

  const handleRunTests = async () => {
    setRunning(true)
    setTimeout(() => setRunning(false), 1000)
  }

  useEffect(() => {
    context.store.getItem(codeStoreKey).then(savedCode => {
      setCode(!savedCode ? 'in.test(1, (runner) => {})' : savedCode)
    })
  }, [])

  return (
    <div className='api-testing-code-editor'>
      <Editor
        value={code}
        padding={10}
        id='code-editor'
        onValueChange={handleCodeChange}
        highlight={code => highlight(code, languages.js)}
      />
      <button
        disabled={running}
        onClick={handleRunTests}
        className='runner-button'
      >
        {running ? 'Running Tests...' : 'Run Tests'}
      </button>
      <style>
        {`
          #code-editor {
            font-size: 16px;
            border-radius: 5px;
            border: 2px solid #666;
            font-family: "Fira Code", "Fira Mono", monospace;
          }

          .api-testing-code-editor {
            padding: 20px;
          }

          .code-editor-label {
            margin-bottom: 10px;
          }

          .runner-button {
            margin-top: 20px;
            font-weight: 500;
            font-size: 16px;
            border-radius: 5px;
            background: #3f388d;
            padding: 10px 20px;
          }

          .runner-button:hover {
            opacity: 0.8;
          }

          .token.comment,
          .token.block-comment,
          .token.prolog,
          .token.doctype,
          .token.cdata {
            color: #999;
          }

          .token.punctuation {
            color: #ccc;
          }

          .token.tag,
          .token.attr-name,
          .token.namespace,
          .token.deleted {
            color: #e2777a;
          }

          .token.function-name {
            color: #6196cc;
          }

          .token.boolean,
          .token.number,
          .token.function {
            color: #f08d49;
          }

          .token.property,
          .token.class-name,
          .token.constant,
          .token.symbol {
            color: #f8c555;
          }

          .token.selector,
          .token.important,
          .token.atrule,
          .token.keyword,
          .token.builtin {
            color: #cc99cd;
          }

          .token.string,
          .token.char,
          .token.attr-value,
          .token.regex,
          .token.variable {
            color: #7ec699;
          }

          .token.operator,
          .token.entity,
          .token.url {
            color: #67cdcc;
          }

          .token.important,
          .token.bold {
            font-weight: bold;
          }

          .token.italic {
            font-style: italic;
          }

          .token.entity {
            cursor: help;
          }

          .token.inserted {
            color: green;
          }
        `}
      </style>
    </div>
  )
}

export default App
