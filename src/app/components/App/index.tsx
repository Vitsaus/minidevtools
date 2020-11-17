import React, { useEffect } from 'react';
import {Switch, Route, useHistory, Link} from 'react-router-dom';
import { JsonPrettifyPage } from '../../pages/JsonPrettifyPage';
import { MainPage } from '../../pages/MainPage';
import styled, {createGlobalStyle} from 'styled-components';
import { JwtDecodePage } from '../../pages/JwtDecodePage';
import { GenerateUuidPage } from '../../pages/GenerateUuidPage';
import { DateTimePage } from '../../pages/DateTimePage';
import { XmlPrettifyPage } from '../../pages/XmlPrettifyPage';
import mousetrap from 'mousetrap';

const GlobalStyle = createGlobalStyle`
    html {
        box-sizing: border-box;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }   
    html, body {
        margin: 0;
        padding: 0;
    } 
    body {
        background-color: #f8f8f8;
    }
    input:focus, textarea:focus, select:focus{
        outline: none;
    } 
    textarea, input, select {
        border: 1px solid #444;
        background-color: #fff;
        font-family: Roboto;
        font-size: 12px;
        padding: 6px;
        border-radius: 4px;
        width: 100%;
        text-align: left;
    }
    input {
        height: 28px;
        margin: 0 0 12px 0;
    }
    input[type=button], input[type=submit] {
        cursor: pointer;
    }
    textarea {
        height: 240px;
        margin: 0 0 12px 0;
    }
    div {
        font-family: Roboto;
        font-size: 12px;
        letter-spacing: 1.5;
    }
`;

const StyledLink = styled(Link)`
    color: #fff;
    text-decoration: none;
    margin: 8px;
    &:hover {
        color: #fff;
        text-decoration: underline;
    }
`;

const Root = styled.div`
    display: flex;
    flex-direction: column;
`;

const Tools = styled.div`
    display: flex;
    flex-direction: row;
    color: #fff;
    background-color: #1A1A1A;
    -webkit-user-select: none;
    -webkit-app-region: drag;  
    cursor: pointer;
`;

const Page = styled.div`
    margin: 0;
    padding: 0;
`;

export function App() {

    const history = useHistory();

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
        mousetrap.bind('command+q', () => {
            
        });
        return () => {
            mousetrap.reset();
        }
    }, []);

    return (
        <Root>
            <GlobalStyle />
            <Tools>
                <StyledLink to="/">Main</StyledLink>
                <StyledLink to="/json-prettify">JSON prettify</StyledLink>
                <StyledLink to="/jwt-decode">JWT Decode</StyledLink>
                <StyledLink to="/generate-uuid">Generate UUID</StyledLink>
                <StyledLink to="/datetime">DateTime</StyledLink>
                <StyledLink to="/xml-prettify">XML prettify</StyledLink>
            </Tools>
            <Page>
                <Switch>
                    <Route path="/" exact component={MainPage} />
                    <Route path="/json-prettify" exact component={JsonPrettifyPage} />
                    <Route path="/jwt-decode" exact component={JwtDecodePage} />
                    <Route path="/generate-uuid" exact component={GenerateUuidPage} />
                    <Route path="/datetime" exact component={DateTimePage} />
                    <Route path="/xml-prettify" exact component={XmlPrettifyPage} />
                </Switch>
            </Page>
        </Root>
    )
}