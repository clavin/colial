import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
const color = require('color');
const moment = require('moment');

import { Heading } from '../components/Typography';
import { modifyUserColorForText, modifyUserColorForBorder } from '../misc/util';

const StatusPost = ({ color: statusColor, username, userId, timestamp, onDelete }) => (
    <div
        style={{
            backgroundColor: statusColor.string(),
            borderColor: modifyUserColorForBorder(statusColor).string(),
            color: modifyUserColorForText(statusColor).rgb().string()
        }}
        css={`
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: flex-end;

            padding: 1em;
            border-width: 0.5em;
            border-style: solid;
            color: black;
        `}
    >
        <div>
            <span
                css={`
                    font-size: 3em;
                    font-weight: 200;
                `}
            >
                {statusColor.hex()}
            </span>
        </div>
        <div css={`text-align: right;`}>
            <Heading size={4}>
                <Link
                    to={`/user/${userId}`}
                    css={`
                        color: inherit;
                    `}
                >
                    {username}
                </Link>
            </Heading>
            <div>{moment.unix(timestamp).fromNow()}</div>
                {onDelete !== undefined
                    ? (
                        <a
                            href='#'
                            css={`
                                color: inherit;
                                font-size: 0.75em;
                            `}
                            onClick={(event) => {
                                event.preventDefault();
                                onDelete();
                            }}
                        >
                            Delete
                        </a>
                    )
                    : undefined
                }
        </div>
    </div>
);

const mapState = (state) => ({
    userId: state.user.id
});
const mapDispatch = ({ posts: { deletePost } }) => ({
    deletePost
});

export default connect(mapState, mapDispatch)(({ posts, deletePost, userId }) => (
    <div
        css={`
            display: flex;
            flex-flow: column nowrap;
        `}
    >
        {posts.map(post => (
            <StatusPost
                key={post.id}
                color={color(post.color)}
                username={post.username}
                userId={post.userId}
                timestamp={post.timestamp}
                onDelete={post.userId === userId ? deletePost.bind(undefined, post.id) : undefined}
            />
        ))}
    </div>
));
