const reg = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g

const highlightColors = {
  key: 'color: red;',
  string: 'color: green;',
  number: 'color: darkorange;',
  boolean: 'color: blue;',
  null: 'color: magenta;'
}

export default function syntaxHighlight (json) {
  const jsonFormat = JSON.stringify(JSON.parse(json), undefined, 2).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return jsonFormat.replace(reg, (match)=>{
    let styleKey = 'number'
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        styleKey = 'key'
      } else {
        styleKey = 'string'
      }
    } else if ( /true|false/.test(match) ) {
      styleKey = 'boolean'
    } else if ( /null/.test(match) ) {
      styleKey = 'null'
    }
    return `<span style="${highlightColors[styleKey]}">${match}</span>`
  })
}
