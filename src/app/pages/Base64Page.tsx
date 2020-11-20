import { useRef, useState } from 'react';
import { Utility } from '../components/Utility';
import { Content } from '../components/Config';
import { useEditor } from '../hooks/editor';
import { usePasteFromClipboard } from '../hooks/pasteFromClipboard';
import { useCopyToClipboard } from '../hooks/copyToClipboard';

function getDecoded(value: string): string {
    try {
        return atob(value);
    } catch(e) {
        console.log('error decoding string', e);
        return "invalid base64";
    }
}

function getEncoded(value: string): string {
    try {
        return btoa(value);
    } catch(e) {
        console.log('error encoding string', e);
        return "invalid base64";
    }
}

export function Base64Page() {

    const [value, setValue] = useState<string>('');
    const fieldRef = useRef<HTMLInputElement | null>(null);
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

    return (
        <Utility title="Base64">
            <Content>
                <div>
                    <input type="text" ref={fieldRef} placeholder="paste here" value={value} onChange={(e) => {
                        setValue(e.target.value);
                    }} />
                </div>
                <div>
                    <textarea ref={resultRef} value={getEncoded(value)} onChange={() => {}} />
                </div>
                <div>
                    <textarea ref={resultRef} value={getDecoded(value)} onChange={() => {}} />
                </div>
            </Content>
        </Utility>
    )

}