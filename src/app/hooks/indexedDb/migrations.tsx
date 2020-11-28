import { IDBPDatabase } from "idb";
import { SETTING_JSON_SPACING, SETTING_JSON_STRIP_SLASHES } from "../../constants";
import { Db, DbTypes, IndexedDbTypes } from "./indexedDb";

export async function migration_1(db: IDBPDatabase<Db<DbTypes>>): Promise<void> {

    console.log('db migration, 1');

    const store = db.createObjectStore("app", {
        keyPath: 'id',
        autoIncrement: true,
    });

    const tx = store.transaction;

    await tx.objectStore("app").add({
        type: IndexedDbTypes.Setting,
        data: {
            name: SETTING_JSON_SPACING,
            value: "2",
        }
    });

    await tx.objectStore("app").add({
        type: IndexedDbTypes.Setting,
        data: {
            name: SETTING_JSON_STRIP_SLASHES,
            value: 'Yes'
        }
    });
    
    await tx.done;

}