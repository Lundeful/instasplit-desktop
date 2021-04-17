import { VscCheck } from 'react-icons/vsc';
import styled from 'styled-components';
import { Colors } from '../Enums/Colors';

export const SuccessMessage = () => (
    <SuccessMessageContainer>
        <VscCheck color={Colors.green500} />
        <span>Saved</span>
    </SuccessMessageContainer>
);

const SuccessMessageContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: white;
`;
