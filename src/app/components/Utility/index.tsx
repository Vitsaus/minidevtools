import { ReactNode } from 'react';
import styled from 'styled-components';
import { Tools, StyledLink } from '../App/styles';

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
            <Tools>
                <StyledLink to="/json-prettify">JSON prettify</StyledLink>
                <StyledLink to="/jwt-decode">JWT Decode</StyledLink>
                <StyledLink to="/generate-uuid">Generate UUID</StyledLink>
                <StyledLink to="/datetime">DateTime</StyledLink>
                <StyledLink to="/xml-prettify">XML prettify</StyledLink>
                <StyledLink to="/base64">Base64</StyledLink>
                <StyledLink to="/js-eval">JS Eval</StyledLink>
                <StyledLink to="/diff">Diff</StyledLink>
            </Tools>
            <Header>{props.title}</Header>
            <Content>{props.children}</Content>
        </Root>
    )

}