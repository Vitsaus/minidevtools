import React, { useState } from 'react';
import {v4} from 'uuid';

export function GenerateUuidPage() {

    const [value, setValue] = useState<string>("");
    
    return (
        <div>
            <div>
                <input type="button" value={"Generate UUID"} onClick={() => {
                    const uuid = v4();
                    setValue(uuid);
                }} />
            </div>
            <div>
                <input type="text" value={value} onChange={() => {}} />
            </div>
        </div>
    )

}