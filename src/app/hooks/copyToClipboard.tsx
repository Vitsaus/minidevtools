import { ipcRenderer } from 'electron';
import { RefObject, useEffect } from 'react';

const copyToClipboard = (content: string) => {
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

type UseCopyToClipboardProps = {
    ref: RefObject<HTMLTextAreaElement>;
}

export function useCopyToClipboard(props: UseCopyToClipboardProps) {

    useEffect(() => {
        ipcRenderer.on('copy', () => {
            if (!props.ref.current) return;
            props.ref.current.select();
            copyToClipboard(props.ref.current.value);
        });
        return () => {
            ipcRenderer.removeAllListeners('copy');
        }
    }, []);

}