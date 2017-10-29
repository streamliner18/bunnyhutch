import { combineReducers } from 'redux'
import messages from './messages'
import connection from './connection'
import settings from './settings'
import subscriptions from './subscriptions'


export default combineReducers({
  subscriptions,
  messages,
  settings,
  connection
})

export * from './connection'
export * from './subscriptions'
export * from './messages'
export * from './settings'
