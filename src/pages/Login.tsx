import { useContext, useState, type ChangeEvent, type FocusEvent } from "react";
import { Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { UIContext } from "../contexts/UIContext";
import { api } from "../utils/api";
import type { AuthUser } from "../types/common.type";
import IconSpinner from "../components/IconSpinner";


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


function Login() {

    const {login} = useContext(AuthContext);
    const [loginFormData, setLoginFormData] = useState<loginFormDataType>({email: "", password: ""});
    const [loginFormError, setLoginFormError] = useState<loginFormErrorType>({});
    const [loginFieldTouched, setLoginFieldTouched] = useState<loginFieldTouchedType>({});
    const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);
    const {addToast} = useContext(UIContext);

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

        setIsFormProcessing(true);

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
            setIsFormProcessing(false);
        }
        else {

            // Update form states
            setLoginFormError({});
            setLoginFieldTouched({});

            try {
                const response = await api.post(`auth/login`, loginFormData);
                const result = await response.json();

                // On Success, store token to Context and Local Storage
                const user: AuthUser = {
                    id: result.data.userId,
                    email: result.data.email,
                    name: result.data.name
                }

                // Store user to Context and local Storage
                login(user, result.data.token);
            }
            catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                addToast(errorMessage, "error");          
            }
            finally {
                setIsFormProcessing(false);
            }
        }
    }

    return(
        <main className="flex justify-center items-center min-h-screen">
            <form onSubmit={(e) => handleLoginFormSubmit(e, loginFormData)} 
                className="w-[calc(100%-3rem)] max-w-md px-7 py-5 rounded-lg bg-gray-50 text-gray-950">

                <h1 className="mb-4 font-bold text-2xl text-center uppercase">Login</h1>

                <div className="mb-4">
                    <label htmlFor="email" className={`block mb-1 ${loginFormError.email ? 'text-red-600' : ''}`}>Email</label>
                    <input
                        id="email" 
                        type="email"
                        name="email" 
                        value={loginFormData.email} 
                        onChange={(e) => handleInputChange(e)} 
                        onBlur={(e) => handleInputBlur(e)} 
                        required={true} 
                        className={`w-full border rounded-md px-3 py-2 ${loginFormError.email ? 'border-red-600' : 'border-gray-400'}`}
                        {...(loginFormError.email && {"aria-invalid": "true", "aria-describedby": "emailError"})}
                    /> 
                    { loginFormError.email && <div id="emailError" className="text-red-600">{loginFormError.email}</div> }
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className={`block mb-1 ${loginFormError.password ? 'text-red-600' : ''}`}>Password</label>
                    <input 
                        id="password"
                        type="password"
                        name="password"  
                        value={loginFormData.password} 
                        onChange={(e) => handleInputChange(e)} 
                        onBlur={(e) => handleInputBlur(e)} 
                        required={true} 
                        className={`w-full border rounded-md px-3 py-2 ${loginFormError.password ? 'border-red-600' : 'border-gray-400'}`}
                        {...(loginFormError.password && {"aria-invalid": "true", "aria-describedby": "passwordError"})}
                    />
                    { loginFormError.password && <div id="passwordError" className="text-red-600">{loginFormError.password}</div> }
                </div>

                <div className="mb-4">
                    {
                        isFormProcessing ? (
                            <button type="submit" 
                                disabled 
                                className="flex flex-nowrap justify-center gap-3 w-full px-3 py-2 border border-violet-500 rounded-md bg-violet-500 text-gray-50 font-semibold uppercase cursor-progress opacity-50">
                                <IconSpinner />
                                Login...
                            </button>  
                        ) :
                        ( 
                            <button type="submit" 
                                className="w-full px-3 py-2 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50 font-semibold uppercase">
                                Login
                            </button> 
                        )
                    }
                </div>

                <p className="mb-4 text-center">
                    Don't have an account? <Link to="/signup" className="text-sm text-violet-500 font-semibold underline hover:no-underline">Sign Up</Link>
                </p>
            </form>
        </main>
    )
}

export default Login;