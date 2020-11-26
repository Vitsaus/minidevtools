import { useEffect, useRef, useState } from 'react';
import { Utility } from '../components/Utility';
import { Content, Config, Option, OptionTitle, OptionValue } from '../components/Config';
import mousetrap from 'mousetrap';
import { ipcRenderer } from 'electron';
import { useEditor } from '../hooks/editor';
import { usePasteFromClipboard } from '../hooks/pasteFromClipboard';
import { useCopyToClipboard } from '../hooks/copyToClipboard';
import { SETTING_JSON_SPACING, SETTING_JSON_STRIP_SLASHES } from '../constants';
import { Settings } from '../hooks/indexedDb/indexedDb';
import { Notes } from '../components/Notes';

type Props = {
    settings: Settings;
    updateSetting: (key: string, name: string, value: string) => void;
}

export function NotesPage(props: Props) {

    const {
        settings
    } = props;

    return (
        <Notes title="List notes">
            <Content>
                Notes page? lol.
            </Content>
        </Notes>
    )

}