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

export type IndexedDbValue = {
    type: IndexedDbTypes,
    data: Setting | Note | Task;
}

export interface Db extends DBSchema {
    app: {
        value: IndexedDbValue;
        key: string;
    };
}

export type Settings = {
    [key: string]: Setting;
}

export function useIndexedDb() {

    const dbRef: MutableRefObject<IDBPDatabase<Db> | null> = useRef<IDBPDatabase<Db> | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [data, setData] = useState<Settings>({});

    async function setupDb() {

        let currentDbVersion = parseInt(localStorage.getItem('db') as string);
        
        if (!currentDbVersion) {
            currentDbVersion = 0;
        }

        console.log('handle indexed db migrations', currentDbVersion, DB_VERSION);
        
        const db: IDBPDatabase<Db> = await openDB<Db>('App', DB_VERSION, {
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

        dbRef.current = db;

        const data = await db.getAll(SETTINGS_STORE_NAME);
        const settingsFromData = data.filter((row) => {
            return row.type === IndexedDbTypes.Setting;
        });
        const newSettings: Settings = {};
        settingsFromData.forEach((setting) => {
            newSettings[setting.name] = {
                id: setting.id as string,
                name: setting.name,
                value: setting.value,
            };
        });

        console.log('got new settings', newSettings);

        setSettings(newSettings);
    
    }

    async function updateSetting(key: string, name: string, value: string): Promise<void> {
        await dbRef.current?.put(SETTINGS_STORE_NAME, {
            name,
            value,
            id: key
        });
        const settingsFromDb = await dbRef.current?.getAll(SETTINGS_STORE_NAME);
        const newSettings: Settings = {};
        settingsFromDb?.forEach((setting) => {
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