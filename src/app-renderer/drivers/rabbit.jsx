import React, { Component } from 'react'
import _ from 'lodash'
import { addMessage, connected, connect, disconnect, invalidateAllSub, deleteSub, validateSub, invalidateSub } from '../redux'
import amqp from 'amqplib'
import { uuidv4 } from '../utils/uuid'
import update from 'immutability-helper'

function setStateAsync (newState) {
  return new Promise(resolve => {
    this.setState(newState, () => resolve())
  })
}

class RabbitSub extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this._mounted = false
    this.setStateAsync = setStateAsync.bind(this)
  }

  async componentDidMount() {
    const {ch, data, dispatch, handler} = this.props
    console.log('[SUB:', data.name, '] Starting...')
    try {
      await ch.assertExchange(data.exchange, 'topic')
      let q = await ch.assertQueue('', {exclusive: true})
      await ch.bindQueue(q.queue, data.exchange, data.bind)
      await ch.consume(q.queue, handler.bind(this, data), {
        consumerTag: data._id,
        noAck: true
      })
      dispatch(validateSub(data._id))
    } catch (e) {
      console.log('[SUB:', data.name, '] Exception.', e, 'Retry in 1 sec.')
      if (e.cause && e.cause.message.includes('Operation failed')) {
        dispatch(deleteSub(data._id))
        alert('You have submitted an invalid subscription, and it is removed.')
      }
      setTimeout(() => {
        if (this._mounted) this.componentDidMount()
      }, 1000)
    }
    this._mounted = true && this._mounted
  }

  async componentWillUnmount() {
    this._mounted = false
    const {ch, data} = this.props
    try {
      if (ch) {
        console.log('[SUB:', data.name, '] Unsubscribing')
        await ch.cancel(data._id)
      }
    } catch (e) {
      console.log('[SUB:', data.name, '] info:', e)
    }
  }

  render () {
    return null
  }
}


export default class RabbitDriver extends Component {
  constructor (props) {
    super(props)
    this.state = {
      conn: null,
      ch: null,
      connected: false
    }
    this.setStateAsync = setStateAsync.bind(this)
  }
  
  async handleConnection(props) {
    // Handle state transition
    /*
    -> CONNECTED CONNECTING DISCONNECTED
    c    --        U+con      U+discon
    nc   U-c       con        --
    */
    // U=update state, --=meaningless
    const { connection, dispatch } = props
    switch(connection.status) {
      case 'connected':
        if (!this.state.connected) {
          // Throw away subscription right here
          // So that handleSubscription can pick up
          // when it's already connected.
          dispatch(invalidateAllSub())
          this.setState({
            connected: true,
          })
        }
        break
      case 'connecting':
        // Whether or not it's connected, you connect anyways
        // So just set the freaking state
        this.setState({connected: false})
        const { broker, username, password } = connection.config
        const authStr = username ? 
          (password ? `${username}:${password}@` : `${username}@`) : ''
        let connStr = 'amqp://' + authStr + broker
        // Connect to broker
        const reconnect = (err, retry=false) => {
          console.log("[CONN] RECONNECT by", err)
          dispatch(disconnect(false))
          if (retry && connection.retry > 3) alert('Retry too many times, disconnect')
          else dispatch(connect(null, err))
        }
        try {
          let conn = await amqp.connect(connStr)
          let ch = await conn.createChannel()
          console.log("[CONN] Channel created")
          await this.setStateAsync({conn, ch})
          dispatch(connected())
          conn.on('error', reconnect)
          conn.on('closed', reconnect)
          ch.on('error', reconnect)
        } catch (e) {
          console.log('error', e)
          reconnect(e, true)
        }
        break
      case 'disconnected':
        if (this.state.connected) {
          try {
            await this.state.conn.close()
          } catch (e) {
            console.log(e)
          }
          console.log("[CONN] Proceeding to disconnect")
          await this.setStateAsync({
            conn: null,
            connected: false,
            ch: null
          })
          dispatch(invalidateAllSub())
        }
    }
  }
  
  handleMessage(sub, msg) {
    const { dispatch } = this.props
    const data = {
      content: msg.content,
      color: sub.color,
      tag: sub.tag,
      channel: sub.name,
      received: new Date(),
      _id: uuidv4()
    }
    dispatch(addMessage(data))
  }

  componentWillReceiveProps (props) {
    // console.log("Receiving props:", props, this.props)
    if (!_.isEqual(props.connection, this.props.connection))
      this.handleConnection(props)
  }

  render () {
    return <div id='subs-noshow'>
      {
        this.state.connected ? this.props.subscriptions.map(i => {
          return <RabbitSub {...this.props}
            ch={this.state.ch}
            data={i}
            handler={this.handleMessage}
            key={i._id}
            />
        })
        : null
      }
    </div>
  }
}