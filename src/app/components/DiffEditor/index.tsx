import {MonacoDiffEditor} from 'react-monaco-editor';

export type DiffEditorProps = {
    a: string;
    b: string;
    language: string;
}

export function DiffEditor(props: DiffEditorProps) {

    return (
        <MonacoDiffEditor
            width="500"
            height="250"
            language={props.language}
            original={props.a}
            value={props.b}
            options={{
                originalEditable: true,
                readOnly: false,
                ignoreTrimWhitespace: false,
            }}
        />
    )
    
}