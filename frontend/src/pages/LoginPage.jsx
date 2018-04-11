import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { select } from '@rematch/select';
import { Redirect } from 'react-router-dom';

import Button, { ColoredButton } from '../components/Button';
import InputSection from '../components/InputSection';
import Notice from '../components/Notice';
import { Heading } from '../components/Typography';

const mapState = (state) => ({
    loggedIn: select.user.loggedIn(state),
    themeColor: select.user.themeColor(state),
    loginError: state.user.loginError
});
const mapDispatch = ({ user: { login } }) => ({
    login
});

@connect(mapState, mapDispatch)
export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {} // input field values
        };
        // Stores functions that handle changes for input fields.
        this.changeHandlers = {};
    }

    render() {
        // Disallow logging in if we're already logged in.
        if (this.props.loggedIn) {
            return <Redirect to='/' />;
        }

        // Only allow submissions when both fields have values.
        const canSubmit = Object.keys(this.state.values).length === 2
            && this.state.values.username !== ''
            && this.state.values.password !== '';

        return (
            <form onSubmit={canSubmit ? this.onSubmit.bind(this) : undefined}>
                <Heading size={1}>Login</Heading>

                {this.props.loginError
                    ? <Notice error>{this.props.loginError}</Notice>
                    : undefined
                }

                <InputSection
                    displayName="Username"
                    value={this.state.values.username || ''}
                    onChange={this.changeHandler('username')}
                />
                <InputSection
                    displayName="Password"
                    type="password"
                    value={this.state.values.password || ''}
                    onChange={this.changeHandler('password')}
                />

                {canSubmit
                    ? <ColoredButton color={this.props.themeColor}>Submit</ColoredButton>
                    : <Button disabled>Submit</Button>
                }
            </form>
        )
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

    onSubmit(event) {
        event.preventDefault();
        this.props.login(this.state.values);
    }
}
