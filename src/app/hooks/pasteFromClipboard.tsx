import { ipcRenderer } from 'electron';
import { useEffect, RefObject } from 'react';

type UsePasteFromClipboardProps = {
    onPaste: (valueFromClipboard: string) => void;
}

export function usePasteFromClipboard(props: UsePasteFromClipboardProps) {

    useEffect(() => {
        ipcRenderer.on('paste', (_, value) => {
            console.log('paste event', value);
            props.onPaste(value as unknown as string);
        });
        return () => {
            ipcRenderer.removeAllListeners('paste');
        }
    }, []);

}