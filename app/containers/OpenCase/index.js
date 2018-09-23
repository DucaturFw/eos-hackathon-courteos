/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Button,
  Form,
  Segment,
  TextArea,
  Step,
  Dropdown,
  Input,
  Message,
  Grid,
  Header,
  Modal,
  Loader,
  Dimmer,
} from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { IntlProvider } from 'react-intl';
import { initialState } from './reducer';
import { push } from 'react-router-redux';

const getAgreement = (_parties = [], type, name = 'CourtEOS') => {
  if (!_parties || _parties.length < 2) return '...Agreement placeholder...';
  if (type !== 'attached' && type !== 'generated') {
    throw new Error(
      'Type should be equal to `generated` or `attached`, not',
      type,
    );
  }
  const parties = _parties.map(v => options.find(o => o.value === v).text);
  const oth = parties.slice(0, parties.length - 1);
  const pref = oth.join(', ');
  return `${pref.charAt(0).toUpperCase() + pref.slice(1)} and ${
    parties[parties.length - 1]
  } agree that any dispute arising out of or in connection with the ${type} contract, including any question regarding its existence, validity or termination shall be referred to and finally resolved by arbitration under the ${name}.`;
};

class ResolveModal extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange({ target }, data = null) {
    let { value, name } = data;
    if (!data) {
      value = target.type === 'checkbox' ? target.checked : target.value;
      name = target.name;
    }

