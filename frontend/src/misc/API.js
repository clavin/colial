import { generateRandomColor } from './util';

/**
 * A utility function for binding API methods to sending certain types of HTTP method requests.
 * @param {string} method The API method
 * @param {string} httpMethod The HTTP method used for sending requests to this API method
 */
function bindMethod(method, httpMethod) {
    switch (httpMethod) {
        case 'GET':
            return () =>
                fetch('/api/' + method, {
                    credentials: 'same-origin',
                    method: 'GET'
                })
                    .then((resp) => resp.json())
                    .then((result) => {
                        if (!result.hasOwnProperty('ok') || !result.ok) {
                            throw new Error(result.error || 'unknown API error');
                        } else {
                            return result.data;
                        }
                    });
            break;
        case 'POST':
            return (params) =>
                fetch('/api/' + method, {
                    credentials: 'same-origin',
                    method: 'POST',
                    body: JSON.stringify(params)
                })
                    .then((resp) => resp.json())
                    .then((result) => {
                        if (!result.hasOwnProperty('ok') || !result.ok) {
                            throw new Error(result.error || 'unknown API error');
                        } else {
                            return result.data;
                        }
                    });
            break;
        default:
            throw new Error(`unimplemented API HTTP method: ${httpMethod}`);
    }
}

if (process.env.NODE_ENV === 'development') {
    // Mock the responses of certain API methods for development purposes.
    const mocks = {
        'session/current': {
            loggedIn: true,
            id: 1,
            username: 'Albert',
            statusColor: generateRandomColor().hex()
        },
        'user/register': (payload) => ({
            loggedIn: true,
            id: 3,
            username: payload.username,
            statusColor: null
        }),
        'posts/list': {
            type: 'public',
            posts: [
                {
                    id: 1,
                    userId: 1,
                    username: 'Albert',
                    color: generateRandomColor().hex(),
                    timestamp: (Date.now() / 1000) - 60
                },
                {
                    id: 2,
                    userId: 2,
                    username: 'Bianca',
                    color: generateRandomColor().hex(),
                    timestamp: (Date.now() / 1000) - 60 * 60
                }
            ]
        },
        'posts/new': (payload) => ({
            id: Math.random(),
            userId: 1,
            username: 'Albert',
            color: '#' + payload.color,
            timestamp: Date.now() / 1000
        }),
        'user/info': {
            id: 2,
            username: 'Bianca',
            followers: 6,
            following: false
        },
        'posts/delete': true
    };

    // Replace `bindMethod` with a version that injects mocked responses where possible.
    const origBindMethod = bindMethod;
    bindMethod = function(method, httpMethod = 'POST') {
        if (mocks.hasOwnProperty(method)) {
            if (typeof mocks[method] === 'function') {
                return (...args) => {
                    const result = mocks[method](...args);
                    if (result instanceof Promise) {
                        return result;
                    } else {
                        return Promise.resolve(result);
                    }
                };
            } else {
                return () => Promise.resolve(mocks[method]);
            }
        } else {
            return origBindMethod(method, httpMethod);
        }
    }
}

// Export the binding of API methods to sender functions.
export default {
    test: bindMethod('test', 'POST'),
    session: {
        current: bindMethod('session/current', 'GET'),
        login: bindMethod('session/login', 'POST'),
        logout: bindMethod('session/logout', 'GET')
    },
    user: {
        register: bindMethod('user/register', 'POST'),
        info: bindMethod('user/info', 'POST'),
        follow: bindMethod('user/follow', 'POST')
    },
    posts: {
        list: bindMethod('posts/list', 'POST'),
        new: bindMethod('posts/new', 'POST'),
        delete: bindMethod('posts/delete', 'POST')
    }
};
