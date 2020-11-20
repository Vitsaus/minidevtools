import { ReactNode } from 'react';
import styled from 'styled-components';

export const Content = styled.div`
    margin: 8px;
`;

export const Config = styled.div`
    display: flex;
    background-color: #008F26;
    color: #fff;
    border: 1px solid #007620;
`;

export const Option = styled.div`
    display: flex;
    flex-direction: row;
    border-right: 1px solid #007620;
    padding: 8px;
`;

export const OptionTitle = styled.div`
    padding: 0 8px 0 0;
`;

export const OptionValue = styled.div<{
    isSelected: boolean;
    onClick: () => void;
    children: ReactNode;
}>`
    padding: 0 6px 0 0;
    font-weight: ${props => props.isSelected ? "bold" : "normal"};
    cursor: pointer;
`;