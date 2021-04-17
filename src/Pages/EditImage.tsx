import { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '../Components/Buttons';
import { useFile } from '../Contexts/FileContext';
import { Colors } from '../Enums/Colors';
import { Paths } from '../Enums/Paths';
import { VscCheck, VscError } from 'react-icons/vsc';
import electron, { ReceiveChannels, SendChannels } from '../Api/Electron';

export const EditImage = () => {
    const { state } = useFile();
    const history = useHistory();

    if (!state.path) history.push(Paths.home);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [pixelsCrop, setPixelsCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
    const [splitAmount, setSplitAmount] = useState(2);

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const img = new Image();
    img.src = state.path;
    const aspectRatio = (splitAmount * img.width) / img.height;

    useEffect(() => {
        electron.receive(ReceiveChannels.success, () => setSuccess(true));
        electron.receive(ReceiveChannels.error, () => setError(true));
    }, []);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setPixelsCrop(croppedAreaPixels);
    }, []);

    const onSubmit = () => {
        setError(false);
        setSuccess(false);
        const cropInfo = { ...pixelsCrop, splitAmount: splitAmount };
        electron.send(SendChannels.splitImage, cropInfo);
    };

    return (
        <Container>
            <CropArea>
                <Cropper
                    image={state.path}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    minZoom={1}
                    aspect={aspectRatio}
                    showGrid={false}
                />
            </CropArea>
            <Sidebar>
                <Tools>
                    <SelectNewImageContainer>
                        <SecondaryButton title='Back' onClick={() => history.push(Paths.home)} />
                    </SelectNewImageContainer>
                    <Title>Settings</Title>
                    <SplitAmountContainer>
                        <SplitAmountText>
                            <span>Split into:</span>
                            <span>{splitAmount}</span>
                        </SplitAmountText>
                        <SplitAmountInput
                            defaultValue={splitAmount}
                            type='range'
                            min='2'
                            max='10'
                            onChange={(e) => setSplitAmount(parseInt(e.target.value))}
                        />
                    </SplitAmountContainer>
                    <SubmitContainer>
                        <PrimaryButton title='Split Image' onClick={onSubmit} />
                    </SubmitContainer>
                    {success && !error && (
                        <SuccessMessage>
                            <VscCheck color={Colors.green500} />
                            <span>Saved</span>
                        </SuccessMessage>
                    )}
                    {error && (
                        <ErrorMessage>
                            <VscError color={'red'} />
                            <span>Something went wrong, try again</span>
                        </ErrorMessage>
                    )}
                </Tools>
            </Sidebar>
        </Container>
    );
};

const CropArea = styled.div`
    flex-grow: 1;
    position: relative;
`;

const Sidebar = styled.div`
    height: 100%;
`;

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
`;

const Tools = styled.div`
    padding: 0 10px;
    width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    background-color: ${Colors.blue400};
    border-left: 2px solid rgba(0, 0, 0, 0.2);
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

const SplitAmountText = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 5px;
`;

const SplitAmountInput = styled.input`
    width: 100%;
    background-color: ${Colors.green500};
`;

const SubmitContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 20px;
`;

const SuccessMessage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: white;
`;

const ErrorMessage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: white;
`;

const SelectNewImageContainer = styled.div`
    margin: 10px 0;
`;
