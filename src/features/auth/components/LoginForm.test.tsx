import { describe, test } from "@jest/globals";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router';
import LoginForm from "./LoginForm";

describe('Login Form Component', () => {

    test('login form should render and has correct heading', () => {
        render(
            <BrowserRouter>
                <LoginForm/>
            </BrowserRouter>
        );
    
        const heading = screen.getByRole('heading', { name: /login/i });
        expect(heading).toBeInTheDocument();
    });


    test('login form should not be valid when required fields are not filled', () => {
        
        render(
            <BrowserRouter>
                <LoginForm/>
            </BrowserRouter>
        );
    
        const emailInput = screen.getByRole('textbox', { name: /email/i }) as HTMLInputElement;
        const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
        const loginButton = screen.getByRole('button', { name: /login/i});

        fireEvent.click(loginButton);

        expect(emailInput.validity.valid).toBe(false);
        expect(emailInput.validity.valueMissing).toBe(true);
        expect(passwordInput.validity.valid).toBe(false);
        expect(passwordInput.validity.valueMissing).toBe(true);
    });
});