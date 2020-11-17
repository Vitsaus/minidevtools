import React, { useEffect, useState } from 'react';
import format from 'xml-formatter';
import { Utility } from '../components/Utility';
import { Content, Config, Option, OptionTitle, OptionValue } from '../components/Config';
import {ipcRenderer} from 'electron';

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
                    <textarea placeholder="paste xml here" value={value} onChange={(e) => {
                        setValue(e.target.value);
                    }} />
                </div>
                <div>
                    <textarea value={getPrettified(value)} onChange={() => {}} />
                </div>
            </Content>
        </Utility>
    )

}