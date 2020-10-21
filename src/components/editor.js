import React, { useState, useEffect } from 'react'
import SimpleEditor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'

function Editor ({ code, setCode, groupId, store }) {
  const codeStoreKey = `${groupId}_api_testing`

  const handleCodeChange = value => {
    setCode(value)
    store.setItem(codeStoreKey, value)
  }

  useEffect(() => {
    store.getItem(codeStoreKey).then(savedCode => {
      setCode(!savedCode ? 'ins.testsFor(0, test => {})' : savedCode)
    })
  }, [])

  return (
    <SimpleEditor
      value={code}
      padding={10}
      className='code-editor'
      onValueChange={handleCodeChange}
      highlight={code => highlight(code, languages.js)}
    />
  )
}

export default Editor
