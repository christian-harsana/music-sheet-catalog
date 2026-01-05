import { useState, useContext } from 'react';
import { UIContext } from '../contexts/UIContext';
import IconSpinner from './IconSpinner';
import { AuthContext } from '../contexts/AuthContext';

type genreFormData = {
    name: string
}

type genreFormDataError = {
    [K in keyof genreFormData]?: string
}

type genreFormDataTouched = {
    [K in keyof genreFormData]?: boolean
}

const BASEURL = 'http://localhost:3000/';
const ADDGENREURL = `${BASEURL}api/genre/`;


export default function GenreForm() {

    const [genreFormData, setGenreFormData] = useState<genreFormData>({name: ""});
    const [genreFormDataError, setGenreFormDataError] = useState<genreFormDataError>({});
    const [genreFormDataTouched, setGenreFormDataTouched] = useState<genreFormDataTouched>({});
    const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);
    const { addToast } = useContext(UIContext);
    const { token } = useContext(AuthContext);


    function validateField(field: string, value: string): string {

        switch(field) {
            case "name":
                if (value.trim().length < 1) return "Name is required";
                break;
        }

        return "";
    }


    function validateForm(genreFormData: genreFormData): genreFormDataError {

        const formSubmissionError: genreFormDataError = {};

        // Loop through the field and validate
        Object.keys(genreFormData).forEach((name) => {

            const fieldName = name as keyof genreFormData;
            let error = validateField(fieldName, genreFormData[fieldName]);

            formSubmissionError[fieldName] = error;
        });

        return formSubmissionError;
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        const name = e.target.name as keyof genreFormData;

        // Set Form Data
        setGenreFormData(prev => ({...prev, [name]: value}));

        // Set Validation
        if (genreFormDataTouched[name]) {
            setGenreFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
        }
    }


    const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>): void => {

        const name = e.target.name as keyof genreFormData;
        const value = e.target.value;

        setGenreFormDataTouched(prev => ({...prev, [name]: true}));
        setGenreFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
    }


    const handleGenreFormSubmit = async (e: React.FormEvent, genreFormData: genreFormData) => {

        e.preventDefault()

        setIsFormProcessing(true);

        // Validate the form
        const formSubmissionError: genreFormDataError = validateForm(genreFormData);
    
        // Check if error exist
        let isErrorExist = false;

        Object.keys(formSubmissionError).forEach(name => {
            isErrorExist = formSubmissionError[name as keyof genreFormData]?.length ? true : false;
        });

        if (isErrorExist) {
            setGenreFormDataError(formSubmissionError);
            setGenreFormDataTouched({name: true});
        }
        else {

            // Reset form states
            setGenreFormDataError({});
            setGenreFormDataTouched({});

            try {

                const response = await fetch(ADDGENREURL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(genreFormData)
                });

                const data = await response.json();

                if (data.status.toLowerCase() === "success") {
                    addToast(data.message);
                }
                else {
                    addToast(data.message, 'error');
                }

                setIsFormProcessing(false);
            }
            catch (error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                addToast(errorMessage, "error");
                setIsFormProcessing(false);

            }
        }
    }

    return (
        <form onSubmit={(e) => handleGenreFormSubmit(e, genreFormData)}>
            <div className="mb-4">
                <label htmlFor="genreName"
                    className={`block mb-1 ${genreFormDataError.name ? 'text-red-600' : ''}`}>
                    Name <span className="text-red-600" aria-hidden="true">*</span>
                </label>

                <input type="text" 
                    id="genreName" 
                    name="name"
                    value={genreFormData.name} 
                    onChange={handleInputChange} 
                    onBlur={handleNameBlur}
                    required={true}
                    className={`w-full border rounded-md px-3 py-2 ${genreFormDataError.name ? 'border-red-600' : 'border-gray-400'}`} 
                    { ...(genreFormDataError.name && { "aria-invalid" : "true", "aria-describedby" : "genreNameError" }) }
                    />
                { genreFormDataError.name && <div id="genreNameError" className="text-red-600">{genreFormDataError.name}</div>}
            </div>

            <div className="mb-4">
                {
                    isFormProcessing ? (
                        <button type="submit" 
                            disabled 
                            className="flex flex-nowrap justify-center gap-3 w-full px-3 py-2 border border-fuchsia-400 rounded-md bg-fuchsia-400 font-semibold uppercase cursor-progress opacity-50">
                            <IconSpinner />
                            Saving...
                        </button>
                    ) : (
                        <button type="submit" 
                            className="w-full px-3 py-2 border border-fuchsia-500 hover:border-fuchsia-500 rounded-md bg-fuchsia-400 hover:bg-fuchsia-500 font-semibold">
                            Save
                        </button>
                    )
                }
            </div>
        </form>
    )
}