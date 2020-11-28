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

    cursor: pointer;
`;

export const Tools = styled.div`
    display: flex;
    flex-direction: row;
    color: #fff;
    background-color: #1A1A1A;

    cursor: pointer;
`;

export const Page = styled.div`
    margin: 0;
    padding: 0;
`;