import styled from 'react-emotion';

export default styled.div`
    padding: 0.5em;
    margin: 1em 0;

    background-color: ${props => props.error ? '#faa' : '#fff'};
    border: 0.35em solid ${props => props.error ? '#e66' : '#ccc'};
    color: ${props => props.error ? '#a44' : '#333'};
`;
