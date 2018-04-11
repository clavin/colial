import * as React from 'react';
import { connect } from 'react-redux';
import { select } from '@rematch/select';
import { Redirect } from 'react-router-dom';

import LoadingIndicator from '../components/LoadingIndicator';

const mapState = (state) => ({
    loggedIn: select.user.loggedIn(state)
});
const mapDispatch = ({ user: { logout } }) => ({
    logout
});

export default connect(mapState, mapDispatch)(({ loggedIn, logout }) => {
    // If we're logged in, logout.
    if (loggedIn) {
        logout();
    }
    // If we're logged out, redirect to home.
    return loggedIn ? <LoadingIndicator /> : <Redirect to='/' />;
});
