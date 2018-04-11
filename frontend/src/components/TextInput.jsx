import * as React from 'react';
import { css } from 'react-emotion';

export default (props) => (
    <input
        type="text"
        css={`
            font: inherit;

            padding: 0.25em 0.5em;
            ${props.width !== undefined ? css`width: ${props.width};` : ''}
            
            background-color: white;
            color: #555;
            border: 0.25em solid ${props.error ? '#c77' : '#aaa'};

            font: inherit;

            :hover, :focus {
                border-color: ${props.error ? '#daa' : '#ccc'};
                outline: none;
            }
            :focus {
                color: #333;
            }
        `}
        {...props}
    />
);
