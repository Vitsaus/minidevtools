import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IndexedDbValue, Note, useIndexedDb } from '../../hooks/indexedDb/indexedDb';
import { TextEditor } from '../TextEditor';

export type EditBlockProps = {
    index: number;
    note: IndexedDbValue<Note>; 
}

export function EditBlock(props: EditBlockProps) {

    const {
        isIndexedDbInitialized,
        editBlock,
    } = useIndexedDb({
        onReady: () => {
 
        }
    });

    const history = useHistory();
    const block = props.note.data.blocks[props.index];
    const [content, setContent] = useState<string>(block.content);

    if (!block) {
        return (
            <div>
                Block not found!
            </div>
        )
    }

    return (
        <div>
            <div>
                Edit {block.type} block for note: {props.note.id}
            </div>
            <div>
                <TextEditor
                    value={content}
                    language="plaintext"
                    onChange={(value) => {
                        setContent(value);
                    }}
                />
            </div>
            <div onClick={async () => {
                const result = await editBlock(props.note.id as string, props.index, {
                    ...block,
                    content,
                });
                console.log('got block edit result', result);
            }}>
                Save block
            </div>
        </div>
    );

}