import { useEffect, useRef, useState } from 'react';
import { Content } from '../components/Config';
import { IndexedDbValue, useIndexedDb, Note } from '../hooks/indexedDb/indexedDb';
import { Notes } from '../components/Notes';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CreateBlock } from '../components/CreateBlock';
import { EditBlock } from '../components/EditBlock';

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
    const [createBlock, setCreateBlock] = useState<string | null>(null);
    const [editBlock, setEditBlock] = useState<number | null>(null);

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
                    {createBlock && (
                        <Content>
                            <CreateBlock type={createBlock} note={note} />
                        </Content>
                    )}
                    {editBlock !== null && (
                        <Content>
                            <EditBlock index={editBlock} note={note} />
                        </Content>
                    )}
                    {!createBlock && !editBlock && (
                        <Content>
                            <div>
                                <div>
                                    {note.id} <strong>{note.data.title}</strong>
                                </div>
                                <div>
                                    {note.data.content}
                                </div>
                                <div>
                                    {note.data.blocks.map((block, index) => {
                                        return (
                                            <div>
                                                <div>
                                                    {block.type}
                                                </div>
                                                <div>
                                                    {block.content}
                                                </div>
                                                <div onClick={() => {
                                                    setEditBlock(index);
                                                }}>
                                                    Edit block
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </Content>
                    )}
                </Note>
                <SideMenu>
                    <Content>
                        <div>
                            <div onClick={() => {
                                setCreateBlock(null);
                            }}>
                                Back to note
                            </div>
                            <div>
                                Create
                            </div>
                            <div onClick={() => {
                                setCreateBlock('text');
                            }}>
                                Text block
                            </div>
                            <div onClick={() => {
                                setCreateBlock('code');
                            }}>
                                Code block
                            </div>
                        </div>
                    </Content>
                </SideMenu>
            </Container>
        </Notes>
    )

}