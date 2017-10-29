import React, { Component } from 'react'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { IconFA } from './Icons'
import { connect, disconnect } from "../redux";

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
    dispatch(connect(this.state))
  }

  render() {
    // TODO: Handle the new tri-state indicator
    const { dispatch, status } = this.props
    const { broker, username, password } = this.state
    return (
      <Navbar light fixed='top' expand="md">
        <NavbarBrand href="#">🐇</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          {
            status == 'connected'
              ? <Nav>
                <NavLink>
                  <span>
                    Connected to {this.state.broker}
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
                <Button onClick={this.handleConnect} disabled={status=='connecting'}>Connect</Button>
              </Form>
          }
        </Collapse>
      </Navbar>
    );
  }
}