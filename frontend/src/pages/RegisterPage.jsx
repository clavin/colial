import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { select } from '@rematch/select';
import { Redirect } from 'react-router-dom';

import Button, { ColoredButton } from '../components/Button';
import InputSection from '../components/InputSection';
import Notice from '../components/Notice';
import { Heading } from '../components/Typography';

// Email regex taken from StackOverflow answer/HTML5 spec: https://stackoverflow.com/a/32010185/5767783
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const usernameRegex = /^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$/;

const mapState = (state) => ({
    loggedIn: select.user.loggedIn(state),
    themeColor: select.user.themeColor(state),
    registrationError: state.user.registrationError
});
const mapDispatch = ({ user: { register } }) => ({
    register
});

@connect(mapState, mapDispatch)
export default class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {}, // input field values
            touched: {} // whether each input has been selected & disselected
        };

        // Stores all of the functions that handle input element changes.
        this.changeHandlers = {};
        // Stores all of the functions that handle input element blurs (leaving input).
        this.blurHandlers = {};
    }

    render() {
        // Disallow registering when we're logged in.
        if (this.props.loggedIn) {
            return <Redirect to='/' />;
        }

        // A mapping of input field names to their display names.
        const displayNames = {
            username: 'Username',
            password: 'Password',
            email: 'Email'
        };

        // Validate the current input.
        const errors = this.validate(this.state);
        // Only able to submit if all input elements have a value & none have errors.
        const canSubmit = Object.keys(errors).length === 3 &&
            !Object.keys(errors).some(fieldName => errors[fieldName]);

        return (
            <form onSubmit={canSubmit ? this.onSubmit.bind(this) : undefined}>
                <Heading size={1}>Register</Heading>

                {this.props.registrationError
                    ? <Notice error>{this.props.registrationError}</Notice>
                    : undefined
                }

                {Object.keys(displayNames).map((fieldName) => {
                    return (
                        <InputSection
                            key={fieldName}
                            displayName={displayNames[fieldName]}
                            type={fieldName === 'password' ? 'password' : 'text'}
                            value={this.state.values[fieldName] || ''}
                            error={this.state.touched[fieldName] ? errors[fieldName] : undefined}
                            onChange={this.changeHandler(fieldName)}
                            onBlur={this.blurHandler(fieldName)}
                        />
                    );
                })}

                {canSubmit
                    ? <ColoredButton color={this.props.themeColor}>Submit</ColoredButton>
                    : <Button disabled>Submit</Button>
                }
            </form>
        )
    }

    /** Check each input to make sure there is no error in their format. */
    validate({ values: { username = '', email = '', password = '' } }) {
        return {
            username: username.length < 4 ? 'Must be at least 4 characters long'
                : username.length > 20 ? 'Must be less than 20 characters long'
                : !usernameRegex.test(username) ? 'Invalid username (allowed characters: a-z 0-9 _)'
                : false,
            email: email.length === 0 ? 'Invalid email address'
                : !emailRegex.test(email) ? 'Invalid email address'
                : false,
            password: password.length < 8 ? 'Must be at least 8 characters long' : false
        };
    }

    /**
     * Binds a function to a field name to handle updating the page's state when the input changes
     * value.
     * @param {string} fieldName The name of the field to handle changes for.
     */
    changeHandler(fieldName) {
        return this.changeHandlers[fieldName] || (this.changeHandlers[fieldName] = (event) => {
            this.setState({
                values: {
                    ...this.state.values,
                    [fieldName]: event.target.value
                }
            });
        });
    }

    /**
     * Binds a function to a field name for when the input field becomes blurred (unselected).
     * @param {string} fieldName The name of the field to handle blurs for.
     */
    blurHandler(fieldName) {
        return this.blurHandlers[fieldName] || (this.blurHandlers[fieldName] = () => {
            this.setState({
                touched: {
                    ...this.state.touched,
                    [fieldName]: true
                }
            });
        });
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.register(this.state.values);
    }
}
