import _ from 'lodash'

export function addMessage(data) {
  return {type: "MESSAGE_ADD", data}
}

export function clearMessages() {
  return {type: "MESSAGE_CLEAR"}
}

export default function messages(state = {data: [], columns:[]}, action) {
  switch (action.type) {
    case "MESSAGE_ADD":
      let data = action.data.content
      try {
        data = data.toString('utf8')
        try {
          data = JSON.parse(data)
        } catch(e) {
          data = {value: data}
        }
      } finally {
        action.data.content = data
        let new_cols = Object.keys(data)
        const result = {
          data: _.concat([action.data], state.data),
          columns: [...new Set([].concat(...state.columns, ...new_cols))]
        }
        return result
      }
    case "MESSAGE_CLEAR":
      return {data: [], columns:[]}
    default:
      return state
  }
}
