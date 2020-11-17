import React, { useEffect, useRef, useState } from 'react';
import { Utility } from '../components/Utility';
import { Content, Config, Option, OptionTitle, OptionValue } from '../components/Config';
import mousetrap from 'mousetrap';

function getPrettified(value: string, spacing: number): string {
    try {
        return JSON.stringify(JSON.parse(value), null, spacing);
    } catch(e) {
        console.log('error prettifying json', e);
        return "invalid json";
    }
}

export function JsonPrettifyPage() {

    const [value, setValue] = useState<string>('');
    const [spacing, setSpacing] = useState<number>(4);
    const fieldRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {    
        mousetrap.bind('command+e', (e) => {
            e.preventDefault();
            fieldRef.current?.focus();
        });
        mousetrap.bind('command+s', (e) => {
            e.preventDefault();
            fieldRef.current?.blur();
        });
        return () => {
            mousetrap.unbind('command+e');
        }
    }, [])

    return (
        <Utility title="Json Prettify">
            <Config>
                <Option>
                    <OptionTitle>Spacing:</OptionTitle>
                    <OptionValue onClick={() => { setSpacing(2); }} isSelected={spacing === 2}>2</OptionValue>
                    <OptionValue onClick={() => { setSpacing(4); }} isSelected={spacing === 4}>4</OptionValue>
                </Option>
            </Config>
            <Content>
                <div>
                    <textarea ref={fieldRef} placeholder="paste json here" value={value} onChange={(e) => {
                        setValue(e.target.value);
                    }} />
                </div>
                <div>
                    <textarea value={getPrettified(value, spacing)} onChange={() => {}} />
                </div>
            </Content>
        </Utility>
    )

}