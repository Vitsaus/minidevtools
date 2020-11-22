import { useState } from 'react';
import {v4} from 'uuid';
import { Content } from '../components/Config';
import { Utility } from '../components/Utility';

export function GenerateUuidPage() {

    const [value, setValue] = useState<string>("");
    
    return (
        <Utility title="Generate UUID">
            <Content>            
                <div>
                    <input type="button" value={"Generate UUID"} onClick={() => {
                        setValue(v4());
                    }} />
                </div>
                <div>
                    <input type="text" value={value} onChange={() => {}} />
                </div>
            </Content>
        </Utility>
    )

}