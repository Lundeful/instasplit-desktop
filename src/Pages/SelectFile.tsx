import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import electron, { ReceiveChannels, SendChannels } from '../Api/Electron';
import { PrimaryButton } from '../Components/Buttons';
import { Paths } from '../Enums/Paths';

export const SelectFile = () => {
    const history = useHistory();

    const handleSelectFile = () => {
        electron.send(SendChannels.openSelectFileDialog);
    };

    useEffect(
        () =>
            electron.receive(ReceiveChannels.fileSelected, (path: any) => {                
                history.push(Paths.editImage);
            }),
        [history]
    );

    return (
        <Container>
            <SelectFileText>Select Image</SelectFileText>
            <PrimaryButton title='Open' onClick={handleSelectFile} />
        </Container>
    );
};

const Container = styled.div`
    margin-top: 60px;
    *:nth-child(n) {
        display: block;
        margin: 20px auto;
    }
`;

const SelectFileText = styled.div`
    text-align: center;
    font-weight: 600;
`;
