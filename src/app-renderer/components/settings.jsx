import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { remote, ipcRenderer, shell } from 'electron'


export default class Settings extends Component {
  constructor (props) {
    super(props)
    this.handleNewSession = this.handleNewSession.bind(this)
    this.handleAbout = this.handleAbout.bind(this)
  }
  handleNewSession () {
    ipcRenderer.send('asynchronous-message', 'NEW_WINDOW')
  }
  handleAbout () {
    shell.openExternal('https://github.com/streamliner18/bunnyhutch')
  }
  render() {
    return <div>
      <Button color='primary' className='mr-2' onClick={this.handleNewSession} >New Session</Button>
      <Button color='info' onClick={this.handleAbout}>Github</Button>
    </div>
  }
}