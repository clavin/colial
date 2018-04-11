import * as React from 'react';
import { connect } from 'react-redux';
import { select } from '@rematch/select';
const color = require('color');

import Button, { ColoredButton } from '../components/Button';
import ColorPicker from '../components/ColorPicker';
import { Heading } from '../components/Typography';
import LoadingIndicator from '../components/LoadingIndicator';
import StatusPostList from '../components/StatusPostList';

import { generateRandomColor } from '../misc/util';

const mapState = (state) => ({
    loggedIn: select.user.loggedIn(state),
    themeColor: select.user.themeColor(state),
    hasLoadedPosts: select.posts.hasLoaded(state, 'public'),
    posts: select.posts.posts(state)
});
const mapDispatch = ({ user: { updateStatusColor }, posts: { fetchPublicWall, newPost } }) => ({
    updateStatusColor,
    fetchPublicWall,
    newPost
});

@connect(mapState, mapDispatch)
export default class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newPostOpen: false,
            isPosting: false
        };
    }

    render() {
        if (!this.props.hasLoadedPosts) {
            this.props.fetchPublicWall();
        }

        return (
            <>
                <div
                    css={`
                        display: flex;
                        flex-flow: $row nowrap;
                        justify-content: space-between;
                        margin-bottom: 1em;
                    `}
                >
                    <Heading size={1}>Public Wall</Heading>
                    {this.props.loggedIn
                        ? this.state.newPostOpen
                            ? <Button onClick={this.newPostOpenFn(false)}>Cancel</Button>
                            : (
                                <ColoredButton
                                    onClick={this.newPostOpenFn(true)}
                                    disabled={this.state.isPosting}
                                    color={this.props.themeColor}
                                >
                                    New Post
                                </ColoredButton>
                            )
                        : undefined
                    }
                </div>
                {this.state.newPostOpen ? (
                        <ColorPicker
                            btnText="Post"
                            onComplete={this.handlePost.bind(this)}
                        />
                    )
                    : this.state.isPosting ? <LoadingIndicator />
                    : undefined
                }
                {this.props.hasLoadedPosts
                    ? <StatusPostList posts={this.props.posts} />
                    : <LoadingIndicator />
                }
            </>
        );
    }

    /**
     * Binds a function to set the state to a given `open` value.
     * @param {boolean} newValue The new `open` state value when the returned function is called.
     */
    newPostOpenFn(newValue) {
        return () => {
            if (!this.state.isPosting) {
                this.setState({ newPostOpen: newValue })
            }
        };
    }

    /**
     * Creates a new post with the given color.
     * @param {*} newColor The new color to post.
     */
    async handlePost(newColor) {
        // Close the post component, show that we're posting.
        this.setState({
            newPostOpen: false,
            isPosting: true
        });

        // Actually send the post.
        await this.props.newPost({ color: newColor.hex().substring(1) });
        // Update the application state with the new post color.
        this.props.updateStatusColor(newColor.hex());

        // Done posting.
        this.setState({
            isPosting: false
        });
    }
}
