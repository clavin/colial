import * as React from 'react';
import styled from 'react-emotion';
const color = require('color');

import ChannelSlider from './ChannelSlider';
import { ColoredButton } from './Button';
import TextInput from './TextInput';

import { generateRandomColor, modifyUserColorForBorder, modifyUserColorForText, range } from '../misc/util';

const GRADIENT_SEGMENTS = 13;

export default class ColorPicker extends React.Component {
    constructor(props) {
        super(props);

        const initialColor = props.initalColor || generateRandomColor(true);
        this.state = {
            color: initialColor,
            textInputValue: initialColor.hex()
        };
    }

    render() {
        const currColor = this.state.color;
        const currH = currColor.hue();
        const currS = currColor.saturationl();
        const currL = currColor.lightness();
        return (
            <div
                css={`
                    margin: 1em 0;

                    background-color: #444;
                    color: #ddd;
                    border: 0.5em solid #222;
                `}
            >
                <div
                    css={`
                        display: flex;
                        flex-flow: column nowrap;
                        padding: 0.5em;
                    `}
                >
                    <div
                        style={{
                            backgroundColor: currColor.rgb().string()
                        }}
                        css={`
                            display: flex;
                            flex-flow: column nowrap;
                            justify-content: center;

                            margin-bottom: 0.8em;
                            height: 8.5em;

                            background-color: ${currColor.rgb().string()};
                            color: ${modifyUserColorForText(currColor).rgb().string()};
                            border: 0.5em solid
                                ${modifyUserColorForBorder(currColor).rgb().string()};
                        `}
                    >
                        <span
                            css={`
                                text-align: center;
                                font-size: 4em;
                                font-weight: 200;
                            `}
                        >
                            {this.state.color.hex()}
                        </span>
                    </div>
                    <ChannelSlider
                        segments={
                            range(GRADIENT_SEGMENTS)
                                .map((n) => n * (360 / (GRADIENT_SEGMENTS - 1)))
                                .map((n) => `hsl(${n}, 100%, 50%)`)
                        }
                        percent={currH / 360}
                        updatePercent={(newPercent) => {
                            this.setState({
                                color: color.hsl(
                                    newPercent * 360,
                                    currS,
                                    currL
                                )
                            })
                        }}
                    />
                    <ChannelSlider
                        segments={
                            range(GRADIENT_SEGMENTS)
                                .map((n) => n * (100 / (GRADIENT_SEGMENTS - 1)))
                                .map((n) => `hsl(${currH}, ${n}%, ${currL}%)`)
                        }
                        percent={currS / 100}
                        updatePercent={(newPercent) => {
                            this.setState({
                                color: color.hsl(
                                    currH,
                                    newPercent * 100,
                                    currL
                                )
                            });
                        }}
                    />
                    <ChannelSlider
                        segments={
                            range(GRADIENT_SEGMENTS)
                                .map((n) => n * (100 / (GRADIENT_SEGMENTS - 1)))
                                .map((n) => `hsl(${currH}, ${currS}%, ${n}%)`)
                        }
                        percent={currL / 100}
                        updatePercent={(newPercent) => {
                            this.setState({
                                color: color.hsl(
                                    currH,
                                    currS,
                                    newPercent * 100
                                )
                            });
                        }}
                    />
                    <div
                        css={`
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: space-between;
                            margin-top: 1em;
                        `}
                    >
                        <TextInput
                            value={this.state.textInputValue}
                            onChange={this.onTextInputChange.bind(this)}
                            width="5em"
                        />
                        <ColoredButton
                            color={this.state.color}
                            onClick={() => this.props.onComplete(currColor)}
                        >
                            {this.props.btnText}
                        </ColoredButton>
                    </div>
                </div>
            </div>
        );
    }

    onTextInputChange(event) {
        try {
            const inputColor = color.rgb(event.target.value);
            this.setState({
                color: inputColor,
                textInputValue: event.target.value
            });
        } catch(err) {
            this.setState({
                textInputValue: event.target.value
            });
        }
    }
}
