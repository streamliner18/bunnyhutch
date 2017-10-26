import _ from 'lodash'
import { uuidv4 } from '../utils/uuid'
import update from 'immutability-helper'

const debug = 1;

export function addSub(data) {
  return {type: "SUBSCRIPTION_ADD", data}
}

export function deleteSub(tag) {
  return {type: "SUBSCRIPTION_DELETE", tag}
}

export function setSubVisible(tag, visibility=true) {
  return {type: "SUBSCRIPTION_VISIBLE", tag, visibility}
}

export function invalidateAllSub() {
  return {type: "SUBSCRIPTION_INVALID_ALL"}
}

export function invalidateSub(tag) {
  if (debug) console.log('[ACTION] Invalidating Sub', tag) 
  return {type: "SUBSCRIPTION_INVALID", tag}
}

export function validateSub(tag) {
  if (debug) console.log('[ACTION] Validating Sub', tag)
  return {type: "SUBSCRIPTION_VALID", tag}
}

export default function subscriptions(state = [], action) {
  let unchanged
  let target
  switch (action.type) {
    case "SUBSCRIPTION_ADD":
      let data = Object.assign({}, action.data, {
        _id: uuidv4(),
        active: false
      })
      return _.concat(state, data)
    case "SUBSCRIPTION_DELETE":
      return _.filter(state, i => action.tag != i._id)
    case "SUBSCRIPTION_VISIBLE":
      // TODO: Visibility not implemented
      return state
    case "SUBSCRIPTION_INVALID_ALL":
      return _.map(state, i => update(i, {active: {$set: false}}))
    case "SUBSCRIPTION_INVALID":
      unchanged = _.filter(state, i => action.tag != i._id)
      target = _.filter(state, i => action.tag == i._id)[0]
      return _.concat(unchanged, update(target, {active: {$set: false}}))
    case "SUBSCRIPTION_VALID":
      unchanged = _.filter(state, i => action.tag != i._id)
      target = _.filter(state, i => action.tag == i._id)[0]
      return _.concat(unchanged, update(target, {active: {$set: true}}))
    default:
      return state
  }
}