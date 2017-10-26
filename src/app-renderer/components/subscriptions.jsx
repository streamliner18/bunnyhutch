import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import { Form, FormGroup, InputGroup, Input, Label, Button } from 'reactstrap'
import { IconFA } from './Icons'
import { ListGroup, ListGroupItem } from 'reactstrap'
import { CirclePicker } from 'react-color'
import { addSub, deleteSub } from "../redux";
import { handleRabbitMsg } from '../rabbit'

class NewSubscriptionModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      exchange: '',
      bind: '#',
      name: '',
      color: '#f00',
      active: true,
      cansubmit: {bind: true}
    }
    this.handleColorPicker = this.handleColorPicker.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  handleColorPicker(color) {
    this.setState({
      color: color.hex
    })
  }

  handleChange (event) {
    let a = {}
    a[event.target.name] = event.target.value
    a.cansubmit = Object.assign({}, this.state.cansubmit)
    a.cansubmit[event.target.name] = (event.target.value != '')
    this.setState(a);
  }

  toggle () {
    this.setState({
      exchange: '',
      bind: '#',
      name: '',
      color: '#f00',
      cansubmit: {bind: true}
    })
    this.props.toggle()
  }

  handleSubmit(e) {
    // FIXME: Data driven implementation
    e.preventDefault()
    const { dispatch } = this.props
    const { exchange, bind, name, color } = this.state
    dispatch(addSub({exchange, bind, name, color}))
    this.toggle()
  }

  render() {
    const { handleChange } = this
    const { dispatch, subscriptions, connection } = this.props
    const can = this.state.cansubmit
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>New Subscription</ModalHeader>
        <Form>
          <ModalBody>
            <FormGroup>
              <Label for="newsub-name">Name:</Label>
              <Input onChange={handleChange} id='newsub-name' name='name' value={this.state.name} />
            </FormGroup>
            <FormGroup>
              <Label for="newsub-exchange">Exchange:</Label>
              <Input onChange={handleChange} id='newsub-exchange' name='exchange' value={this.state.exchange} />
            </FormGroup>
            <FormGroup>
              <Label for="newsub-bind">Binding Key:</Label>
              <Input onChange={handleChange} id='newsub-bind' name='bind' value={this.state.bind} />
            </FormGroup>
            <FormGroup>
              <CirclePicker color={this.state.color} width={400} onChangeComplete={this.handleColorPicker} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.toggle}>Cancel</Button>
            <Button color='primary' onClick={this.handleSubmit}
            disabled={!(can.name && can.exchange && can.bind)}>Add</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}

const SubItem = (props) => <ListGroupItem className='py-0' color={props.active ? "" : "secondary"}>
  <div
    style={{
      marginRight: 5,
      backgroundColor: props.color,
      height: 24, width: 24,
      borderRadius: '50%',
      display: 'inline-block',
      verticalAlign: 'top',
      margin: '10px 0'
    }} />
  <div style={{ display: 'inline-block', margin: '12px 10px', verticalAlign: 'top' }}>
    <strong className='ml-1 mr-3'>{props.name}</strong>
    {props.exchange} => {props.bind}
  </div>
  <Button className='float-right my-2' color='danger' size='sm' onClick={props.unsub}>Delete</Button>
</ListGroupItem>

export default class Subscriptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal_open: false
    }
    this.toggleModal = this.toggleModal.bind(this)
  }

  toggleModal() {
    this.setState({
      modal_open: !this.state.modal_open
    })
  }

  handleUnsub(tag) {
    const { dispatch } = this.props
    dispatch(deleteSub(tag))
  }

  render() {
    const { dispatch, subscriptions, connection } = this.props
    return <div>
      <Container fluid>
        <Row className='my-2'>
          <Col sm={12}>
            <Button onClick={this.toggleModal}><IconFA i='plus' /> New Subscription</Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <ListGroup>
              {
                subscriptions.map(i => <SubItem
                  key={i._id}
                  unsub={this.handleUnsub.bind(this, i._id)}
                  {...i}
                />)
              }
            </ListGroup>
          </Col>
        </Row>
      </Container>
      <NewSubscriptionModal
        toggle={this.toggleModal}
        open={this.state.modal_open} 
        {...this.props} />
    </div>
  }
}