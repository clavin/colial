import * as React from 'react';
import { connect } from 'react-redux';
import { select } from '@rematch/select';

import Button, { ColoredButton } from '../components/Button';
import { Heading, Paragraph } from '../components/Typography';
import LoadingIndicator from '../components/LoadingIndicator';
import StatusPostList from '../components/StatusPostList';

import API from '../misc/API';

const mapState = (state) => ({
    userId: state.user.id,
    loggedIn: select.user.loggedIn(state),
    themeColor: select.user.themeColor(state),
    hasLoadedPosts: select.posts.hasLoaded(state, 'user'),
    posts: select.posts.posts(state)
});
const mapDispatch = ({ posts: { fetchUserWall } }) => ({
    fetchUserWall
});

@connect(mapState, mapDispatch)
export default class UserPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingUserInfo: true,
            userInfo: null
        };
    }

    render() {
        // Load user information.
        if (this.state.loadingUserInfo) {
            this.loadUserInfo();
            return <LoadingIndicator />;
        }

        // Alias the user info.
        const user = this.state.userInfo;

        // Begin loading posts.
        if (!this.props.hasLoadedPosts) {
            this.props.fetchUserWall(user.id);
        }

        return (
            <>
                <div
                    css={`
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        margin-bottom: 0.5em;
                    `}
                >
                    <Heading size={2}>{user.username}</Heading>
                    {/*
                        The following part is a bit dense, so here's an explanation:
                        
                        If the user is logged in and isn't the current user, show a follow/unfollow
                        button. Otherwise (if it's our profile or we're not logged in), show
                        nothing.
                    */}
                    {this.props.loggedIn && this.props.userId !== user.id
                        ? user.following
                            ? <Button onClick={this.bindFollow(false)}>Unfollow</Button>
                            : (
                                <ColoredButton
                                    color={this.props.themeColor}
                                    onClick={this.bindFollow(true)}
                                >
                                    Follow
                                </ColoredButton>
                            )
                        : undefined}
                </div>
                <Paragraph>Followers: {user.followers}</Paragraph>
                {this.props.hasLoadedPosts
                    ? <StatusPostList posts={this.props.posts} />
                    : <LoadingIndicator />
                }
            </>
        );
    }

    bindFollow(willFollow) {
        return () => {
            API.user.follow({
                id: parseInt(this.props.match.params.id),
                remove: !willFollow
            });
            this.setState({
                userInfo: {
                    ...this.state.userInfo,
                    following: willFollow
                }
            });
        };
    }

    async loadUserInfo() {
        const info = await API.user.info({ id: parseInt(this.props.match.params.id) });
        this.setState({
            loadingUserInfo: false,
            userInfo: info
        });
    }

    async loadUserPosts() {
        const posts = await API.posts.list({
            type: 'user',
            id: parseInt(this.props.match.params.id)
        });
        this.setState({
            loadingUserPosts: false,
            userPosts: posts
        });
    }
}
