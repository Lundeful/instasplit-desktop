import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../Enums/Colors';
import { VscChromeMinimize, VscChromeMaximize, VscChromeRestore, VscChromeClose } from 'react-icons/vsc';
import { MdMonochromePhotos } from 'react-icons/md';
import electron, { ReceiveChannels, SendChannels } from '../Api/Electron';

interface TitlebarProps {
    title?: string;
    isMac?: boolean;
}

const titlebarHeight = '30px';

const TitlebarStyle = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: ${titlebarHeight};
    background-color: ${Colors.blue500};
    -webkit-user-select: none;
    -webkit-app-region: drag;
`;

const AppIconContainer = styled.div`
    justify-self: flex-start;
    width: 35px;
    text-align: center;
`;

const Title = styled.div`
    line-height: ${titlebarHeight};
    white-space: nowrap;
    overflow: hidden;
    flex: 1;
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
`;

const WindowControl = styled.div`
    display: flex;
    -webkit-app-region: no-drag;
    justify-self: flex-end;
`;

const WindowControlItem = styled.div`
    width: 46px;
    text-align: center;
    line-height: ${titlebarHeight};
    :hover {
        background-color: hsla(0, 0%, 100%, 0.1);
    }
`;

const WindowControls = () => {
    const [isMaximized, setIsMaximized] = useState<boolean>(false);

    useEffect(() => {
        electron.receive(ReceiveChannels.isMaximized, (isMax: boolean) => setIsMaximized(isMax));
    }, []);

    return (
        <WindowControl>
            <WindowControlItem onClick={() => electron.send(SendChannels.minimize)}>
                <VscChromeMinimize />
            </WindowControlItem>
            {isMaximized ? (
                <WindowControlItem onClick={() => electron.send(SendChannels.restore)}>
                    <VscChromeRestore />
                </WindowControlItem>
            ) : (
                <WindowControlItem onClick={() => electron.send(SendChannels.maximize)}>
                    <VscChromeMaximize />
                </WindowControlItem>
            )}
            <WindowControlItem onClick={() => electron.send(SendChannels.close)}>
                <VscChromeClose />
            </WindowControlItem>
        </WindowControl>
    );
};

export const Titlebar: FC<TitlebarProps> = ({ title, isMac}: TitlebarProps) => {
    if (isMac) return null;
    return (
        <TitlebarStyle>
            <AppIconContainer>
                <MdMonochromePhotos />
            </AppIconContainer>
            <Title>{title ?? 'Instasplit'}</Title>
            <WindowControls />
        </TitlebarStyle>
    );
};
