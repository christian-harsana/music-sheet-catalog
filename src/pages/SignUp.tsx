import { useState, type FocusEvent } from "react";
import { useNavigate } from "react-router";

type signUpFormDataType = {
    email: string;
    name: string;
    password: string;
}

type signUpFormErrorType = {
    [K in keyof signUpFormDataType]?: string;
}

type signUpFormTouched = {
    [K in keyof signUpFormDataType]?: boolean;
}


const BASEURL = 'http://localhost:3000/';
const SIGNUPURL = `${BASEURL}api/auth/signup`;


function SignUp() {

    const [signUpFormData, setSignUpFormData] = useState<signUpFormDataType>({email: "", name: "", password: ""});
    const [signUpFormError, setSignUpFormError] = useState<signUpFormErrorType>({});
    const [signUpFormTouched, setSignUpFormTouched] = useState<signUpFormTouched>({});
    const navigate = useNavigate();

    function validateField(name: string, value: string): string {

        switch (name) {
            case "email":
                if (value.length < 1) return "Email is required";
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return "Please provide a valid email"; 
                break;

            case "password":
                if (value.length < 1) return "Password is required";
                if (value.length < 8) return "Password must be at least 8 characters";
                break;
        }

        return "";
    }


    function validateForm(signUpFormData: signUpFormDataType): signUpFormErrorType {

        const formSubmissionError: signUpFormErrorType = {};

        // Loop through the field and validate each field
        Object.keys(signUpFormData).forEach((name) => {

            const fieldName = name as keyof signUpFormDataType;
            let error = validateField(fieldName, signUpFormData[fieldName]);

            formSubmissionError[fieldName] = error;
        });

        return formSubmissionError;
    }


    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {

        const value = e.target.value;
        const name = e.target.name as keyof signUpFormDataType;

        setSignUpFormData((prev) => ({...prev, [name]: value}));

        if (signUpFormTouched[name]) {
            setSignUpFormError((prev) => ({...prev, [name]: validateField(name, value)}));
        }
    }


    function handleInputBlur(e: FocusEvent<HTMLInputElement>): void {

        const name = e.target.name as keyof signUpFormDataType;
        const value = e.target.value;

        setSignUpFormTouched((prev) => ({...prev, [name]: true}));
        setSignUpFormError((prev) => ({...prev, [name]: validateField(name, value )}));
    }


    async function handleSignUpFormSubmit(e: React.FormEvent, signUpFormData: signUpFormDataType) {

        e.preventDefault();

        // Validate the form
        const formSubmissionError: signUpFormErrorType = validateForm(signUpFormData);

        // Check if error exist
        let isErrorExist = false;

        Object.keys(formSubmissionError).forEach((name) => {
            isErrorExist = formSubmissionError[name as keyof signUpFormDataType]?.length ? true : false;
        });

        // If error exist prevent the form submission
        if (isErrorExist) {

            // Update Error state
            setSignUpFormError(formSubmissionError);

            // Update the field touched state
            setSignUpFormTouched({
                email: true,
                name: true,
                password: true
            });
        }
        else 
        {
            // Update State
            setSignUpFormError({});
            setSignUpFormTouched({});

            try {
                // Call the signup endpoint
                const response = await fetch(SIGNUPURL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(signUpFormData)
                });

                // On success redirect to login
                const data = await response.json();

                // Trigger feedback
                alert(data.message); // TODO: Upgrade the feedback to Toast or something similar

                if (data.status.toLowerCase() === "success") {
                    
                    // Redirect to login
                    navigate("/login");
                }
            }
            catch (error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';

                console.log(errorMessage); // TODO: Implement error handling
            }
        }
    }


    return (
        <form onSubmit={(e) => handleSignUpFormSubmit(e, signUpFormData)} className="u-text-align-left">
            <h1>Sign Up</h1>

            <div className="l-v-spacing-lv-3">
                <label htmlFor="email">Email *</label>
                <input 
                    id="email" 
                    type="email" 
                    name="email" 
                    value={signUpFormData.email} 
                    onChange={(e) => handleInputChange(e)} 
                    onBlur={(e) => handleInputBlur(e)} 
                    required={true} 
                    {...(signUpFormError.email && { "aria-invalid" : "true", "aria-describedby" : "emailError" })}
                />

                {signUpFormError.email && <div id="emailError" className="field-error">{signUpFormError.email}</div>}
            </div>
            
            <div className="l-v-spacing-lv-3">
                <label htmlFor="name">Name</label>
                <input 
                    id="name" 
                    type="text" 
                    name="name"
                    value={signUpFormData.name} 
                    onChange={(e) => handleInputChange(e)}
                    onBlur={(e) => handleInputBlur(e)} 
                    {...(signUpFormError.name && { "aria-invalid" : "true", "aria-describedby" : "nameError" })}
                />

                {signUpFormError.name && <div id="nameError" className="field-error">{signUpFormError.name}</div>}
            </div>
            
            <div className="l-v-spacing-lv-3">
                <label htmlFor="password">Password *</label>
                <input 
                    id="password" 
                    type="password" 
                    name="password" 
                    value={signUpFormData.password} 
                    onChange={(e) => handleInputChange(e)}
                    onBlur={(e) => handleInputBlur(e)} 
                    required={true}
                    minLength={8}
                    {...(signUpFormError.password && { "aria-invalid" : "true", "aria-describedby" : "passwordError" })}
                />

                {signUpFormError.password && <div id="passwordError" className="field-error">{signUpFormError.password}</div>}
            </div>

            <div className="l-v-spacing-lv-3">
                <button type="submit">Register</button>
            </div>
        </form>
    )
}

export default SignUp;