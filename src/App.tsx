import React from 'react';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from './Components/Buttons';
import { Colors } from './Enums/Colors';
import electron from './Interfaces/Electron';



function App() {
    return (
        <AppContainer>
            <LandingPage>
                <Header>Welcome to Instasplit</Header>
                <Introduction>Split one image into multiple images for that cool swipe-effect on instagram. <br /> <br /> This app is in Beta, beware of bugs.</Introduction>
                <Buttons>
                    <PrimaryButton title='Select File' onClick={() => electron.send('select-file')} />
                    <SecondaryButton title='Exit' onClick={() => electron.send('close-app')} />
                </Buttons>
            </LandingPage>
        </AppContainer>
    );
}


const AppContainer = styled.div`
    max-width: 95%;
    margin: auto;
    overflow: hidden;
    background-color: ${Colors.main};
    user-select: none;
`;

const Introduction = styled.div`
    margin: 20px auto;
    text-align: center;
    margin: auto;
    font-size: 18px;
`;

const LandingPage = styled.div`
    width: 95%;
    max-width: 800px;
    margin: auto;

`;

const Header = styled.h1`
    text-align: center;
    display: block;
`;

const Buttons = styled.div`
    margin-top: 120px;
    *:nth-child(n) {
        display: block;
        margin: 20px auto;
    }
`;

export default App;
