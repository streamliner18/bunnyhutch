import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Table } from 'reactstrap'
import { IconFA } from './Icons'
import { addMessage, clearMessages } from "../redux";
import _ from 'lodash'

const MsgItem = (props) => {
  return <tr>
  <td>
    <div style={{
      height: 24, width: 24,
      verticalAlign: 'top',
      backgroundColor: props.data.color,
      borderRadius: '50%'
    }}/>
  </td>
  <td>
    {props.data.received.toLocaleTimeString()}
  </td>
  {props.columns.map(i => 
  <td key={i}>{String(props.data.content[i] || '')}</td>)}
</tr>
}
  


export default class Messages extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { messages } = this.props
    const { data, columns } = messages
    return <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Timestamp</th>
          {columns.map(i => <th key={i}>{i}</th>)}
        </tr>
      </thead>
      <tbody>
        {_.slice(data, 0, 1000).map(i => <MsgItem key={i._id} columns={columns} data={i} />)}
      </tbody>
    </Table>
  }
}