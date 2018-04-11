import { init } from '@rematch/core';
import selectorsPlugin from '@rematch/select';
const color = require('color');

import API from './API';
import { generateRandomColor } from './util';

const user = {
    name: 'user',
    state: null,
    reducers: {
        update(state, payload) {
            return payload;
        },
        updateStatusColor(state, payload) {
            return {
                ...state,
                statusColor: payload
            }
        }
    },
    effects: {
        async fetchUserData() {
            const newData = await API.session.current();
            this.update(newData);
        },
        async login(payload) {
            try {
                this.update(await API.session.login(payload));
            } catch (err) {
                this.update({
                    loggedIn: false,
                    loginError: err.message || err
                })
            }
        },
        async logout() {
            await API.session.logout();
            this.update({
                loggedIn: false
            });
        },
        async register(payload) {
            try {
                this.update(await API.user.register(payload));
            } catch (err) {
                this.update({
                    loggedIn: false,
                    registrationError: err.message || err
                });
            }
        }
    },
    selectors: {
        loggedIn(state) {
            return state !== null && state.loggedIn;
        },
        themeColor(state) {
            if (state === null || state.statusColor == undefined) {
                return generateRandomColor(true);
            } else {
                return color(state.statusColor);
            }
        }
    }
};

const posts = {
    name: 'posts',
    state: null,
    reducers: {
        addPost(state, payload, start = true) {
            if (state === null) {
                return {
                    posts: [payload]
                };
            } else if (start) {
                return {
                    ...state,
                    posts: [payload].concat(state.posts)
                };
            } else {
                return {
                    ...state,
                    posts: state.posts.concat([payload])
                }
            }
        },
        reset(state, payload) {
            return payload;
        },
        removePost(state, payload) {
            return {
                ...state,
                posts: state.posts.filter((post) => post.id !== payload)
            };
        }
    },
    effects: {
        async fetchPublicWall() {
            this.reset(await API.posts.list({ type: 'public' }));
        },
        async fetchUserWall(payload) {
            this.reset(await API.posts.list({
                type: 'user',
                id: payload
            }));
        },
        async newPost(payload) {
            this.addPost(await API.posts.new(payload));
        },
        async deletePost(payload) {
            await API.posts.delete({ id: payload });
            this.removePost(payload);
        }
    },
    selectors: {
        hasLoaded(state, type) {
            return state !== null && state.type === type;
        },
        posts(state) {
            return state === null ? [] : state.posts;
        }
    }
}

export default init({
    models: {
        user,
        posts
    },
    plugins: [
        selectorsPlugin()
    ]
});
