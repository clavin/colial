import styled, { css } from 'react-emotion';

const headingSizes = [
    '2.5em',
    '2em',
    '1.5em',
    '1.2em',
    '1em',
    '0.8em'
];

export const Heading = styled.span`
    display: block;
    font-size: ${props => headingSizes[props.size - 1 || 1]};
    font-weight: bold;
`;

export const Paragraph = styled.p``;

export const List = styled.ul`
    -webkit-margin-before: 0.2em;
    -webkit-margin-after: 0.2em;
    margin: 0.2em 0;
`;
