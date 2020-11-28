import { useEffect, useRef, useState } from 'react';
import { Utility } from '../components/Utility';
import { Content, Config, Option, OptionTitle, OptionValue } from '../components/Config';
import { useEditor } from '../hooks/editor';
import { usePasteFromClipboard } from '../hooks/pasteFromClipboard';
import { useCopyToClipboard } from '../hooks/copyToClipboard';
import { SETTING_JSON_SPACING, SETTING_JSON_STRIP_SLASHES } from '../constants';
import { IndexedDbValue, Setting, Settings, useIndexedDb } from '../hooks/indexedDb/indexedDb';

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

export function JsonPrettifyPage() {

    const [value, setValue] = useState<string>('');
    const [isStripSlashesSelectedSetting, setIsStripSlashesSelectedSetting] = useState<IndexedDbValue<Setting> | null>(null);
    const [spacingSetting, setSpacingSetting] = useState<IndexedDbValue<Setting> | null>(null);
    const fieldRef = useRef<HTMLTextAreaElement | null>(null);
    const resultRef = useRef<HTMLTextAreaElement>(null);
    const {
        isIndexedDbInitialized,
        settings,
        updateSetting,
        getSettingByName
    } = useIndexedDb({
        onReady: () => {
            getPageSettings();
        }
    });

    async function getPageSettings() {
        const settingSpacing = await getSettingByName(SETTING_JSON_SPACING);
        const settingStripSlashes = await getSettingByName(SETTING_JSON_STRIP_SLASHES);
        setSpacingSetting(settingSpacing);
        setIsStripSlashesSelectedSetting(settingStripSlashes);
    }

    useEffect(() => {
        getPageSettings();
    }, [settings]);

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

    if (!isIndexedDbInitialized) {
        return (
            <div>
                Initializing
            </div>
        )
    }

    return (
        <Utility title="Json Prettify">
            <Config>
                <Option>
                    <OptionTitle>Spacing:</OptionTitle>
                    <OptionValue onClick={() => {      
                        console.log('update spacing, 2');
                        updateSetting(SETTING_JSON_SPACING, "2");
                    }} isSelected={(spacingSetting && spacingSetting.data.value === "2") ? true : false}>2</OptionValue>
                    <OptionValue onClick={() => {
                        console.log('update spacing, 4');
                        updateSetting(SETTING_JSON_SPACING, "4");
                    }} isSelected={(spacingSetting && spacingSetting.data.value === "4") ? true : false}>4</OptionValue>
                </Option>
                <Option>
                    <OptionTitle>Strip slashes:</OptionTitle>
                    <OptionValue onClick={() => {
                        updateSetting(SETTING_JSON_STRIP_SLASHES, isStripSlashesSelectedSetting?.data.value === "Yes" ? "No" : "Yes");
                    }} isSelected={(isStripSlashesSelectedSetting?.data.value === "Yes") ? true : false}>{isStripSlashesSelectedSetting?.data.value === "Yes"  ? "Yes" : "No"}</OptionValue>
                </Option>
            </Config>
            <Content>
                <div>
                    <textarea ref={fieldRef} placeholder="paste json here" value={value} onChange={(e) => {
                        setValue(e.target.value);
                    }} />
                </div>
                <div>
                    <textarea
                        ref={resultRef}
                        value={getPrettified(
                            value,
                            parseInt(spacingSetting?.data.value as string),
                            isStripSlashesSelectedSetting?.data.value === "Yes"  ? true : false
                        )}
                        onChange={() => {}}
                    />
                </div>
            </Content>
        </Utility>
    )

}