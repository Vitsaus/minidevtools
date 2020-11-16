import { format, fromUnixTime, addSeconds, addMinutes, subMinutes } from 'date-fns';
import React, { useState, useEffect } from 'react';
import * as cat from 'countries-and-timezones';
import styled from 'styled-components';

const Container = styled.div`
    margin: 16px;
    border: 1px solid #444;
    background-color: #fff;
    font-family: Roboto;
    font-size: 12px;
    padding: 6px;
    border-radius: 4px;
    width: 100%;
`;

const zones = cat.getAllTimezones();
const date = new Date();
const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);

export function DateTimePage() {

    const [dateValue, setDateValue] = useState<number>(utcTime);
    const [timezones, setTimezones] = useState<string[]>([
        "UTC",
        "Europe/Helsinki",
        "Europe/Stockholm",
        "Europe/Amsterdam",
        "Europe/Prague",
    ]);

    useEffect(() => {
        const timer = setInterval(() => {
            const d = new Date();
            const newValue = d.getTime() + (d.getTimezoneOffset() * 60000);
          setDateValue(newValue);
        }, 5000);
        return () => clearInterval(timer);
      }, []);

    return (
        <div>
            <Container>
                <strong>
                    Now: {format(dateValue, 'dd.MM.yyyy hh:mm:ss')}
                </strong>
            </Container>
            {Object.keys(zones).map((key) => {
                return zones[key];
            }).filter((zone) => {
                return timezones.includes(zone.name);
            }).map((zone, index) => {
                const utcValue = addMinutes(new Date(dateValue), zone.utcOffset);
                const dstValue = addMinutes(new Date(dateValue), zone.dstOffset);
                const country = cat.getCountry(zone.country as string);
                return (
                    <Container key={`zone-${index}`}>
                        <div>
                            <strong>{zone.name} / {zone.utcOffsetStr} / {zone.dstOffsetStr}</strong>
                        </div>
                        <div>
                            standard: {format(utcValue, 'dd.MM.yyyy hh:mm:ss')}
                        </div>
                        <div>
                            dst: {format(dstValue, 'dd.MM.yyyy hh:mm:ss')}
                        </div>
                    </Container>
                );
            })}
        </div>
    )

}