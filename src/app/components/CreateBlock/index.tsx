import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IndexedDbValue, Note, useIndexedDb } from '../../hooks/indexedDb/indexedDb';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';

const Editor = styled.div`
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
                <Editor>
                    <MonacoEditor
                        width="500"
                        height="250"
                        language="javascript"
                        value={blockContent}
                        options={{
                            minimap: {
                                enabled: false,
                            }
                        }}
                        onChange={(value) => {
                            setBlockContent(value);
                        }}
                    />
                </Editor>               
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