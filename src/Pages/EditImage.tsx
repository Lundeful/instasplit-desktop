import { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '../Components/Buttons';
import { useFile } from '../Contexts/FileContext';
import { Colors } from '../Enums/Colors';
import { Paths } from '../Enums/Paths';
import electron, { ReceiveChannels, SendChannels } from '../Api/Electron';
import { ErrorMessage } from '../Components/ErrorMessage';
import { SuccessMessage } from '../Components/SuccessMessage';

export const EditImage = () => {
    const { state } = useFile();
    const history = useHistory();

    if (!state.path) history.push(Paths.home);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [pixelsCrop, setPixelsCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
    const [splitAmount, setSplitAmount] = useState(2);
    const [aspectWidth, setAspectWidth] = useState<number | undefined>(4);
    const [aspectHeight, setAspectHeight] = useState(5);
    const [aspectRatio, setAspectRatio] = useState(4 / 5);

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        electron.receive(ReceiveChannels.success, () => setSuccess(true));
        electron.receive(ReceiveChannels.error, () => setError(true));
    }, []);

    useEffect(() => {
        if (!aspectHeight || !aspectWidth) {
            setAspectRatio(4 / 5);
            return;
        }
        setAspectRatio((splitAmount * aspectWidth) / aspectHeight);
    }, [splitAmount, aspectHeight, aspectWidth]);

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
                            min='1'
                            max='10'
                            onChange={e => setSplitAmount(parseInt(e.target.value))}
                        />
                        {splitAmount === 1 && <p>Split into 1...Really??</p>}
                    </SplitAmountContainer>
                    <AspectRatioContainer>
                        <AspectRatioText>Aspect ratio</AspectRatioText>
                        <AspectInputGroup>
                            <AspectLabel>Width</AspectLabel>
                            <AspectRatioInput
                                title='Width'
                                aria-label='Aspect ratio width'
                                type='number'
                                min='1'
                                max='10000'
                                defaultValue='4'
                                value={aspectWidth}
                                onChange={e => setAspectWidth(parseInt(e.target.value))}
                                onBlur={e => !e.target.value && setAspectWidth(4)}
                            />
                        </AspectInputGroup>
                        <AspectInputGroup>
                            <AspectLabel>Height</AspectLabel>
                            <AspectRatioInput
                                title='Height'
                                aria-label='Aspect ratio height'
                                type='number'
                                min='1'
                                max='10000'
                                defaultValue='5'
                                value={aspectHeight}
                                onChange={e => setAspectHeight(parseInt(e.target.value))}
                                onBlur={e => !e.target.value && setAspectHeight(5)}
                            />
                        </AspectInputGroup>
                    </AspectRatioContainer>
                    <SubmitContainer>
                        <PrimaryButton title='Split Image' onClick={onSubmit} />
                    </SubmitContainer>
                    {success && !error && <SuccessMessage />}
                    {error && <ErrorMessage />}
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
    margin-bottom: 10px;
    font-size: 20px;
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

const SelectNewImageContainer = styled.div`
    margin: 10px 0;
`;

const AspectRatioContainer = styled.div`
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
    border-radius: 5px;
    width: 100%;
`;

const AspectRatioText = styled.div`
    margin-bottom: 5px;
    font-size: 20px;
`;

const AspectInputGroup = styled.div`
    display: flex;
    justify-content: space-between;
`;

const AspectLabel = styled.label``;

const AspectRatioInput = styled.input`
    width: 70px;
    background-color: transparent;
    border: none;
    text-align: center;
    font-size: 16px;
    color: white;
    border-bottom: 2px solid white;
    outline: none;
`;
