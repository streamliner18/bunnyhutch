import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { remote, ipcRenderer } from 'electron'
import { clearMessages } from '../redux'
import _ from 'lodash'

import * as XLSX from 'xlsx'
const dialog = remote.dialog

function transformMessage(msgs) {
  let data = _.map(msgs, _.clone)
  return _.map(data, i => {
    let s = i.content
    s.name = i.name
    s.received = i.received
    return Object.assign({}, s)
  })
}


export default class Tools extends Component {
  constructor (props) {
    super(props)
    this.handleClearAll = this.handleClearAll.bind(this)
    this.handleJSONExport = this.handleJSONExport.bind(this)
  }

  handleXLSExport (transform) {
    let data = _.map(this.props.messages.data, _.clone)
    if (transform) data = transformMessage(data)
    else {
      data = data.map(i => Object.assign(i, {content: JSON.stringify(i.content)}))
    }
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

  handleJSONExport (transform) {
    let s = JSON.stringify(this.props.messages)
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
      <Button color='primary' className='mr-2' onClick={this.handleXLSExport.bind(this, false)} >Export Excel</Button>
      <Button color='primary' className='mr-2' onClick={this.handleXLSExport.bind(this, true)} >Export Excel (Tabulated)</Button>
      <Button color='primary' className='mr-2' onClick={this.handleJSONExport} >Export JSON</Button>
      <Button color='danger' onClick={this.handleClearAll} >Clear All</Button>
    </div>
  }
}