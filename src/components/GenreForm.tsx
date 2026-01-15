import { useState, useContext, useRef, useEffect } from 'react';
import { UIContext } from '../contexts/UIContext';
import { AuthContext } from '../contexts/AuthContext';
import { useCreateGenre, useUpdateGenre } from '../hooks/genreHooks';
import IconSpinner from './IconSpinner';
import type { Genre, GenreFormData } from '../types/genre.type';


type GenreFormDataError = {
    [K in keyof GenreFormData]?: string
}

type GenreFormDataTouched = {
    [K in keyof GenreFormData]?: boolean
}

type GenreFormProp = {
    genre?: Genre,
    refreshData: () => void
}


export default function GenreForm({genre, refreshData} : GenreFormProp) {

    const genreId = genre?.id ?? null;
    const {id, ...formDefaultData} = genre ?? {name: ""};
    const [genreFormData, setGenreFormData] = useState<GenreFormData>(formDefaultData);
    const [genreFormDataError, setGenreFormDataError] = useState<GenreFormDataError>({});
    const [genreFormDataTouched, setGenreFormDataTouched] = useState<GenreFormDataTouched>({});
    const {addToast, closeModal} = useContext(UIContext);
    const {token } = useContext(AuthContext);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const {createGenre, isLoading: isCreatingGenre} = useCreateGenre();
    const {updateGenre, isLoading: isUpdatingGenre} = useUpdateGenre();
    const isLoading = isCreatingGenre || isUpdatingGenre;


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
        if (genreFormDataTouched[name]) {
            setGenreFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
        }
    }


    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {

        const name = e.target.name as keyof GenreFormData;
        const value = e.target.value;

        setGenreFormDataTouched(prev => ({...prev, [name]: true}));
        setGenreFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
    }


    const handleGenreFormSubmit = async (e: React.FormEvent, genreFormData: GenreFormData, genreId: string | null) => {

        e.preventDefault()

        // Validate the form
        const formSubmissionError: GenreFormDataError = validateForm(genreFormData);
    
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

            if (!token) {
                addToast('Invalid token', 'error');
                return;
            }

            const result = !genreId ? await createGenre(genreFormData, token) : await updateGenre(genreId, genreFormData, token);

            if (result.status.toLowerCase() === "success") {
                addToast(result.message);
                refreshData();
                closeModal();
            }
            else {
                addToast(result.message, 'error');
            }
        }
    }

    useEffect(() => {
        // Set focus to name input
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);


    return (
        <form onSubmit={(e) => handleGenreFormSubmit(e, genreFormData, genreId)}>
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
                    onBlur={handleInputBlur}
                    required={true}
                    ref={nameInputRef}
                    className={`w-full border rounded-md px-3 py-2 ${genreFormDataError.name ? 'border-red-600' : 'border-gray-400'} bg-gray-50`} 
                    { ...(genreFormDataError.name && { "aria-invalid" : "true", "aria-describedby" : "genreNameError" }) }
                    />
                { genreFormDataError.name && <div id="genreNameError" className="text-red-600">{genreFormDataError.name}</div>}
            </div>

            <div className="mt-4">
                {
                    isLoading ? (
                        <button type="submit" 
                            disabled 
                            className="flex flex-nowrap justify-center gap-3 w-full px-3 py-2 border border-violet-500 rounded-md bg-violet-500 text-gray-50 font-semibold cursor-progress opacity-50">
                            <IconSpinner />
                            Saving...
                        </button>
                    ) : (
                        <button type="submit" 
                            className="w-full px-3 py-2 border border-violet-600 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50 font-semibold">
                            Save
                        </button>
                    )
                }
            </div>
        </form>
    )
}