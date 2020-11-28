import { useEffect, useRef, useState } from 'react';
import { Utility } from '../components/Utility';
import { Content, Config, Option, OptionTitle, OptionValue } from '../components/Config';
import { IndexedDbValue, Settings, useIndexedDb, Note } from '../hooks/indexedDb/indexedDb';
import { Notes } from '../components/Notes';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;

const Note = styled.div`
    width: 80%;
`;

const SideMenu = styled.div`
    width: 20%;
`;

export function NotePage() {

    const {
        id
    } = useParams<{
        id: string;
    }>();

    console.log('got note id', id);

    const {
        isIndexedDbInitialized,
        addBlock,
        getNote,
    } = useIndexedDb({
        onReady: () => {
            fetchNote();
        }
    });

    const [note, setNote] = useState<IndexedDbValue<Note> | null>(null);

    async function fetchNote() {
        const data = await getNote(id);
        console.log('got note for id', id, data);
        setNote(data);
    }

    if (!isIndexedDbInitialized) {
        <div>
            Initializing
        </div>
    }

    if (!note) {
        return (
            <div>
                Note not found
            </div>
        )
    }

    return (
        <Notes title="View note">
            <Container>
                <Note>
                    <Content>
                        <div>
                            <div>
                                {note.id} <strong>{note.data.title}</strong>
                            </div>
                            <div>
                                {note.data.content}
                            </div>
                        </div>
                    </Content>
                </Note>
                <SideMenu>
                    <Content>
                        <div>
                            <div>
                                Create
                            </div>
                            <div>
                                Text block
                            </div>
                            <div>
                                Code block
                            </div>
                        </div>
                    </Content>
                </SideMenu>
            </Container>
        </Notes>
    )

}