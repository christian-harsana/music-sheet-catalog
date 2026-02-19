import { useContext, useState, type FocusEvent } from "react";
import { useNavigate, Link } from "react-router";
import { UIContext } from "../../../contexts/UIContext";
import { api } from "../../../shared/utils/api";
import IconSpinner from "../../../shared/components/IconSpinner";
import { HttpError } from "../../../errors";

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


export default function SignUpPage() {

    const [signUpFormData, setSignUpFormData] = useState<signUpFormDataType>({email: "", name: "", password: ""});
    const [signUpFormError, setSignUpFormError] = useState<signUpFormErrorType>({});
    const [signUpFormTouched, setSignUpFormTouched] = useState<signUpFormTouched>({});
    const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);
    const {addToast} = useContext(UIContext);
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

        setIsFormProcessing(true);

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

            setIsFormProcessing(false);
        }
        else 
        {
            // Update State
            setSignUpFormError({});
            setSignUpFormTouched({});

            try {
                const response = await api.post(`auth/signup`, signUpFormData)
                const result = await response.json();

                if (result.success) {
                    addToast(result.message);
                    navigate("/login");
                }
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

    // TODO:
    // - Separate the page layout and form component
    

    return (
        <main className="flex justify-center items-center min-h-screen">
            <form onSubmit={(e) => handleSignUpFormSubmit(e, signUpFormData)} 
                className="w-[calc(100%-3rem)] max-w-md px-7 py-5 rounded-lg bg-gray-50 text-gray-950">

                <h1 className="mb-4 font-bold text-2xl text-center uppercase">Sign Up</h1>

                <div className="mb-4">
                    <label htmlFor="email" 
                        className={`block mb-1 ${signUpFormError.email ? 'text-red-600' : ''}`}>
                        Email <span className="text-red-600" aria-hidden="true">*</span>
                    </label>
                    
                    <input 
                        id="email" 
                        type="email" 
                        name="email" 
                        value={signUpFormData.email} 
                        onChange={(e) => handleInputChange(e)} 
                        onBlur={(e) => handleInputBlur(e)} 
                        required={true} 
                        className={`w-full border rounded-md px-3 py-2 ${signUpFormError.email ? 'border-red-600' : 'border-gray-400'}`} 
                        {...(signUpFormError.email && { "aria-invalid" : "true", "aria-describedby" : "emailError" })}
                    />

                    {signUpFormError.email && <div id="emailError" className="text-red-600">{signUpFormError.email}</div>}
                </div>
                
                <div className="mb-4">
                    <label htmlFor="name"
                        className={`block mb-1 ${signUpFormError.name ? 'text-red-600' : ''}`}>
                        Name
                    </label>
                    <input 
                        id="name" 
                        type="text" 
                        name="name"
                        value={signUpFormData.name} 
                        onChange={(e) => handleInputChange(e)}
                        onBlur={(e) => handleInputBlur(e)} 
                        className={`w-full border rounded-md px-3 py-2 ${signUpFormError.name ? 'border-red-600' : 'border-gray-400'}`}
                        {...(signUpFormError.name && { "aria-invalid" : "true", "aria-describedby" : "nameError" })}
                    />

                    {signUpFormError.name && <div id="nameError" className="text-red-600">{signUpFormError.name}</div>}
                </div>
                
                <div className="mb-4">
                    <label htmlFor="password"
                        className={`block mb-1 ${signUpFormError.email ? 'text-red-600' : ''}`}>
                        Password <span className="text-red-600" aria-hidden="true">*</span>
                    </label>
                    <input 
                        id="password" 
                        type="password" 
                        name="password" 
                        value={signUpFormData.password} 
                        onChange={(e) => handleInputChange(e)}
                        onBlur={(e) => handleInputBlur(e)} 
                        required={true}
                        minLength={8}
                        className={`w-full border rounded-md px-3 py-2 ${signUpFormError.password ? 'border-red-600' : 'border-gray-400'}`}
                        {...(signUpFormError.password && { "aria-invalid" : "true", "aria-describedby" : "passwordError" })}
                    />

                    {signUpFormError.password && <div id="passwordError" className="text-red-600">{signUpFormError.password}</div>}
                </div>

                <div className="mb-4">
                    {
                        isFormProcessing ? (
                            <button type="submit" 
                                disabled 
                                className="flex flex-nowrap justify-center gap-3 w-full px-3 py-2 border border-violet-500 rounded-md bg-violet-500 text-gray-50 font-semibold uppercase cursor-progress opacity-50">
                                <IconSpinner />
                                Registering...
                            </button>  
                        ) :
                        ( 
                            <button type="submit"
                                className="w-full px-3 py-2 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50 font-semibold uppercase">
                                Register
                            </button> 
                        )
                    }
                </div>

                <p className="mb-4 text-center">
                    Have an account? <Link to="/login" className="text-sm text-violet-500 font-semibold underline hover:no-underline">Login</Link>
                </p>
            </form>
        </main>
    )
}