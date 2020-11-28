import { useEffect, useRef, useState } from 'react';
import { Utility } from '../components/Utility';
import { Content, Config, Option, OptionTitle, OptionValue } from '../components/Config';
import { IndexedDbValue, Note, Settings, useIndexedDb } from '../hooks/indexedDb/indexedDb';
import { Notes } from '../components/Notes';
import { useHistory } from 'react-router-dom';


export function CreateNotePage() {

    const history = useHistory();
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const {
        isIndexedDbInitialized,
        addNote,
    } = useIndexedDb({});

    return (
        <Notes title="Create note">
            <Content>
                <div>
                    <div>Title</div>
                    <div>
                        <input type="text" value={title} onChange={(e) => {
                            setTitle(e.target.value);
                        }} />
                    </div>
                    <div>Content</div>
                    <div>
                        <textarea value={content} onChange={(e) => {
                            setContent(e.target.value);
                        }} />
                    </div>
                    <div>
                        <input type="submit" onClick={async () => {
                            const note = {
                                title,
                                content,
                                blocks: [],
                            };
                            const id = await addNote(note);
                            history.push(`/note/${id}`);
                        }} />
                    </div>
                </div>
            </Content>
        </Notes>
    )

}