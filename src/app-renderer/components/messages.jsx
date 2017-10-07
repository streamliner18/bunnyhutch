import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Table } from 'reactstrap'
import { IconFA } from './Icons'
import { addMessage, clearMessages } from "../redux";

const MsgItem = (props) => 
  <tr>
    <td>
      <div style={{
        height: 24, width: 24,
        verticalAlign: 'top',
        backgroundColor: props.color,
        borderRadius: '50%'
      }}/>
    </td>
    <td>
      {props.received.toLocaleTimeString()}
    </td>
    <td>{props.content}</td>
  </tr>


export default class Messages extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { messages } = this.props
    return <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Timestamp</th>
          <th>Content</th>
        </tr>
      </thead>
      <tbody>
        {messages.map(i => <MsgItem key={i.id} {...i} />)}
      </tbody>
    </Table>
  }
}