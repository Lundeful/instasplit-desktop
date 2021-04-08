import React, { useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../Enums/Colors';

export const EditingTools = () => {
    return (
        <Container>
            <Title>Settings</Title>
            <SelectSplitAmount />
        </Container>
    );
};

const Container = styled.div`
    width: 200px;
	height: 100%;
	display: flex;
	flex-direction: column;
    overflow-y: hidden;
    background-color: ${Colors.blue400};
	border-left: 2px solid rgba(0,0,0,0.2);
`;

const Title = styled.div`
    margin: 20px 0;
    text-align: center;
    font-size: 32px;
	padding-bottom: 20px;
`;

const SplitAmountContainer = styled.div`
	text-align: center;
`;

const SplitAmount = styled.div`
	text-align: center;
	margin: 5px;
`;

const SplitAmountInput = styled.input`
    background-color: ${Colors.green500};
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px; 
        height: 25px; /* Slider handle height */
        background: #4caf50; /* Green background */
        color: red;
        background-color: red;
        border: 2px solid red;
        cursor: pointer; /* Cursor on hover */
    }
`;

const SelectSplitAmount = () => {
    const [splitAmount, setSplitAmount] = useState<string>('2');

    return (
        <SplitAmountContainer>
			<SplitAmount>Split into: {splitAmount}</SplitAmount>
            <SplitAmountInput
                defaultValue={splitAmount}
                type='range'
                min='2'
                max='10'
                onChange={(e) => setSplitAmount(e.target.value)}
            />
        </SplitAmountContainer>
    );
};
