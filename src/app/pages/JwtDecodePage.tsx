import React, { useState } from 'react';
import jwt from 'jwt-decode';
import { Utility } from '../components/Utility';
import { Content } from '../components/Config';

function decodeToken(token: string): string {
    try {
        return JSON.stringify(jwt(token), null, 4);
    } catch(e) {
        console.log('error parsing token', token);
        return "invalid token";
    }
}

export function JwtDecodePage() {

    const [token, setToken] = useState<string>('');

    return (
        <Utility title="JWT decode">
            <Content>
                <div>
                    <input type="text" placeholder="paste token here" value={token} onChange={(e) => {
                        setToken(e.target.value);
                    }} />
                </div>
                <div>
                    <textarea value={decodeToken(token)} onChange={() => {}} />
                </div>
            </Content>
        </Utility>
    )

}