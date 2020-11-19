import { ipcRenderer } from 'electron';
import React, { useRef, useEffect } from 'react';

export type UseEditorProps = {
    onFocus: () => void;
    onBlur: () => void;
}

export function useEditor(props: UseEditorProps) {

    const isEditingRef = useRef<boolean>(false);

    useEffect(() => {
        ipcRenderer.on('edit', () => {
            isEditingRef.current = !isEditingRef.current;
            if (isEditingRef.current) {
                props.onFocus();
            } else {
                props.onBlur();
            }
        });
        return () => {
            ipcRenderer.removeAllListeners('edit');
        }
    }, []);

}