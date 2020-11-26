import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';


export const GlobalStyle = createGlobalStyle`
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

export const StyledLink = styled(Link)`
    color: #fff;
    text-decoration: none;
    margin: 8px;
    &:hover {
        color: #fff;
        text-decoration: underline;
    }
`;

export const Root = styled.div`
    display: flex;
    flex-direction: column;
`;

export const MainTools = styled.div`
    display: flex;
    flex-direction: row;
    color: #fff;
    background-color: #000;
    -webkit-user-select: none;
    -webkit-app-region: drag;  
    cursor: pointer;
`;

export const Tools = styled.div`
    display: flex;
    flex-direction: row;
    color: #fff;
    background-color: #1A1A1A;
    -webkit-user-select: none;
    -webkit-app-region: drag;  
    cursor: pointer;
`;

export const Page = styled.div`
    margin: 0;
    padding: 0;
`;