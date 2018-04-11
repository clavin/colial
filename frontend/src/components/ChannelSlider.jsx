import * as React from 'react';

export default class ChannelSlider extends React.Component {
    constructor(props) {
        super(props);

        this.trackElem = null;
        this.boundHandleMouseDown = this.handleMouseDown.bind(this);
        this.boundHandleMouseUp = this.handleMouseUp.bind(this);
        this.boundHandleMouseMove = this.handleMouseMove.bind(this);
    }

    render() {
        return (
            <div
                css={`
                    height: 1.2em;
                    margin: 0.5em 0.5em;
                    background-image: linear-gradient(to right, ${this.props.segments.join(', ')});
                `}
                ref={(elem) => {
                    this.trackElem = elem;
                }}
                onMouseDown={this.boundHandleMouseDown}
            >
                <div
                    css={`
                        cursor: pointer;
                    
                        width: 1.2em;
                        height: 1.2em;
                    
                        position: relative;
                        transform: translate(-50%, -0.2em);
                        left: ${this.props.percent * 100}%;
                    
                        background-color: white;
                        border: 0.2em solid #ccc;
                        border-radius: 100%;
                    `}
                    onMouseDown={this.boundHandleMouseDown}
                />
            </div>
        );
    }

    handleMouseMove(event) {
        const boundingRect = this.trackElem.getBoundingClientRect();
        const newPercent = Math.min(
            Math.max(0, (event.clientX - boundingRect.x) / boundingRect.width), 1);
        this.props.updatePercent(newPercent);
    }

    handleMouseDown(event) {
        event.preventDefault();
        this.boundHandleMouseMove(event);
        document.addEventListener('mousemove', this.boundHandleMouseMove);
        document.addEventListener('mouseup', this.boundHandleMouseUp);
    }

    handleMouseUp(event) {
        document.removeEventListener('mousemove', this.boundHandleMouseMove);
        document.removeEventListener('mouseup', this.boundHandleMouseUp);
    }
}
