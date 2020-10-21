import React from 'react'
import ReactDOM from 'react-dom'

import App from './containers/app'

export const requestGroupActions = [
  {
    label: 'API Testing',
    action: async (context, data) => {
      const root = document.createElement('div')

      ReactDOM.render(<App context={context} data={data} />, root)

      context.app.dialog(`API Testing (${data.requestGroup.name})`, root, {
        onHide () {
          ReactDOM.unmountComponentAtNode(root)
        }
      })
    }
  }
]
