import * as React from 'react';
import { connect } from 'react-redux';
import { select } from '@rematch/select';
const color = require('color');

import { relightnessify } from '../misc/util';

const MAX_COLORS = 3;
const BLOCK_WIDTH = 12;
const COLOR_TRANSITION_TIME = 1000/2;
const INDICATOR_SIZE = BLOCK_WIDTH * (2 * MAX_COLORS - 1);

function nudgeInRange(n, range, min, max) {
    const randMin = Math.max(min, n - range);
    const randMax = Math.min(max, n + range);
    return randMin + (randMin - randMax) * Math.random();
}

const generateNextColor = (baseColor, steps) =>
    baseColor
        .rotate(45 * Math.sin(steps * 7/9))
        .lighten(0.35 * Math.sin(steps * 5/11) / 2);

const mapState = (state) => ({
    themeColor: select.user.themeColor(state)
});

@connect(mapState)
export default class LoadingIndicator extends React.Component {
    constructor(props) {
        super(props);

        this.nextColorTimeout = undefined;

        this.colorId = 0;
        this.baseColor = relightnessify(props.themeColor, 10, 90);
        this.state = {
            colors: [{
                key: -1,
                color: this.baseColor
            }]
        };
    }

    componentDidMount() {
        this.pushNextColor();
    }

    componentDidUpdate() {
        clearTimeout(this.nextColorTimeout);
        this.pushNextColor();
    }

    componentWillUnmount() {
        clearTimeout(this.nextColorTimeout);
    }

    render() {
        return (
            <div
                css={`
                    position: relative;
                    width: ${INDICATOR_SIZE}px;
                    height: ${INDICATOR_SIZE}px;
                    margin: 1em auto;
                `}
            >
                {this.state.colors.map((colorObj, index) => {
                    const size = Math.min(
                        Math.max(0, BLOCK_WIDTH * (2 * index - 1)),
                        INDICATOR_SIZE
                    );
                    const position = (INDICATOR_SIZE - size)/2;
                    return (
                        <div
                            key={colorObj.key}
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                top: `${position}px`,
                                left: `${position}px`,
                                backgroundColor: colorObj.color.rgb().string(),
                                zIndex: -index
                            }}
                            css={`
                                position: absolute;
                                transition: all ${COLOR_TRANSITION_TIME}ms ease;
                            `}
                        />
                    )
                })}
            </div>
        );
    }

    pushNextColor() {
        this.nextColorTimeout = setTimeout(() => {
            const colors = this.state.colors;
            const newColors = [];
            for (let i = 0; i < Math.min(colors.length, MAX_COLORS + 1); i++) {
                newColors[i + 1] = colors[i];
            }

            newColors[0] = {
                key: this.colorId++,
                color: generateNextColor(this.baseColor, this.colorId)
            };

            this.setState({
                colors: newColors
            });
        }, COLOR_TRANSITION_TIME);
    }
}
