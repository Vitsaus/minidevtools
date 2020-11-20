import { useEffect, useRef, useState } from 'react';
import format from 'xml-formatter';
import { Utility } from '../components/Utility';
import { Content, Config, Option, OptionTitle, OptionValue } from '../components/Config';
import {ipcRenderer} from 'electron';
import { useCopyToClipboard } from '../hooks/copyToClipboard';
import { useEditor } from '../hooks/editor';
import { usePasteFromClipboard } from '../hooks/pasteFromClipboard';

function getPrettified(value: string): string {
    try {
        return format(value);
    } catch(e) {
        console.log('error prettifying xml', e);
        return "invalid xml";
    }
}

export function XmlPrettifyPage() {

    const [value, setValue] = useState<string>('');
    const [isValid, setValid] = useState<boolean>(false);
    const fieldRef = useRef<HTMLTextAreaElement>(null);
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
            setValue(clipboardValue);
        }
    });

    useEffect(() => {
        ipcRenderer.invoke('validateXML', value).then((result) => {
            setValid(result);
        });
    }, [value]);

    return (
        <Utility title="XML prettify">
            <Config>
                <Option>
                    <OptionTitle onClick={() => {}}>
                        Is Valid:
                    </OptionTitle>
                    <OptionValue onClick={() => {}} isSelected={false}>{isValid ? "Yes" : "No"}</OptionValue>
                </Option>
            </Config>            
            <Content>
                <div>
                    <textarea ref={fieldRef} placeholder="paste xml here" value={value} onChange={(e) => {
                        setValue(e.target.value);
                    }} />
                </div>
                <div>
                    <textarea ref={resultRef} value={getPrettified(value)} onChange={() => {}} />
                </div>
            </Content>
        </Utility>
    )

}