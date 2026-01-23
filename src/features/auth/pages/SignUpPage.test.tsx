import { describe, test } from "@jest/globals";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router';
import SignUpPage from "./SignUpPage";

describe('SignUp Component', () => {

    test('signup page should render and has correct heading', () => {
        render(
            <BrowserRouter>
                <SignUpPage/>
            </BrowserRouter>
        );
    
        const heading = screen.getByRole('heading', { name: /sign up/i });
        expect(heading).toBeInTheDocument();
    });


    test('signup form should not be valid when required fields are not filled', () => {
        
        render(
            <BrowserRouter>
                <SignUpPage/>
            </BrowserRouter>
        );
    
        const emailInput = screen.getByRole('textbox', { name: /email/i }) as HTMLInputElement;
        const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /register/i});

        fireEvent.click(submitButton);

        expect(emailInput.validity.valid).toBe(false);
        expect(emailInput.validity.valueMissing).toBe(true);
        expect(passwordInput.validity.valid).toBe(false);
        expect(passwordInput.validity.valueMissing).toBe(true);
    });
});