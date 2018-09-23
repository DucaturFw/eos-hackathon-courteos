import React, { Component } from 'react';
import {
  Button,
  Form,
  Input,
  Segment
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

class FormExampleFieldControl extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleInputChange = this.handleInputChange.bind(this);
    this.valid = this.valid.bind(this);
  }

  valid() {
    const { pwd, pwd2, agree } = this.state;
    return pwd && pwd.length > 5 && pwd === pwd2 && !!agree;
  }

  handleInputChange({ target }) {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div>
        <h1>
          <FormattedMessage {...messages.register} />
        </h1>
        <Segment>
          <Form>
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label="Username"
                name="username"
                onChange={this.handleInputChange}
                placeholder="Username"
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                type="password"
                label="Password"
                placeholder="password"
                name="pwd"
                onChange={this.handleInputChange}
              />
              <Form.Field
                control={Input}
                type="password"
                label="Password Again"
                placeholder="password"
                name="pwd2"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <h2>
              <FormattedMessage {...messages.personal} />
            </h2>
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label="First name"
                placeholder="First name"
                name="name"
                onChange={this.handleInputChange}
              />
              <Form.Field
                control={Input}
                label="Last name"
                placeholder="Last name"
                name="family_name"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <h2>
              <FormattedMessage {...messages.legal} />
            </h2>
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label="ID"
                placeholder="ID"
                name="id"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group grouped>
              <Form.Field
                control="input"
                type="checkbox"
                name="agree"
                onChange={this.handleInputChange}
                label="I agree to the Terms and Conditions"
              />
            </Form.Group>
            <Form.Field control={Button} disabled={!this.valid()}>
              Register
            </Form.Field>
          </Form>
        </Segment>
      </div>
    );
  }
}

export default FormExampleFieldControl;
