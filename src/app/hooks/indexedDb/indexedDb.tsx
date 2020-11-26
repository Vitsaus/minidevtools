import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DB_VERSION, SETTINGS_STORE_NAME, SETTING_JSON_SPACING, SETTING_JSON_STRIP_SLASHES } from '../../constants';
import { migration_1 } from './migrations';

export type Setting = {
    id?: string;
    name: string;
    value: string;
}

export type Note = {
    id?: string;
    title: string;
    content: string;
}

export type Task = {
    id?: string;
    done: boolean;
    due: Date;
    desc: string;
}

export enum IndexedDbTypes {
    Setting,
    Task,
    Note,
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

export type Settings = {
    [key: string]: Setting;
}

export function useIndexedDb() {

    const dbRef: MutableRefObject<IDBPDatabase<Db<DbTypes>> | null> = useRef<IDBPDatabase<Db<DbTypes>> | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [settings, setSettings] = useState<Settings>({});
    const [data, setData] = useState<Settings>({});

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

            /*
            if (currentDbVersion < 2) {
                await migration_2(_db);
            }

            if (currentDbVersion < 3) {
                await migration_3(_db);
            }
            */

            localStorage.setItem('db', DB_VERSION.toString());

            console.log('upgrade done!');
          },
        });

        let cursor = await db.transaction("app").store.openCursor();

        while(cursor) {
            const value = cursor.value;
            cursor = await cursor.continue();
        }

        

        dbRef.current = db;

        const currentSettings = await getAllSettings();
        const newSettings: Settings = {};
        currentSettings.forEach((setting) => {
            newSettings[setting.name] = {
                id: setting.id as string,
                name: setting.name,
                value: setting.value,
            };
        });

        console.log('got new settings', newSettings);

        setSettings(newSettings);
    
    }

    async function getAllSettings(): Promise<Setting[]> {
        const data = await dbRef.current?.getAll(SETTINGS_STORE_NAME);
        if (!data) return [];
        const settingsFromData: Setting[] = data.filter((row) => {
            return row.type === IndexedDbTypes.Setting;
        }).map((obj) => {
            return obj.data as Setting;
        });
        return settingsFromData;
    }

    async function updateSetting(newSetting: IndexedDbValue<Setting>): Promise<void> {

        const currentSettings = await getAllSettings();
        const newSettings: Settings = {};
        currentSettings.forEach((setting) => {
            newSettings[setting.name] = {
                id: setting.id as string,
                name: setting.name,
                value: setting.value,
            };
        });
        setSettings(newSettings);
    }

    useEffect(() => {
        console.log('settings updated!', settings);
        if (!isInitialized) {
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
    }
    
}