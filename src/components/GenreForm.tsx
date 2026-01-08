import { useState, useContext } from 'react';
import { UIContext } from '../contexts/UIContext';
import { AuthContext } from '../contexts/AuthContext';
import { DataRefreshContext } from '../contexts/DataRefreshContext';
import IconSpinner from './IconSpinner';
import type { Genre } from '../types/genre.type';

type GenreFormData = {
    name: string
}

type GenreFormDataError = {
    [K in keyof GenreFormData]?: string
}

type GenreFormDataTouched = {
    [K in keyof GenreFormData]?: boolean
}

type GenreFormProp = {
    genre?: Genre
}

const BASEURL = 'http://localhost:3000/';
const GENREURL = `${BASEURL}api/genre/`;


export default function GenreForm({genre} : GenreFormProp) {

    const mode = genre ? "edit" : "add";
    const genreId = genre?.id ?? null;
    const {id, ...formDefaultData} = genre ?? {name: ""};

    const [GenreFormData, setGenreFormData] = useState<GenreFormData>(formDefaultData);
    const [GenreFormDataError, setGenreFormDataError] = useState<GenreFormDataError>({});
    const [GenreFormDataTouched, setGenreFormDataTouched] = useState<GenreFormDataTouched>({});
    const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);
    const { addToast, closeModal } = useContext(UIContext);
    const { token } = useContext(AuthContext);
    const { triggerRefresh } = useContext(DataRefreshContext);

    function validateField(field: string, value: string): string {

        switch(field) {
            case "name":
                if (value.trim().length < 1) return "Name is required";
                break;
        }

        return "";
    }


    function validateForm(GenreFormData: GenreFormData): GenreFormDataError {

        const formSubmissionError: GenreFormDataError = {};

        // Loop through the field and validate
        Object.keys(GenreFormData).forEach((name) => {

            const fieldName = name as keyof GenreFormData;
            let error = validateField(fieldName, GenreFormData[fieldName]);

            formSubmissionError[fieldName] = error;
        });

        return formSubmissionError;
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        const name = e.target.name as keyof GenreFormData;

        // Set Form Data
        setGenreFormData(prev => ({...prev, [name]: value}));

        // Set Validation
        if (GenreFormDataTouched[name]) {
            setGenreFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
        }
    }


    const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>): void => {

        const name = e.target.name as keyof GenreFormData;
        const value = e.target.value;

        setGenreFormDataTouched(prev => ({...prev, [name]: true}));
        setGenreFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
    }


    const handleGenreFormSubmit = async (e: React.FormEvent, GenreFormData: GenreFormData, genreId: string | null) => {

        e.preventDefault()

        setIsFormProcessing(true);

        // Validate the form
        const formSubmissionError: GenreFormDataError = validateForm(GenreFormData);
    
        // Check if error exist
        let isErrorExist = false;

        Object.keys(formSubmissionError).forEach(name => {
            isErrorExist = formSubmissionError[name as keyof GenreFormData]?.length ? true : false;
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

                const method = mode === 'edit' ? 'PUT' : 'POST';
                const actionURL = mode === 'edit' ? `${GENREURL}${genreId}` : GENREURL;

                const response = await fetch(actionURL, {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(GenreFormData)
                });

                const data = await response.json();

                if (data.status.toLowerCase() === "success") {
                    addToast(data.message);
                    triggerRefresh();
                    closeModal();
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
        <form onSubmit={(e) => handleGenreFormSubmit(e, GenreFormData, genreId)}>
            <div className="mb-4">
                <label htmlFor="genreName"
                    className={`block mb-1 ${GenreFormDataError.name ? 'text-red-600' : ''}`}>
                    Name <span className="text-red-600" aria-hidden="true">*</span>
                </label>

                <input type="text" 
                    id="genreName" 
                    name="name"
                    value={GenreFormData.name} 
                    onChange={handleInputChange} 
                    onBlur={handleNameBlur}
                    required={true}
                    className={`w-full border rounded-md px-3 py-2 ${GenreFormDataError.name ? 'border-red-600' : 'border-gray-400'}`} 
                    { ...(GenreFormDataError.name && { "aria-invalid" : "true", "aria-describedby" : "genreNameError" }) }
                    />
                { GenreFormDataError.name && <div id="genreNameError" className="text-red-600">{GenreFormDataError.name}</div>}
            </div>

            <div className="mb-4">
                {
                    isFormProcessing ? (
                        <button type="submit" 
                            disabled 
                            className="flex flex-nowrap justify-center gap-3 w-full px-3 py-2 border border-violet-400 rounded-md bg-violet-400 font-semibold uppercase cursor-progress opacity-50">
                            <IconSpinner />
                            Saving...
                        </button>
                    ) : (
                        <button type="submit" 
                            className="w-full px-3 py-2 border border-violet-500 hover:border-violet-500 rounded-md bg-violet-400 hover:bg-violet-500 font-semibold">
                            Save
                        </button>
                    )
                }
            </div>
        </form>
    )
}