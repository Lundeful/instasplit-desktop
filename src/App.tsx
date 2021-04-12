import React from 'react';
import styled from 'styled-components';
import { HashRouter, Route } from 'react-router-dom';
import { Titlebar } from './Components/Titlebar';
import { Colors } from './Enums/Colors';
import { SelectFile } from './Pages/SelectFile';
import { EditImage } from './Pages/EditImage';
import { Paths } from './Enums/Paths';
import { FileProvider } from './Contexts/FileContext';

const isMac = window.navigator.platform.toLowerCase().includes('mac');

function App() {
    return (
        <AppContainer>
            <Titlebar isMac={isMac} />
            <HashRouter>
                <FileProvider>
                    <Route path={Paths.home} exact component={SelectFile} />
                    <Route path={Paths.editImage} component={EditImage} />
                </FileProvider>
            </HashRouter>
        </AppContainer>
    );
}

const AppContainer = styled.div`
    width: 100%;
    height: 100%;
    margin: auto;
    overflow: hidden;
    background-color: ${Colors.blue300};
    user-select: none;
    position: absolute;
`;

export default App;
