import React, { useState } from 'react';

function getPrettified(value: string): string {
    try {
        return JSON.stringify(JSON.parse(value), null, 4);
    } catch(e) {
        console.log('error prettifying json', e);
        return "invalid json";
    }
}

export function JsonPrettifyPage() {

    const [value, setValue] = useState<string>('');

    return (
        <div>
            <div>
                <textarea placeholder="paste json here" value={value} onChange={(e) => {
                    setValue(e.target.value);
                }} />
            </div>
            <div>
                <textarea value={getPrettified(value)} onChange={() => {}} />
            </div>
        </div>
    )

}