import { addMessage } from './redux'

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export function handleRabbitMsg(dispatch, sub, msg) {
  const data = {
    content: msg.content,
    color: sub.color,
    tag: sub.tag,
    received: new Date(),
    id: uuidv4()
  }
  dispatch(addMessage(data))
}