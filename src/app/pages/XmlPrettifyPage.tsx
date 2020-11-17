import React, { useState } from 'react';
import format from 'xml-formatter';
import { Content } from '../components/Config';
import { Utility } from '../components/Utility';

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

    return (
        <Utility title="XML prettify">
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