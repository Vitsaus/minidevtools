import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 34px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 18px;
    background-color: #00A82D;
    padding: 8px;
    color: #fff;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
`;

export type UtilityProps = {
    title: ReactNode;
    children: ReactNode;
}

export function Utility(props: UtilityProps) {

    return (
        <Root>
            <Header>{props.title}</Header>
            <Content>{props.children}</Content>
        </Root>
    )

}