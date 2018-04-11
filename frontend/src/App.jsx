import * as React from 'react';
import styled, { injectGlobal } from 'react-emotion';
import Loadable from 'react-loadable';
import { Provider, connect } from 'react-redux';
import { withRouter, BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom';
import { select } from '@rematch/select';
import * as color from 'color';

import store from './misc/models';
import FaviconGenerator from './misc/FaviconGenerator';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingIndicator from './components/LoadingIndicator';

injectGlobal`
    html {
        font-size: 14pt;
    }
    body {
        font-family: -apple-system, Helvetica, Segoe UI, sans-serif;
        margin: 0;
    }
`;

/** Turns a page name into a dynamically loadable page. */
const pageLoader = (pageName) => Loadable({
    loader: () => import(`./pages/${pageName}`),
    loading: LoadingIndicator
});

const mapState = (state) => ({
    user: state.user,
    themeColor: select.user.themeColor(state)
});
const mapDispatch = ({ user: { fetchUserData } }) => ({
    fetchUserData
});

@withRouter
@connect(mapState, mapDispatch)
class App extends React.Component {
    constructor(props) {
        super(props);
        this.faviconGenerator = new FaviconGenerator();
    }

    render() {
        // Initialize fetching user data at the start.
        if (this.props.user === null) {
            this.props.fetchUserData();
        }
        // Update the favicon.
        this.faviconGenerator.setToColor(this.props.themeColor);
    
        return (
            <>
                <Header />
                <main
                    css={`
                        width: 800px;
                        margin: 1.5em auto;
                    `}
                >
                    {
                        this.props.user === null
                            ? <LoadingIndicator />
                            : <Switch>
                                <Route exact path='/' component={pageLoader('HomePage')} />
                                <Route path='/home' component={pageLoader('HomePage')} />
                                <Route path='/login' component={pageLoader('LoginPage')} />
                                <Route path='/logout' component={pageLoader('LogoutPage')} />
                                <Route path='/register' component={pageLoader('RegisterPage')} />
                                <Route path='/user/:id' component={pageLoader('UserPage')} />
                                <Route component={pageLoader('NotFoundPage')} />
                            </Switch>
                    }
                </main>
                <Footer />
            </>
        )
    }
}

// Switch the type of router based on the environment the application is running in.
// `BrowserRouter` seems to not work with `webpack-serve`, so HashRouter is used during development
// instead.
const Router = process.env.NODE_ENV === 'development' ? HashRouter : BrowserRouter;

export default () => (
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
);
