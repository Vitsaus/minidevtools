import { useEffect, useRef, useState } from 'react';
import { Utility } from '../components/Utility';
import { Content, Config, Option, OptionTitle, OptionValue } from '../components/Config';
import { ipcRenderer } from 'electron';
import { useEditor } from '../hooks/editor';
import { usePasteFromClipboard } from '../hooks/pasteFromClipboard';
import { useCopyToClipboard } from '../hooks/copyToClipboard';
import { SETTING_JSON_SPACING, SETTING_JSON_STRIP_SLASHES } from '../constants';
import { Settings } from '../hooks/indexedDb/indexedDb';

type Props = {
    settings: Settings;
    updateSetting: (key: string, name: string, value: string) => void;
}

export function TasksPage(props: Props) {

    const {
        settings
    } = props;

    return (
        <Utility title="Tasks">
            <Content>
                Tasks page? lol.
            </Content>
        </Utility>
    )

}