import React, { useEffect } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import electron, { ReceiveChannels, SendChannels } from "../Api/Electron";
import { PrimaryButton } from "../Components/Buttons";
import { ActionTypes, useFile } from "../Contexts/FileContext";
import { Paths } from "../Enums/Paths";

export const SelectFile = () => {
    const history = useHistory();
    const { dispatch } = useFile();

    const handleSelectFile = () => {
        electron.send(SendChannels.openSelectFileDialog);
    };

    useEffect(
        () =>
            electron.receive(ReceiveChannels.fileSelected, (path: string) => {
                dispatch({ type: ActionTypes.setfilename, value: `instasplit://${path}` });
                history.push(Paths.editImage);
            }),
        [dispatch, history]
    );

    return (
        <Container>
            <ButtonContainer>
                <PrimaryButton title='Open image' onClick={handleSelectFile} />
            </ButtonContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const ButtonContainer = styled.div`
    width: 200px;
`;
