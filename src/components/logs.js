import React from 'react'

function Logs ({ logs }) {
  return logs.map(({ name, results }, index) => (
    <details open key={index}>
      <summary>{name}</summary>
      <ul>
        {results.map(({ type, name, msg }, index) => (
          <li key={index}>
            [{type}]: {name} {msg ? `(${msg})` : null}
          </li>
        ))}
      </ul>
    </details>
  ))
}

export default Logs
