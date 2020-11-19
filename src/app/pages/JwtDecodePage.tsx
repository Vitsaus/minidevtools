import React, { useRef, useState } from 'react';
import jwt from 'jwt-decode';
import { Utility } from '../components/Utility';
import { Content } from '../components/Config';
import { useEditor } from '../hooks/editor';
import { useCopyToClipboard } from '../hooks/copyToClipboard';
import { usePasteFromClipboard } from '../hooks/pasteFromClipboard';

function decodeToken(token: string): string {
    try {
        return JSON.stringify(jwt(token), null, 4);
    } catch(e) {
        console.log('error parsing token', token);
        return "invalid token";
    }
}

export function JwtDecodePage() {

    const [token, setToken] = useState<string>('');
    const fieldRef = useRef<HTMLInputElement | null>(null);
    const resultRef = useRef<HTMLTextAreaElement>(null);

    useCopyToClipboard({
        ref: resultRef
    });

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
            setToken(clipboardValue);
        }
    });

    return (
        <Utility title="JWT decode">
            <Content>
                <div>
                    <input type="text" ref={fieldRef} placeholder="paste token here" value={token} onChange={(e) => {
                        setToken(e.target.value);
                    }} />
                </div>
                <div>
                    <textarea ref={resultRef} value={decodeToken(token)} onChange={() => {}} />
                </div>
            </Content>
        </Utility>
    )

}