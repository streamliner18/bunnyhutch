import { combineReducers } from 'redux'
import _ from 'lodash'

// action functions

export function addSub(data) {
  return {type: "SUBSCRIPTION_ADD", data}
}

export function deleteSub(tag) {
  return {type: "SUBSCRIPTION_DELETE", tag}
}

export function setSubVisible(tag, visibility=true) {
  return {type: "SUBSCRIPTION_VISIBLE", tag, visibility}
}

export function connect(broker, ch, conn) {
  return {type: "CONNECTION_START", broker, ch, conn}
}

export function disconnect() {
  return {type: "CONNECTION_STOP"}
}

export function addMessage(data) {
  return {type: "MESSAGE_ADD", data}
}

export function clearMessages() {
  return {type: "MESSAGE_CLEAR"}
}

// Reducers

function subscriptions(state = [], action) {
  switch (action.type) {
    case "SUBSCRIPTION_ADD":
      return _.concat(state, action.data)
    case "SUBSCRIPTION_DELETE":
      return _.filter(state, (i) => action.tag != i.tag)
    case "SUBSCRIPTION_VISIBLE":
      return state
    default:
      return state
  }
}

function messages(state = [], action) {
  switch (action.type) {
    case "MESSAGE_ADD":
      return _.concat([action.data], state)
    case "MESSAGE_CLEAR":
      return []
    default:
      return state
  }
}

function connection(state = {connected: false, broker: ''}, action) {
  switch (action.type) {
    case "CONNECTION_START":
      const {broker, ch, conn} = action
      return { connected: true, broker, ch, conn }
    case "CONNECTION_COMPLETE":
      break;
    case "CONNECTION_STOP":
      state.conn.close()
      return {connected: false}
    default:
      return state
  }
}

function settings(state = {}, action) {
  return state
}


export default combineReducers({
  subscriptions,
  messages,
  settings,
  connection
})