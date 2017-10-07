import React, { Component } from 'react';
import AppNav from './components/navbar'
import { Container, Row, Col } from 'reactstrap'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import Subscriptions from './components/subscriptions'
import Messages from './components/messages'
import Settings from './components/settings'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import Reducers from './redux'

export let store = createStore(Reducers)

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
    return <div>
      <AppNav {...connection} dispatch={dispatch} />
      <Container fluid className="pt-2">
        <Row>
          <Col md='12'>
          <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Subscriptions
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Settings
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Subscriptions connection={connection} dispatch={dispatch} subscriptions={subscriptions} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Settings />
              </Col>
            </Row>
          </TabPane>
          </TabContent>
          </Col>
        </Row>
        <Row>
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
