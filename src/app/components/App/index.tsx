import { useEffect } from 'react';
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
        mousetrap.bind('command+6', () => {
            history.push('/base64');
        });
        mousetrap.bind('command+7', () => {
            history.push('/js-eval');
        });
        return () => {
            mousetrap.reset();
        }
    }, []);

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
                    <Route path="/json-prettify" exact component={JsonPrettifyPage} />
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