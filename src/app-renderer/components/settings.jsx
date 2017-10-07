import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { remote, ipcRenderer } from 'electron'


export default class Settings extends Component {
  constructor (props) {
    super(props)
    this.handleNewSession = this.handleNewSession.bind(this)
  }
  handleNewSession () {
    ipcRenderer.send('asynchronous-message', 'NEW_WINDOW')
  }
  render() {
    return <div>
      <Button color='primary' onClick={this.handleNewSession} >New Session</Button>
    </div>
  }
}