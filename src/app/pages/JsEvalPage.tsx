import { useEffect, useRef, useState } from 'react';
import { Utility } from '../components/Utility';
import { Content } from '../components/Config';
import { useEditor } from '../hooks/editor';
import { usePasteFromClipboard } from '../hooks/pasteFromClipboard';
import { useCopyToClipboard } from '../hooks/copyToClipboard';
import { ipcRenderer } from 'electron';

export function JSEvalPage() {

    const [value, setValue] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const fieldRef = useRef<HTMLTextAreaElement>(null);
    const resultRef = useRef<HTMLTextAreaElement>(null);

    useCopyToClipboard({
        ref: resultRef
    })

    useEditor({
        onFocus: () => {
            fieldRef.current?.focus();
        },
        onBlur: () => {
            fieldRef.current?.blur();
        },
    });

    usePasteFromClipboard({
        onPaste: (clipboardValue) => {
            setValue(clipboardValue);
        }
    });

    useEffect(() => {
        ipcRenderer.invoke('jsEval', value).then((result) => {
            console.log('got result from eval', result);
            setResult(result);
        });
    }, [value]);

    return (
        <Utility title="JS Eval">
            <Content>
                <div>
                <textarea ref={fieldRef} placeholder="write javascript here" value={value} onChange={(e) => {
                    setValue(e.target.value);
                }} />
                </div>
                <div>
                    <textarea ref={resultRef} placeholder="result" value={result} onChange={() => {}} />
                </div>
            </Content>
        </Utility>
    )

}