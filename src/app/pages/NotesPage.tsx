import { useEffect, useRef, useState } from 'react';
import { Utility } from '../components/Utility';
import { Content, Config, Option, OptionTitle, OptionValue } from '../components/Config';
import { IndexedDbValue, Settings, useIndexedDb, Note } from '../hooks/indexedDb/indexedDb';
import { Notes } from '../components/Notes';
import { useHistory } from 'react-router-dom';

export function NotesPage() {

    const {
        isIndexedDbInitialized,
        getAllNotes,
    } = useIndexedDb({
        onReady: () => {
            fetchNotes();
        }
    });

    const history = useHistory();

    const [notes, setNotes] = useState<IndexedDbValue<Note>[]>([]);

    async function fetchNotes() {
        const allNotes = await getAllNotes();
        setNotes(allNotes);
    }

    return (
        <Notes title="List notes">
            <Content>
                {notes.map((note, index) => {
                    return (
                        <div key={`note-${index}`} onClick={() => {
                            history.push(`/note/${note.id}`);
                        }}>
                            <div>
                                {note.id}: <strong>{note.data.title}</strong>
                            </div>
                        </div>
                    );
                })}
            </Content>
        </Notes>
    )

}