    this.setState({
      [name]: value,
    });
  }

  show = size => () => this.setState({ size, open: true });
  close = () => this.setState({ open: false });

  render() {
    const { open, size } = this.state;

    return (
      <div>
        <Button primary onClick={this.show('small')}>
          Resolve
        </Button>

        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Header>Resolve dispute</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to close this dispute?</p>
          </Modal.Content>
          <Form>
            <Form.Field
              control={TextArea}
              label="Final result including link to file"
              name="final"
              value={this.state.final || ''}
              onChange={this.handleInputChange}
              placeholder="Decided to split the amount in 70/30 proportions for dispute starter and another participant ( http://hell.yeah/70/30 )"
            />
          </Form>
          <Modal.Actions>
            <Button negative onClick={this.close}>
              No
            </Button>
            <Button
              onClick={this.props.cb}
              positive
              icon="checkmark"
              labelPosition="right"
              content="Yes"
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

class OpenDisputeModal extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange({ target }, data = null) {
    let { value, name } = data;
    if (!data) {
      value = target.type === 'checkbox' ? target.checked : target.value;
      name = target.name;
    }

    this.setState({
      [name]: value,
    });
  }

  show = size => () => this.setState({ size, open: true });
  close = () => this.setState({ open: false });

  render() {
    const { open, size } = this.state;

    return (
      <div>
        <Button negative onClick={this.show('small')}>
          Dispute
        </Button>

        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Header>Open dispute</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to open dispute?</p>
          </Modal.Content>
          <Form>
            <Form.Field
              control={TextArea}
              label="Reason"
              name="reason"
              value={this.state.reason || ''}
              onChange={this.handleInputChange}
              placeholder="Reason to open the dispute"
            />
          </Form>
          <Modal.Actions>
            <Button negative onClick={this.close}>
              No
            </Button>
            <Button
              onClick={this.props.cb}
              positive
              icon="checkmark"
              labelPosition="right"
              content="Yes"
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const options = [
  { key: '1', text: 'Microsoft', value: 'microsoft' },
  { key: '2', text: 'Apple', value: 'apple' },
  { key: '3', text: 'Alphabet', value: 'alphabet' },
  { key: '4', text: 'Yandex', value: 'yandex' },
  { key: '5', text: 'Lenovo', value: 'lenovo' },
  { key: '6', text: 'HP', value: 'hp' },
];

const minExp = [
  { key: '1', text: 'Any', value: 1 },
  { key: '2', text: 'Experienced', value: 2 },
  { key: '3', text: 'Master', value: 3 },
];

const judges = [
  { key: '1', text: 'April Jane', value: '1', level: 1 },
  { key: '2', text: 'Ioan Bell', value: '2', level: 1 },
  { key: '3', text: 'John Ford', value: '3', level: 2 },
  { key: '4', text: 'Henry Dijkstra', value: '4', level: 3 },
];

const getSteps = (steps, currStep, cb) => (
  <Step.Group ordered>
    {steps.map((step, idx) => (
      <Step
        key={step.title}
        completed={idx < currStep}
        active={idx === currStep}
        onClick={() => cb(idx)}
      >
        <Step.Content>
          <Step.Title>{step.title}</Step.Title>
        </Step.Content>
      </Step>
    ))}
  </Step.Group>
);

class OpenCase extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    if (props.state) {
      console.log('p-s');
      this.state = props.state;
    } else if (props.match.params.id) {
      console.log('m-s');
      this.state = props.cases[props.match.params.id];
    } else {
      console.log('s-s');
      this.state = {
        state: 'new',
        loading: false,
        step: 0,
        steps: 2,
        type: 'attached',
        parties: [],
        party1: '',
        party2: '',
        files: [],
        signature: '',
        signature2: '',
        expertise: 1,
        judges: [],
      };
    }

    console.log('state', this.state);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.selectType = this.selectType.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.getFinalButton = this.getFinalButton.bind(this);
  }

  getFinalButton() {
    if (this.state.state === 'resolve')
      return (
        <Button.Group style={{ float: 'right' }}>
          <ResolveModal cb={() => this.next('resolved')} />
        </Button.Group>
      );
    if (
      this.props.show &&
      this.state.state === 'signed' &&
      !this.state.disputeEnd
    ) {
      return (
        <Button.Group style={{ float: 'right' }}>
          <OpenDisputeModal cb={() => this.next('disputed')} />
        </Button.Group>
      );
    }
    return (
      <Button.Group style={{ float: 'right' }}>
        <Button onClick={this.back} disabled={!this.state.step}>
          Back
        </Button>
        <Button
          onClick={this.next}
          positive={this.state.step === this.state.steps}
          disabled={
            this.state.step === this.state.steps && this.state.disputeEnd
          }
        >
          {(this.state.step !== this.state.steps && 'Next') ||
            ((this.state.disputeEnd && 'Awaiting') ||
              (this.state.result && 'Finished') ||
              '') ||
            (this.state.state === 'pending' && 'Accept') ||
            'Submit'}
        </Button>
      </Button.Group>
    );
  }

  onDrop(acceptedFiles) {
    this.setState({ files: acceptedFiles.map(file => file.name) });
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        // const fileAsBinaryString = reader.result;
        // do whatever you want with the file content
        // console.log(fileAsBinaryString);
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });
  }

  selectType(type) {
    if (['attached', 'generated'].indexOf(type) === -1)
      throw new Error('Type only could be `generated` or `attached`');
    this.setState({ type });
  }

  next(param) {
    if (param === 'disputed' || param === 'resolved') {
      if (this.state.state === 'signed') {
        this.setState({ state: param });
        this.props.dispatch({
          type: 'UPDATE_CASE',
          payload: {
            step: 0,
            ...this.state,
            state: param,
            disputeEnd: param === 'disputed' ? '2018-10-10' : null,
          },
        });
        this.props.dispatch(push(`/show/${this.state.id}`));
      }
      if (this.state.state === 'pending') {
        this.setState({ state: 'signed' });
        this.props.dispatch({
          type: 'UPDATE_CASE',
          payload: { step: 0, ...this.state, state: 'signed' },
        });
        this.props.dispatch(push(`/show/${this.state.id}`));
      }
      if (this.state.state === 'new') {
        const id = Math.floor(Math.random() * 1000);
        this.setState({ state: 'pending' });
        this.props.dispatch({
          type: 'OPEN_CASE',
          payload: {
            id,
            ...this.state,
            step: 0,
            state: 'pending',
          },
        });
        this.props.dispatch(push(`/show/${id}`));
      }
      return;
    }
    if (this.state.step < this.state.steps) {
      this.setState({ step: this.state.step + 1 });
    } else {
      if (this.state.state === 'signed') {
        this.setState({ state: param });
        this.props.dispatch({
          type: 'UPDATE_CASE',
          payload: {
            step: 0,
            ...this.state,
            state: param,
            disputeEnd: param === 'disputed' ? '2018-10-10' : null,
          },
        });
        this.props.dispatch(push(`/show/${this.state.id}`));
      }
      if (this.state.state === 'pending') {
        this.setState({ state: 'signed' });
        this.props.dispatch({
          type: 'UPDATE_CASE',
          payload: { step: 0, ...this.state, state: 'signed' },
        });
        this.props.dispatch(push(`/show/${this.state.id}`));
      }
      if (this.state.state === 'new') {
        const id = Math.floor(Math.random() * 1000);
        this.setState({ state: 'pending' });
        this.props.dispatch({
          type: 'OPEN_CASE',
          payload: {
            id,
            ...this.state,
            step: 0,
            state: 'pending',
          },
        });
        this.props.dispatch(push(`/show/${id}`));
      }
    }
  }

  back() {
    if (this.state.step > 0) this.setState({ step: this.state.step - 1 });
    else {
      this.setState({ step: 0 });
    }
  }

  handleInputChange({ target }, data = null) {
    let { value, name } = data;
    if (!data) {
      value = target.type === 'checkbox' ? target.checked : target.value;
      name = target.name;
    }

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div>
        <h1>
          {(this.props.show === 1 && 'Show') ||
            (this.props.resolve === 1 && 'Resolve') ||
            (this.props.accept === 1 && 'Accept') ||
            'Open'}{' '}
          Case
        </h1>
        <Segment>
          {getSteps(
            ['Agreement', 'Contract', 'Judges'].map(e => ({ title: e })),
            this.state.step,
            step => this.setState({ step }),
          )}
          {this.getFinalButton()}
          <Form>
            {this.state.step === 0 && (
              <div>
                <Dropdown
                  disabled={this.props.accept}
                  placeholder="Select parties"
                  fluid
                  multiple
                  search
                  selection
                  name="parties"
                  onChange={this.handleInputChange}
                  value={this.state.parties}
                  options={
                    this.state.parties.length >= 2
                      ? options.filter(
                        p => this.state.parties.indexOf(p.value) !== -1,
                      )
                      : options
                  }
                />
                <br />
                The contract is:&nbsp;&nbsp;&nbsp;
                <Button.Group>
                  <Button
                    primary={this.state.type === 'attached'}
                    onClick={() => {
                      if (!this.props.accept) this.selectType('attached');
                    }}
                  >
                    Attached
                  </Button>
                  <Button.Or />
                  <Button
                    primary={this.state.type === 'generated'}
                    onClick={() => {
                      if (!this.props.accept) this.selectType('generated');
                    }}
                  >
                    On-platform
                  </Button>
                </Button.Group>
                {this.state.type === 'generated' && (
                  <Message info>
                    <Message.Header>Fully EOS</Message.Header>
                    <p>
                      Contracts generated on platform utilize EOS and instantly
                      apply final decision (arbitrated or not).
                    </p>
                  </Message>
                )}
                <Segment text={1}>
                  {getAgreement(this.state.parties, this.state.type)}
                </Segment>
                <Form.Group widths="equal">
                  <Form.Field
                    disabled={this.props.show}
                    control={TextArea}
                    label="Signature"
                    name={this.state === 'pending' ? 'signature2' : 'signature'}
                    value={
                      this.state === 'pending'
                        ? this.state.signature2
                        : this.state.signature || ''
                    }
                    onChange={this.handleInputChange}
                    placeholder="Text above signed with your country's applicable e-signature"
                  />
                </Form.Group>
              </div>
            )}
            {this.state.step === 2 && (
              <div>
                <Form.Group>
                  <Dropdown
                    disabled={this.props.accept}
                    placeholder="Judges min expertise"
                    fluid
                    selection
                    name="expertise"
                    onChange={this.handleInputChange}
                    value={this.state.expertise}
                    options={minExp}
                  />
                </Form.Group>
                <Dropdown
                  disabled={this.props.accept}
                  placeholder="Judges"
                  fluid
                  selection
                  multiple
                  search
                  name="judges"
                  onChange={this.handleInputChange}
                  value={this.state.judges || []}
                  options={judges.filter(
                    judge => judge.level >= (this.state.expertise || 0),
                  )}
                />
              </div>
            )}
            {this.state.step === 1 &&
              ((this.state.type === 'generated' && (
                <div>
                  <Form.Group>
                    <Dropdown
                      disabled={this.props.accept}
                      placeholder="Client"
                      label="Client"
                      fluid
                      selection
                      search
                      name="client"
                      onChange={this.handleInputChange}
                      value={this.state.client || ''}
                      options={this.state.parties.map(v =>
                        options.find(o => o.value === v),
                      )}
                    />
                    <Dropdown
                      disabled={this.props.accept}
                      placeholder="Executor"
                      label="Executor"
                      fluid
                      selection
                      search
                      name="executor"
                      onChange={this.handleInputChange}
                      value={this.state.executor || ''}
                      options={this.state.parties.map(v =>
                        options.find(o => o.value === v),
                      )}
                    />
                  </Form.Group>
                  <Form.Field
                    disabled={this.props.accept}
                    control={TextArea}
                    label="Subject matter"
                    placeholder="Subject matter"
                    name="subj"
                    onChange={this.handleInputChange}
                    value={this.state.subj || ''}
                  />
                  <Form.Group widths="equal">
                    <Form.Field
                      disabled={this.props.accept}
                      control={Input}
                      type="number"
                      min={1}
                      label="Life Time (days)"
                      placeholder="10"
                      width="4"
                      name="lifeTime"
                      onChange={this.handleInputChange}
                      value={this.state.lifeTime || ''}
                    />
                    <Form.Field
                      disabled={this.props.accept}
                      control={Input}
                      type="number"
                      label="EOS Amount"
                      placeholder="1200.5"
                      min={0}
                      name="amount"
                      width="7"
                      onChange={this.handleInputChange}
                      value={this.state.amount || ''}
                    />
                  </Form.Group>
                </div>
              )) ||
                (this.state.type === 'attached' && (
                  <div>
                    <br />
                    <br />
                    {(this.props.accept && (
                      <Header
                        as="h2"
                        content="Files in contract:"
                        textAlign="center"
                      />
                    )) || (
                      <div>
                        <Header
                          as="h2"
                          content="Drop zone for contract file"
                          textAlign="center"
                        />
                        <br />
                        <Grid centered columns={1}>
                          <Dropzone onDrop={this.onDrop}>
                            {props => (
                              <div>
                                {props.acceptedFiles.join('\n')}
                                <br />
                                <h1>+</h1>
                              </div>
                            )}
                          </Dropzone>
                        </Grid>
                      </div>
                    )}
                    <Segment text={1}>
                      Files: {(this.state.files || []).join(', ')}
                    </Segment>
                    <br />
                    <h5>
                      Upload your contract file. It would be acceptable only for
                      contract members (including judges in case of dispute).
                    </h5>
                    <br />
                  </div>
                )))}
          </Form>
        </Segment>
        {/* {JSON.stringify(this.state)} */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(111, state);
  return {
    cases: state.get('cases', initialState).cases,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OpenCase);
