import { MutableRefObject, useEffect, useRef, useState } from 'react';
import {Switch, Route, useHistory, Link} from 'react-router-dom';
import { JsonPrettifyPage } from '../../pages/JsonPrettifyPage';
import { MainPage } from '../../pages/MainPage';
import styled, {createGlobalStyle} from 'styled-components';
import { JwtDecodePage } from '../../pages/JwtDecodePage';
import { GenerateUuidPage } from '../../pages/GenerateUuidPage';
import { DateTimePage } from '../../pages/DateTimePage';
import { XmlPrettifyPage } from '../../pages/XmlPrettifyPage';
import mousetrap from 'mousetrap';
import { GlobalStyle, Root, StyledLink, Tools, Page } from './styles';
import { Base64Page } from '../../pages/Base64Page';
import { JSEvalPage } from '../../pages/JsEvalPage';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DB_VERSION, SETTINGS_STORE_NAME, SETTING_JSON_SPACING, SETTING_JSON_STRIP_SLASHES } from '../../constants';

export type Setting = {
    name: string;
    id?: string;
    value: string;
}

interface Db extends DBSchema {
    settings: {
        value: Setting;
        key: string;
        indexes: { 'by-name': string };
    };
}

export type Settings = {
    [key: string]: Setting;
}

export function App() {

    const history = useHistory();
    const dbRef: MutableRefObject<IDBPDatabase<Db> | null> = useRef<IDBPDatabase<Db> | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [settings, setSettings] = useState<Settings>({});

    async function setupDb() {

        console.log('do demo thing');

        let currentDbVersion = parseInt(localStorage.getItem('db') as string);
        
        if (!currentDbVersion) {
            currentDbVersion = 0;
        }
        
        const db: IDBPDatabase<Db> = await openDB<Db>('App', DB_VERSION, {
          upgrade: async (_db) => {
            console.log('db init', currentDbVersion, _db.version);

            if (currentDbVersion < 1) {
                console.log('db migration, 1');
                const store = _db.createObjectStore("settings", {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                const tx = store.transaction;
                await tx.objectStore("settings").createIndex("by-name", "name");
                await tx.objectStore("settings").add({
                    name: SETTING_JSON_SPACING,
                    value: '4'
                });
                await tx.objectStore("settings").add({
                    name: SETTING_JSON_STRIP_SLASHES,
                    value: 'Yes'
                });
                await tx.done;
            }

            if (currentDbVersion < 2) {
                console.log('db migration, 2');
                const tx = _db.transaction("settings", "readwrite");
                await tx.store.add({
                    name: "xml.test",
                    value: 'Yes'
                });
                await tx.done;
            }

            localStorage.setItem('db', DB_VERSION.toString());

            console.log('upgrade done!');
          },
        });

        dbRef.current = db;

        const settingsFromDb = await db.getAll(SETTINGS_STORE_NAME);
        const newSettings: Settings = {};
        settingsFromDb.forEach((setting) => {
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
        mousetrap.bind('command+1', () => {
            history.push('/json-prettify');
        });
        mousetrap.bind('command+2', () => {
            history.push('/jwt-decode');
        });
        mousetrap.bind('command+3', () => {
            history.push('/generate-uuid');
        });
        mousetrap.bind('command+4', () => {
            history.push('/datetime');
        });
        mousetrap.bind('command+5', () => {
            history.push('/xml-prettify');
        });
        mousetrap.bind('command+6', () => {
            history.push('/base64');
        });
        mousetrap.bind('command+7', () => {
            history.push('/js-eval');
        });
        setupDb();
        return () => {
            mousetrap.reset();
        }
    }, []);

    if (!isInitialized) {
        return (
            <div>
                Initializing...
            </div>
        )
    }

    return (
        <Root>
            <GlobalStyle />
            <Tools>
                <StyledLink to="/json-prettify">JSON prettify</StyledLink>
                <StyledLink to="/jwt-decode">JWT Decode</StyledLink>
                <StyledLink to="/generate-uuid">Generate UUID</StyledLink>
                <StyledLink to="/datetime">DateTime</StyledLink>
                <StyledLink to="/xml-prettify">XML prettify</StyledLink>
                <StyledLink to="/base64">Base64</StyledLink>
                <StyledLink to="/js-eval">JS Eval</StyledLink>
            </Tools>
            <Page>
                <Switch>
                    <Route path="/" exact component={MainPage} />
                    <Route path="/json-prettify" exact component={() => {
                        return (
                            <JsonPrettifyPage
                                updateSetting={updateSetting}
                                settings={settings}
                            />
                        )
                    }} />
                    <Route path="/jwt-decode" exact component={JwtDecodePage} />
                    <Route path="/generate-uuid" exact component={GenerateUuidPage} />
                    <Route path="/datetime" exact component={DateTimePage} />
                    <Route path="/xml-prettify" exact component={XmlPrettifyPage} />
                    <Route path="/base64" exact component={Base64Page} />
                    <Route path="/js-eval" exact component={JSEvalPage} />
                </Switch>
            </Page>
        </Root>
    )
}