import { useEffect, useRef, useState } from 'react';
import { Utility } from '../components/Utility';
import { Content, Config, Option, OptionTitle, OptionValue } from '../components/Config';
import mousetrap from 'mousetrap';
import { ipcRenderer } from 'electron';
import { useEditor } from '../hooks/editor';
import { usePasteFromClipboard } from '../hooks/pasteFromClipboard';
import { useCopyToClipboard } from '../hooks/copyToClipboard';
import { SETTING_JSON_SPACING, SETTING_JSON_STRIP_SLASHES } from '../constants';
import { Settings } from 'app/hooks/indexedDb/indexedDb';

function getPrettified(value: string, spacing: number, stripSlashes: boolean): string {
    try {
        const result = JSON.stringify(JSON.parse(value), null, spacing);
        if (stripSlashes) {
            return result.replace(/\\/g, "");
        }
        return result;
    } catch(e) {
        console.log('error prettifying json', e);
        return "invalid json";
    }
}

type Props = {
    settings: Settings;
    updateSetting: (key: string, name: string, value: string) => void;
}

export function JsonPrettifyPage(props: Props) {

    console.log('got settings for prettify', props.settings);

    const [value, setValue] = useState<string>('');
    const fieldRef = useRef<HTMLTextAreaElement | null>(null);
    const resultRef = useRef<HTMLTextAreaElement>(null);

    const {
        settings
    } = props;

    const isStripSlashesSelected: boolean = settings[SETTING_JSON_STRIP_SLASHES].value === "Yes";
    const spacing: number = parseInt(settings[SETTING_JSON_SPACING].value);

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
        <Utility title="Json Prettify">
            <Config>
                <Option>
                    <OptionTitle>Spacing:</OptionTitle>
                    <OptionValue onClick={() => {                        
                        props.updateSetting(settings[SETTING_JSON_SPACING].id as string, settings[SETTING_JSON_SPACING].name, "2");
                    }} isSelected={spacing === 2}>2</OptionValue>
                    <OptionValue onClick={() => {
                        props.updateSetting(settings[SETTING_JSON_SPACING].id as string, settings[SETTING_JSON_SPACING].name, "4");
                    }} isSelected={spacing === 4}>4</OptionValue>
                </Option>
                <Option>
                    <OptionTitle>Strip slashes:</OptionTitle>
                    <OptionValue onClick={() => {
                        const newValue: string = isStripSlashesSelected ? "No" : "Yes";
                        props.updateSetting(settings[SETTING_JSON_STRIP_SLASHES].id as string, settings[SETTING_JSON_STRIP_SLASHES].name, newValue);
                    }} isSelected={isStripSlashesSelected}>{isStripSlashesSelected ? "Yes" : "No"}</OptionValue>
                </Option>
            </Config>
            <Content>
                <div>
                    <textarea ref={fieldRef} placeholder="paste json here" value={value} onChange={(e) => {
                        setValue(e.target.value);
                    }} />
                </div>
                <div>
                    <textarea ref={resultRef} value={getPrettified(value, spacing, isStripSlashesSelected)} onChange={() => {}} />
                </div>
            </Content>
        </Utility>
    )

}