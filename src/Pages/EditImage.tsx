import styled from 'styled-components';
import { EditingTools } from '../Components/EditingTools';
import { useFile } from '../Contexts/FileContext';

export const EditImage = () => {
    const { state } = useFile();

    return (
        <Container>
            <Preview>
                <Image src={`instasplit://${state.filename}`} />
            </Preview>
            <Sidebar>
                <EditingTools />
            </Sidebar>
        </Container>
    );
};

const Preview = styled.div`
    flex-grow: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Image = styled.img`
    max-width: 90%;
    max-height: 80%;
`;

const Sidebar = styled.div`
    height: 100%;
`;

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
`;
