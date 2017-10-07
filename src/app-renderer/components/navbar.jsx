import React, { Component } from 'react'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { IconFA } from './Icons'
import { connect, disconnect } from "../redux";
import amqp from "amqplib/callback_api";

export default class AppNav extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      broker: 'localhost',
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this)
    this.handleConnect = this.handleConnect.bind(this)
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleChange (event) {
    let a = {}
    a[event.target.name] = event.target.value
    this.setState(a);
  }

  handleConnect () {
    const { dispatch } = this.props
    const { broker, username, password } = this.state
    let connStr = 'amqp://'
    if (username) {
      connStr += username
      if (password) connStr += ':' + password
      connStr += '@'
    }
    connStr += broker
    amqp.connect(connStr, (err, conn) => {
      console.log("Connection OK")
      conn.createChannel((err, ch) => {
        dispatch(connect(broker, ch, conn))
        console.log("Channel created")
      })
    })
  }

  render() {
    const { dispatch, connected } = this.props
    const { broker, username, password } = this.state
    return (
      <Navbar light expand="md">
        <NavbarBrand href="/">Bunnyhutch</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          {
            connected
              ? <Nav>
                <NavLink>
                  <span>
                    Connected to {this.props.broker}
                    </span>
                </NavLink>
                <Button onClick={() => dispatch(disconnect())}>disconnect</Button>
              </Nav>
              : <Form inline>
                <FormGroup className='mr-2'>
                  <InputGroup>
                    <InputGroupAddon><IconFA i='server'/></InputGroupAddon>
                    <Input value={broker} type="text" name="broker" id="brokerAddress" onChange={this.handleChange} placeholder="AMQP Address" />
                  </InputGroup>
                </FormGroup>
                <FormGroup className='mr-2'>
                  <InputGroup>
                    <InputGroupAddon><IconFA i='user'/></InputGroupAddon>
                    <Input value={username} type="text" name="username" id="brokerUsername" onChange={this.handleChange} placeholder="Username"/>
                  </InputGroup>
                </FormGroup>
                <FormGroup className='mr-2'>
                  <InputGroup>
                    <InputGroupAddon><IconFA i='key'/></InputGroupAddon>
                    <Input value={password} type="password" name="password" id="brokerPassword" onChange={this.handleChange} placeholder="Password" />
                  </InputGroup>
                </FormGroup>
                <Button onClick={this.handleConnect}>Connect</Button>
              </Form>
          }
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">Github</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}