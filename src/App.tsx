import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from './Components/Buttons';
import { Colors } from './Enums/Colors';
import electron from './Interfaces/Electron';

function App() {
    const [filePath, setFilePath] = useState<string>('');

    const handleSelectFile = () => {
        electron.send('select-image');
    };

    useEffect(() => {
        electron.receive('filepath-selected', (path: any) => setFilePath(path));
    }, []);

    return (
        <AppContainer>
            <LandingPage>
                <Header>Welcome to Instasplit</Header>
                <Introduction>
                    Split one image into multiple images for that cool swipe-effect on instagram. <br /> <br /> This app
                    is in Beta, beware of bugs.
                </Introduction>
                <SelectFile>
                    <PrimaryButton title='Select File' onClick={handleSelectFile} />
                </SelectFile>
                {filePath && (
                    <SplitContainer>
                        <FilePath>{filePath}</FilePath>
                        <SecondaryButton title='Split Image' onClick={() => electron.send('split-image')} />{' '}
                    </SplitContainer>
                )}
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

const SelectFile = styled.div`
    margin-top: 60px;
    *:nth-child(n) {
        display: block;
        margin: 20px auto;
    }
`;

const SplitContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    *:nth-child(n) {
        margin-top: 20px;
    }
`;

const FilePath = styled.div`
    font-size: 18px;
    text-align: center;
    word-wrap: wrap;
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
`;

export default App;
