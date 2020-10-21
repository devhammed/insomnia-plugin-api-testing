import React from 'react'

function Log ({ type, name, msg }) {
  return (
    <li className='log'>
      <span className={`log-type log-type-${type}`}>{type}</span> {name}{' '}
      {msg ? `(${msg})` : null}
    </li>
  )
}

export default Log
