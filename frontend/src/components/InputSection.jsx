import * as React from 'react';
import styled from 'react-emotion';

import Notice from './Notice';
import TextInput from './TextInput';
import { Heading } from './Typography';

export default ({ displayName, type = 'text', value = '', error = false, onChange, onBlur }) => (
    <div
        css={`
            margin: 1em 0;

            > input {
                width: 35%;
            }
            > span {
                margin-bottom: 0.5em;
            }
        `}
    >
        <Heading size={4}>{displayName}</Heading>
        
        <div
            css={`
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;

                > div {
                    margin: 0 0 0 0.5em;
                    flex: 1 0 auto;
                }
            `}
        >
            <TextInput
                placeholder={displayName}
                type={type}
                value={value}
                error={Boolean(error)}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error !== false
                ? <Notice error>{error}</Notice>
                : undefined
            }
        </div>
    </div>
);
