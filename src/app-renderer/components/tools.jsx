import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { remote, ipcRenderer } from 'electron'
import { clearMessages } from '../redux'

import * as XLSX from 'xlsx'
const dialog = remote.dialog


export default class Tools extends Component {
  constructor (props) {
    super(props)
    this.handleClearAll = this.handleClearAll.bind(this)
    this.handleJSONExport = this.handleJSONExport.bind(this)
    this.handleXLSExport = this.handleXLSExport.bind(this)
  }

  handleXLSExport () {
    let data = this.props.messages
    let ws = XLSX.utils.json_to_sheet(data, {
      header: ['channel', 'received', 'content']
    })
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Exported Data')
    var o = dialog.showSaveDialog(remote.getCurrentWindow())
    if (o) {
      if (! o.match(/.xlsx$/)) o += '.xlsx'
      XLSX.writeFile(wb, o)
    }
   }

  handleJSONExport () {
    let s = JSON.stringify({data: this.props.messages})
    const fs = require('fs')
    var o = dialog.showSaveDialog(remote.getCurrentWindow())
    if (o) {
      if (! o.match(/.json$/)) o += '.json'
      fs.writeFileSync(o, s, 'utf-8')
    } 
  }

  handleClearAll () {
    const { dispatch } = this.props
    dispatch(clearMessages())
  }

  render() {
    return <div>
      <Button color='primary' className='mr-2' onClick={this.handleXLSExport} >Export Excel</Button>
      <Button color='primary' className='mr-2' onClick={this.handleJSONExport} >Export JSON</Button>
      <Button color='danger' onClick={this.handleClearAll} >Clear All</Button>
    </div>
  }
}