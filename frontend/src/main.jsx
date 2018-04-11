import * as React from 'react';
import { render } from 'react-dom';

// Polyfill ES6+ and the Fetch API
import 'babel-polyfill';
import 'whatwg-fetch';

import App from './App';

render(
    <App />,
    document.getElementById('app')
);
