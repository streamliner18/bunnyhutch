import _ from 'lodash'
import update from 'immutability-helper'

export function connect(config, err) {
  if (err) console.log('Reconnecting due to', err)
  return {type: "CONNECTION_START", config}
}

export function disconnect() {
  return {type: "CONNECTION_STOP"}
}

export function connected() {
  console.log('[ACTION] Connected.')
  return {type: "CONNECTION_OK"}
}

export default function connection(state = {status: "disconnected", config: {}}, action) {
  switch (action.type) {
    case "CONNECTION_START":
      const { config } = action
      if (!config) return update(state, {status: {$set: 'connecting'}})
      else return {status: 'connecting', config}
    case "CONNECTION_OK":
      return update(state, {status: {$set: 'connected'}})
    case "CONNECTION_STOP":
      return {status: 'disconnected'}
    default:
      return state
  }
}