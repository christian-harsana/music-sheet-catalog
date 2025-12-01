import { useContext, useState, type ChangeEvent, type FocusEvent } from "react";
import { AuthContext } from "../contexts/AuthContext";
import type { AuthUserType } from "../types/common.type";

type loginFormDataType = {
    email: string;
    password: string;
}

type loginFormErrorType = {
    [K in keyof loginFormDataType]?: string;
}

type loginFieldTouchedType = {
    [K in keyof loginFormDataType]?: boolean;
}


const BASEURL = 'http://localhost:3000/';
const LOGINURL = `${BASEURL}api/auth/login`;

function Login() {

    const {login} = useContext(AuthContext);
    const [loginFormData, setLoginFormData] = useState<loginFormDataType>({email: "", password: ""});
    const [loginFormError, setLoginFormError] = useState<loginFormErrorType>({});
    const [loginFieldTouched, setLoginFieldTouched] = useState<loginFieldTouchedType>({});

    function validateField(name: string, value: string): string {

        let error = "";

        switch(name) {
            case "email":
                if (value.length < 1) return "Email is required";
                break;

            case "password":
                if (value.length < 1) return "Password is required";
                break;
        }

        return error;
    }

    
    function validateForm(loginFormData: loginFormDataType) {

        const submissionError: loginFormErrorType = {};

        Object.keys(loginFormData).forEach((name) => {

            const fieldName = name as keyof loginFormDataType;
            const error = validateField(name, loginFormData[fieldName]);

            submissionError[fieldName] = error;
        });

        return submissionError;
    }


    function handleInputChange(e: ChangeEvent<HTMLInputElement>):void {

        const value = e.target.value;
        const name = e.target.name as keyof loginFormDataType;

        setLoginFormData((prev) => ({...prev, [name]: value}));

        if (loginFieldTouched[name]) {
            setLoginFormError((prev) => ({...prev, [name]: validateField(name, value)}))
        }
    }


    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {

        const name = e.target.name as keyof loginFormDataType;
        const value = e.target.value;

        setLoginFieldTouched((prev) => ({...prev, [name]: true}));
        setLoginFormError((prev) => ({...prev, [name]: validateField(name, value)}));
    }


    async function handleLoginFormSubmit(e: React.FormEvent, loginFormData: loginFormDataType) {

        e.preventDefault();

        // Validate Form
        const formSubmissionError: loginFormErrorType = validateForm(loginFormData);
        let isErrorExist = false;

        // Check if there is any error
        Object.keys(loginFormData).forEach((name) => {
            isErrorExist = formSubmissionError[name as keyof loginFormDataType]?.length ? true : false;
        });

        if (isErrorExist) {

            // Update form states
            setLoginFormError(formSubmissionError);
            setLoginFieldTouched({
                email: true,
                password: true
            });
        }
        else {

            // Update form states
            setLoginFormError({});
            setLoginFieldTouched({});

            try {
                // Connect to login end point
                const response = await fetch(LOGINURL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(loginFormData)
                });

                const responseData = await response.json();

                // Check if the response is successful or not
                if (!response.ok) {

                    // Handle API error responses (401, 400, 500, etc.)
                    throw new Error(responseData.message);
                }

                // On Success, store token to Context and Local Storage
                const user: AuthUserType = {
                    id: responseData.data.userId,
                    email: responseData.data.email,
                    name: responseData.data.name,
                    token: responseData.data.token
                }

                // Store user to Context and local Storage
                login(user);
            }
            catch (error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';

                alert(errorMessage);
                console.log(errorMessage); // TODO: Implement error handling

            }
        }
    }

    return(
        <form onSubmit={(e) => handleLoginFormSubmit(e, loginFormData)} className="u-text-align-left">
            <h1>Login</h1>

            <div className="l-v-spacing-lv-3">
                <label htmlFor="email">Email</label>
                <input
                    id="email" 
                    type="email"
                    name="email" 
                    value={loginFormData.email} 
                    onChange={(e) => handleInputChange(e)} 
                    onBlur={(e) => handleInputBlur(e)} 
                    required={true} 
                    {...(loginFormError.email && {"aria-invalid": "true", "aria-describedby": "emailError"})}
                /> 
                { loginFormError.email && <div id="emailError" className="field-error">{loginFormError.email}</div> }
            </div>

            <div className="l-v-spacing-lv-3">
                <label htmlFor="password">Password</label>
                <input 
                    id="password"
                    type="password"
                    name="password"  
                    value={loginFormData.password} 
                    onChange={(e) => handleInputChange(e)} 
                    onBlur={(e) => handleInputBlur(e)} 
                    required={true}
                    {...(loginFormError.password && {"aria-invalid": "true", "aria-describedby": "passwordError"})}
                />
                { loginFormError.password && <div id="passwordError" className="field-error">{loginFormError.password}</div> }
            </div>

            <div className="l-v-spacing-lv-3">
                <button type="submit">Login</button>
            </div>
        </form>
    )
}

export default Login;