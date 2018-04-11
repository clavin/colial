import * as React from 'react';

import { Heading, Paragraph } from '../components/Typography';
import LoadingIndicator from '../components/LoadingIndicator';

/** A cute, little 404 page. */
export default () => (
    <div css={`text-align: center;`}>
        <LoadingIndicator />
        <Heading size={2}>Kansas?</Heading>
        <Paragraph>Wherever that is, you're not in it.</Paragraph>
        <Paragraph
            css={`
                color: #999;
                font-size: 0.8em;
            `}
        >
            Page not found.
        </Paragraph>
    </div>
);
