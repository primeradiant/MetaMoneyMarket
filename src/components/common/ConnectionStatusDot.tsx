import styled from 'styled-components';

interface StatusProps {
    status: boolean;
}

export const ConnectionStatusDot = styled.div<StatusProps>`
    background-color: ${props => (props.status ? '#55BC65' : '#ccc')};
    border-radius: 50%;
    height: 10px;
    width: 10px;
`;
