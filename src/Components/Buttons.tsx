import React, { FC } from 'react';
import styled from 'styled-components';

interface ButtonProps {
    title: string;
    ariaLabel?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

enum ButtonColors {
    Primary = '#27c190',
    PrimaryHover = '#2acc99',
    PrimaryFocus = '#25b688',
    PrimaryOutline = '#1e946f',
}

const CommonButtonStyle = styled.button`
    // Size and placement
    width: 100%;
    max-width: 175px;
    height: 35px;

    // Look
    color: white;
    background-color: ${ButtonColors.Primary};
    outline: none;
    border: 2px solid transparent;
    border-radius: 5px;
    user-select: none;

    // Font
    font-size: 16px;
    font-weight: bold;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
        'Droid Sans', 'Helvetica Neue', sans-serif;

    :hover {
        cursor: pointer;
        background-color: ${ButtonColors.PrimaryHover};
    }

    :active,
    :focus {
        border: 2px solid aqua;
        background-color: ${ButtonColors.PrimaryFocus};
    }
`;

const PrimaryButtonStyle = styled(CommonButtonStyle)``;

export const PrimaryButton: FC<ButtonProps> = ({ title, ariaLabel, onClick }: ButtonProps) => {
    return (
        <PrimaryButtonStyle aria-label={ariaLabel} onClick={onClick}>
            {title}
        </PrimaryButtonStyle>
    );
};

const SecondaryButtonStyle = styled(CommonButtonStyle)``;

export const SecondaryButton: FC<ButtonProps> = ({ title, ariaLabel, onClick }: ButtonProps) => {
    return (
        <SecondaryButtonStyle aria-label={ariaLabel} onClick={onClick}>
            {title}
        </SecondaryButtonStyle>
    );
};

const LinkButtonStyle = styled(CommonButtonStyle)``;

export const LinkButton: FC<ButtonProps> = ({ title, ariaLabel, onClick }: ButtonProps) => {
    return (
        <LinkButtonStyle aria-label={ariaLabel} onClick={onClick}>
            {title}
        </LinkButtonStyle>
    );
};
