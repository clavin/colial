import styled, { css } from 'react-emotion';

import { relightnessify, modifyUserColorForText, modifyUserColorForBorder } from '../misc/util';

const buttonStyle = css`
    -webkit-appearance: initial;
    cursor: pointer;

    padding: 0.25em 0.5em;
    border-width: 0.25em;
    border-style: solid;

    font: inherit;

    :focus, :active {
        outline: none;
    }
`;

export default styled.button`
    ${buttonStyle}

    background-color: white;
    color: #777;
    border-color: #aaa;

    :disabled {
        background-color: #999;
        border-color: #999;
        color: #555;

        cursor: initial;
    }
    :not(:disabled):hover, :not(:disabled):focus {
        border-color: #ddd;
    }
    :not(:disabled):active {
        background-color: #ccc;
        border-color: #aaa;
        color: #555;
    }
`;

export const ColoredButton = styled.button`
    ${buttonStyle}

    background-color: ${props => relightnessify(props.color, 10, 90).rgb().string()};
    color: ${props => modifyUserColorForText(props.color).rgb().string()};
    border-color: ${props => modifyUserColorForBorder(props.color).rgb().string()};

    :disabled {
        background-color: ${props =>
            relightnessify(props.color, 0, 50).desaturate(0.5).rgb().string()};
        color: ${props =>
            relightnessify(modifyUserColorForText(props.color), 0, 50).desaturate(0.5).rgb().string()};
        border-color: ${props =>
            relightnessify(props.color, 0, 50).desaturate(0.5).rgb().string()};

        cursor: initial;
    }
    :not(:disabled):hover, :not(:disabled):focus {
        background-color: ${props => relightnessify(props.color, 20, 100).rgb().string()};
        color: ${props =>
            relightnessify(modifyUserColorForText(props.color), 15, 100).rgb().string()};
        border-color: ${props =>
            relightnessify(modifyUserColorForBorder(props.color), 25, 100).rgb().string()};
    }
    :not(:disabled):active {
        background-color: ${props => relightnessify(props.color, 0, 80).rgb().string()};
        color: ${props =>
            relightnessify(modifyUserColorForText(props.color), 0, 75).rgb().string()};
        border-color: ${props =>
            relightnessify(modifyUserColorForBorder(props.color), 0, 85).rgb().string()};
    }
`
