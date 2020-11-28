import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IndexedDbValue, Note, useIndexedDb } from '../../hooks/indexedDb/indexedDb';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';
import { TextEditor } from '../TextEditor';

const EditorContainer = styled.div`
    width: 500px;
    height: 250px;
    border: px solid orange;
`;

export type CreateBlockProps = {
    type: string;
    note: IndexedDbValue<Note>; 
}

export function CreateBlock(props: CreateBlockProps) {

    const {
        isIndexedDbInitialized,
        addBlock,
    } = useIndexedDb({
        onReady: () => {
 
        }
    });

    const history = useHistory();
    const [blockContent, setBlockContent] = useState<string>("");

    return (
        <div>
            <div>
                Create {props.type} block for note: {props.note.id}
            </div>
            <div>
                <div>
                    Editor:
                </div>
                <EditorContainer>
                    <TextEditor
                        language=""
                        onChange={(value) => {
                            setBlockContent(value);
                        }}
                        value={blockContent}
                    />
                </EditorContainer>               
            </div>
            <div onClick={async () => {
                const result = await addBlock(props.note.id as string, {
                    type: "text",
                    content: blockContent,
                });
                console.log('got block add result', result);
                history.push(`/note/${props.note.id}`);
            }}>
                Add block
            </div>
        </div>
    );

}