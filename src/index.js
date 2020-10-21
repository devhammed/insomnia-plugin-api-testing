import React from 'react'
import ReactDOM from 'react-dom'

import App from './containers/app'

export const requestGroupActions = [
  {
    label: 'API Testing',
    action: async (context, data) => {
      const props = {
        data,
        context,
        readFile: require('fs').readFileSync
      }
      const root = document.createElement('div')

      ReactDOM.render(<App {...props} />, root)

      context.app.dialog(`API Testing (${data.requestGroup.name})`, root, {
        onHide () {
          ReactDOM.unmountComponentAtNode(root)
        }
      })
    }
  }
]
