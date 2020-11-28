import MonacoEditor, {MonacoDiffEditor} from 'react-monaco-editor';

export type TextEditorProps = {
    language: string;
    value: string;
    lineNumbers?: boolean;
    onChange: (value: string) => void;
}

export function TextEditor(props: TextEditorProps) {

    return (
        <MonacoEditor
            width="500"
            height="250"
            language={props.language}
            value={props.value}
            options={{
                minimap: {
                    enabled: false,
                },
                lineNumbers: props.lineNumbers ? "on" : "off",
            }}
            onChange={(value) => {
                props.onChange(value);
            }}
        />
    )
    
}