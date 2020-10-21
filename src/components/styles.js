import React from 'react'

function Styles () {
  return (
    <style>
      {`
          .api-testing-code-editor {
            padding: 20px;
          }

          .api-testing-code-editor .logs .log {
            margin-bottom: 5px;
          }

          .api-testing-code-editor .code-editor {
            font-size: 16px;
            border-radius: 5px;
            border: 1px solid #666;
            font-family: "Fira Code", "Fira Mono", monospace;
          }

          .api-testing-code-editor .runner-button {
            margin-top: 20px;
            font-weight: 500;
            font-size: 16px;
            border-radius: 5px;
            background: #3f388d;
            padding: 10px 20px;
          }

          .api-testing-code-editor .runner-button:hover {
            opacity: 0.8;
          }

          .api-testing-code-editor .token.comment,
          .api-testing-code-editor .token.block-comment,
          .api-testing-code-editor .token.prolog,
          .api-testing-code-editor .token.doctype,
          .api-testing-code-editor .token.cdata {
            color: #999;
          }

          .api-testing-code-editor .token.punctuation {
            color: #ccc;
          }

          .api-testing-code-editor .token.tag,
          .api-testing-code-editor .token.attr-name,
          .api-testing-code-editor .token.namespace,
          .api-testing-code-editor .token.deleted {
            color: #e2777a;
          }

          .api-testing-code-editor .token.function-name {
            color: #6196cc;
          }

          .api-testing-code-editor .token.boolean,
          .api-testing-code-editor .token.number,
          .api-testing-code-editor .token.function {
            color: #f08d49;
          }

          .api-testing-code-editor .token.property,
          .api-testing-code-editor .token.class-name,
          .api-testing-code-editor .token.constant,
          .api-testing-code-editor .token.symbol {
            color: #f8c555;
          }

          .api-testing-code-editor .token.selector,
          .api-testing-code-editor .token.important,
          .api-testing-code-editor .token.atrule,
          .api-testing-code-editor .token.keyword,
          .api-testing-code-editor .token.builtin {
            color: #cc99cd;
          }

          .api-testing-code-editor .token.string,
          .api-testing-code-editor .token.char,
          .api-testing-code-editor .token.attr-value,
          .api-testing-code-editor .token.regex,
          .api-testing-code-editor .token.variable {
            color: #7ec699;
          }

          .api-testing-code-editor .token.operator,
          .api-testing-code-editor .token.entity,
          .api-testing-code-editor .token.url {
            color: #67cdcc;
          }

          .api-testing-code-editor .token.important,
          .api-testing-code-editor .token.bold {
            font-weight: bold;
          }

          .api-testing-code-editor .token.italic {
            font-style: italic;
          }

          .api-testing-code-editor .token.entity {
            cursor: help;
          }

          .api-testing-code-editor .token.inserted {
            color: green;
          }
        `}
    </style>
  )
}

export default Styles
