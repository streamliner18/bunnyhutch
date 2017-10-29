import React, { Component } from 'react';
import AppNav from './components/navbar'
import { Container, Row, Col } from 'reactstrap'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import Subscriptions from './components/subscriptions'
import Messages from './components/messages'
import Tools from './components/tools'
import Settings from './components/settings'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import Reducers from './redux/'
import RabbitDriver from './drivers/rabbit'

export let store = createStore(Reducers)

const inputMenu = require('electron-input-menu')
const context = require('electron-contextmenu-middleware')

context.use(inputMenu)

context.activate()
inputMenu.registerShortcuts()

export class App extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render() {
    const { dispatch, connection, subscriptions, messages, settings } = this.props
    const { activeTab } = this.state
    return <div style={{height: '100%'}}>
      <AppNav {...connection} dispatch={dispatch} />
      <RabbitDriver {...this.props} />
      <Container fluid className="pt-2 mt-5 main-container">
        <Row>
          <Col md='12'>
          <Nav tabs>
          <NavItem><NavLink
              className={classnames({active: activeTab==='1'})}
              onClick={() => {this.toggle('1')}}
          >
            Subscriptions
          </NavLink></NavItem>
          <NavItem><NavLink
              className={classnames({active: activeTab==='2'})}
              onClick={() => { this.toggle('2'); }}
          >
            Tools
          </NavLink></NavItem>
          <NavItem><NavLink
              className={classnames({active:activeTab=== '3'})}
              onClick={() => { this.toggle('3'); }}
          >
            Settings
          </NavLink></NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row><Col sm="12">
              <Subscriptions {...this.props} />
            </Col></Row>
          </TabPane>
          <TabPane tabId="2">
            <Row><Col sm="12">
              <Tools {...this.props} />
            </Col></Row>
          </TabPane>
          <TabPane tabId="3">
            <Row><Col sm="12">
              <Settings />
            </Col></Row>
          </TabPane>
          </TabContent>
          </Col>
        </Row>
        <Row className="message-area">
          <Col sm='12'>
            <Messages {...this.props} />
          </Col>
        </Row>
      </Container>
      </div>
  }
}

const connectionSelector = (state) => state

App = connect(connectionSelector)(App)

export default class AppWrapper extends Component {
  render() {
    return <Provider store={store}><App /></Provider>
  }
}
