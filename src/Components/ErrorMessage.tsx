import { VscError } from 'react-icons/vsc';
import styled from 'styled-components';

export const ErrorMessage = () => (
    <ErrorMessageContainer>
        <VscError color={'red'} />
        <span>Something went wrong, try again</span>
    </ErrorMessageContainer>
);

const ErrorMessageContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: white;
`;
