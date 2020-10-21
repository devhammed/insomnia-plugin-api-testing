import React from 'react'
import Log from './log'

function Logs ({ logs }) {
  return logs.map(({ name, results }, index) => (
    <details open className='request' key={index}>
      <summary>
        #{index}. {name}
      </summary>
      <ul className='logs'>
        {results.map((log, index) => (
          <Log key={index} {...log} />
        ))}
      </ul>
    </details>
  ))
}

export default Logs
