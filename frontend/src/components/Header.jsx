import * as React from 'react';
import styled, { css, cx } from 'react-emotion';
import { connect } from 'react-redux';
import { select } from '@rematch/select';
import { Link } from 'react-router-dom';
const color = require('color');

import { relightnessify, modifyUserColorForBorder, modifyUserColorForText } from '../misc/util';

const headerLink = css`
    text-decoration: none;
    color: inherit;
`;
const navItem = css`
    margin: 0 1em;
`;

const ThemedHeader = styled.header`
    width: 100%;
    height: 5rem;
    line-height: 5rem;

    background-color: ${props => relightnessify(props.color, 10, 90).rgb().string()};
    border-bottom-width: 0.5em;
    border-bottom-style: solid;

    border-bottom: 0.5em solid ${props => modifyUserColorForBorder(props.color).rgb().string()};
    color: ${props => modifyUserColorForText(props.color).rgb().string()};
`;

const ThemedHeaderContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    width: 800px;
    margin: 0 auto;
`;

const LogoLink = styled(Link)`
    ${headerLink}

    font-weight: bold;
    font-size: 1.5em;

    ::before {
        content: '';

        display: inline-block;
        position: relative;
        width: 0.8em;
        height: 0.8em;
        top: 0.5em;
        margin-right: 0.5em;

        border: 0.4em solid ${props => modifyUserColorForText(props.color).rgb().string()};
        border-left-color: ${props => modifyUserColorForText(props.color).lighten(0.2).rgb().string()};
        border-right-color: transparent;
    }
`;

const mapState = (state) => ({
    user: state.user,
    loggedIn: select.user.loggedIn(state),
    themeColor: select.user.themeColor(state)
});

export default connect(mapState)(({ user, loggedIn, themeColor }) => (
    <ThemedHeader color={themeColor}>
        <ThemedHeaderContainer>
            <LogoLink color={themeColor} to="/" />
            <nav>
                {loggedIn
                    ? <>
                        <span className={navItem}>Logged in as {user.username}</span>
                        <Link to="/logout" className={cx(navItem, headerLink)}>Logout</Link>
                    </>
                    : <>
                        <Link to="/login" className={cx(navItem, headerLink)}>Login</Link>
                        <Link to="/register" className={cx(navItem, headerLink)}>Register</Link>
                    </>}
            </nav>
        </ThemedHeaderContainer>
    </ThemedHeader>
));
