import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DB_VERSION, STORE_NAME, SETTING_JSON_SPACING, SETTING_JSON_STRIP_SLASHES } from '../../constants';
import { migration_1 } from './migrations';

export type Setting = {
    name: string;
    value: string;
}

export type Note = {
    title: string;
    content: string;
    blocks: Block[];
}

export type Block = BlockText | BlockCode;

export type BlockText = {
    type: "text",
    content: string;
}

export type BlockCode = {
    type: "code",
    content: string;
}

export type Task = {
    done: boolean;
    due: Date;
    desc: string;
}

export enum IndexedDbTypes {
    Setting = "Setting",
    Task = "Task",
    Note = "Note",
}

export type IndexedDbValue<T> = {
    id?: string;
    type: IndexedDbTypes,
    data: T;
}

export type DbTypes = Task | Setting | Note;

export interface Db<T> extends DBSchema {
    app: {
        value: IndexedDbValue<T>;
        key: string;
    };
}

export type Settings = IndexedDbValue<Setting>[];

export type IndexedDbProps = {
    onReady?: () => void;
}

export function useIndexedDb(props: IndexedDbProps) {

    const dbRef: MutableRefObject<IDBPDatabase<Db<DbTypes>> | null> = useRef<IDBPDatabase<Db<DbTypes>> | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [settings, setSettings] = useState<Settings>([]);

    async function setupDb() {

        let currentDbVersion = parseInt(localStorage.getItem('db') as string);
        
        if (!currentDbVersion) {
            currentDbVersion = 0;
        }

        console.log('handle indexed db migrations', currentDbVersion, DB_VERSION);
        
        const db: IDBPDatabase<Db<DbTypes>> = await openDB<Db<DbTypes>>('App', DB_VERSION, {
          upgrade: async (_db) => {
            console.log('db init', currentDbVersion, _db.version);

            if (currentDbVersion < 1) {
                await migration_1(_db);
            }

            localStorage.setItem('db', DB_VERSION.toString());

            console.log('upgrade done!');
          },
        });

        dbRef.current = db;

        console.log('db initialized', dbRef.current);

        const currentSettings = await getAllSettings();
        setSettings(currentSettings);
    
    }

    async function getData(): Promise<IndexedDbValue<DbTypes>[]> {
        if (!dbRef.current) {
            console.log('db ref is not initialized, what?', dbRef.current, isInitialized);
            return [];
        }
        const data = await dbRef.current?.getAll(STORE_NAME);
        return data;
    }

    async function getAllSettings(): Promise<IndexedDbValue<Setting>[]> {
        const data = await getData();
        const settingsFromData: IndexedDbValue<Setting>[] = data.filter((row) => {
            return row.type === IndexedDbTypes.Setting;
        }) as IndexedDbValue<Setting>[];
        return settingsFromData;
    }

    async function getSettingByName(name: string): Promise<IndexedDbValue<Setting> | null> {
        const settings = await getAllSettings();
        console.log('got all settings', name, settings);
        return settings.reduce((accumulator: IndexedDbValue<Setting> | null, current: IndexedDbValue<Setting> | null) => {
            console.log('setting to reduce', name, accumulator, current);
            if (accumulator && accumulator.data.name === name) return accumulator;
            return current;
        }, null);
    }

    async function getSettingsByNames(names: string[]): Promise<IndexedDbValue<Setting>[]> {
        const settings = await getAllSettings();
        const result = settings.filter((setting: IndexedDbValue<Setting>) => {
            return names.includes(setting.data.name);
        });
        return result;
    }

    async function updateSetting(settingName: string, value: string): Promise<void> {
        if (!dbRef.current) return;
        const setting = await getSettingByName(settingName);
        if (!setting) return;
        setting.data.value = value;
        await dbRef.current.put("app", setting);
        const currentSettings = await getAllSettings();
        setSettings(currentSettings);
    }

    async function getAllNotes(): Promise<IndexedDbValue<Note>[]> {
        const data = await getData();
        console.log('get all notes from data', data);
        const notes: IndexedDbValue<Note>[] = data.filter((row) => {
            return row.type === IndexedDbTypes.Note;
        }) as IndexedDbValue<Note>[];
        return notes;
    }

    async function getNote(id: string): Promise<IndexedDbValue<Note> | null> {
        const note = await getAllNotes();
        return note.reduce((accumulator: IndexedDbValue<Note> | null, current: IndexedDbValue<Note> | null) => {;
            if (accumulator && parseInt(accumulator.id as string) === parseInt(id)) return accumulator;
            return current;
        }, null);
    }

    async function addNote(note: Note): Promise<string | void> {
        if (!dbRef.current) return;
        const tx = dbRef.current.transaction(STORE_NAME, "readwrite");
        const id = await tx.store.add({
            type: IndexedDbTypes.Note,
            data: note,
        });
        await tx.done;
        return id;
    }

    async function addBlock(id: string, block: Block): Promise<boolean> {
        if (!dbRef.current) return false;
        const note = await getNote(id);
        if (!note) return false;
        note.data.blocks.push(block);
        await dbRef.current.put("app", note);
        return true;
    }

    async function editBlock(id: string, index: number, updatedBlock: Block): Promise<boolean> {
        if (!dbRef.current) return false;
        const note = await getNote(id);
        if (!note) return false;
        note.data.blocks = note.data.blocks.map((originalBlock, blockIndex) => {
            if (blockIndex === index) return updatedBlock;
            return originalBlock;
        });
        await dbRef.current.put("app", note);
        return true;
    }

    async function deleteBlock(id: string, index: number): Promise<boolean> {
        if (!dbRef.current) return false;
        const note = await getNote(id);
        if (!note) return false;
        note.data.blocks = note.data.blocks.filter((block, blockIndex) => {
            return blockIndex !== index;
        });
        await dbRef.current.put("app", note);
        return true;
    }

    useEffect(() => {
        if (!isInitialized) return;
        if (props.onReady) props.onReady();
    }, [isInitialized]);

    useEffect(() => {
        if (!isInitialized && settings.length > 0) {
            setIsInitialized(true);
        }
    }, [settings]);

    useEffect(() => {
        setupDb();
    }, []);

    return {
        db: dbRef.current,
        isIndexedDbInitialized: isInitialized,
        settings,
        updateSetting,
        getAllSettings,
        getSettingByName,
        getSettingsByNames,
        getAllNotes,
        getNote,
        addNote,
        addBlock,
        editBlock,
        deleteBlock,
    }
    
}