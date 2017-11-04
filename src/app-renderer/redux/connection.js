import _ from 'lodash'
import update from 'immutability-helper'

export function connect(config, err) {
  if (err) console.log('Reconnecting due to', err)
  return {type: "CONNECTION_START", config}
}

export function disconnect(normal=true) {
  return {type: "CONNECTION_STOP", normal: normal}
}

export function connected() {
  console.log('[ACTION] Connected.')
  return {type: "CONNECTION_OK"}
}

export default function connection(state = {status: "disconnected", config: {}, retry: 0}, action) {
  switch (action.type) {
    case "CONNECTION_START":
      const { config } = action
      if (!config) return update(state, {status: {$set: 'connecting'}, retry: {$set: state.retry + 1}})
      else return {status: 'connecting', config, retry: 0}
    case "CONNECTION_OK":
      return update(state, {status: {$set: 'connected'}})
    case "CONNECTION_STOP":
      if (action.normal) return {status: 'disconnected'}
      return update(state, {status: {$set: 'disconnected'}})
    default:
      return state
  }
}