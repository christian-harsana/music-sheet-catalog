import { useState, useContext, useRef, useEffect } from 'react';
import { UIContext } from '../contexts/UIContext';
import { AuthContext } from '../contexts/AuthContext';
import { DataRefreshContext } from '../contexts/DataRefreshContext';
import IconSpinner from './IconSpinner';
import type { Level } from '../types/level.type';

type LevelFormData = {
    name: string
}

type LevelFormDataError = {
    [K in keyof LevelFormData]?: string
}

type LevelFormDataTouched = {
    [K in keyof LevelFormData]?: boolean
}

type LevelFormProp = {
    level?: Level
}

const BASEURL = 'http://localhost:3000/';
const LEVELURL = `${BASEURL}api/level/`;


export default function LevelForm({level} : LevelFormProp) {

    const mode = level ? "edit" : "add";
    const LevelId = level?.id ?? null;
    const {id, ...formDefaultData} = level ?? {name: ""};

    const [levelFormData, setLevelFormData] = useState<LevelFormData>(formDefaultData);
    const [levelFormDataError, setLevelFormDataError] = useState<LevelFormDataError>({});
    const [levelFormDataTouched, setLevelFormDataTouched] = useState<LevelFormDataTouched>({});
    const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);
    const { addToast, closeModal } = useContext(UIContext);
    const { token } = useContext(AuthContext);
    const { triggerRefresh } = useContext(DataRefreshContext);
    const nameInputRef = useRef<HTMLInputElement>(null);

    function validateField(field: string, value: string): string {

        switch(field) {
            case "name":
                if (value.trim().length < 1) return "Name is required";
                break;
        }

        return "";
    }


    function validateForm(levelFormData: LevelFormData): LevelFormDataError {

        const formSubmissionError: LevelFormDataError = {};

        // Loop through the field and validate
        Object.keys(levelFormData).forEach((name) => {

            const fieldName = name as keyof LevelFormData;
            let error = validateField(fieldName, levelFormData[fieldName]);

            formSubmissionError[fieldName] = error;
        });

        return formSubmissionError;
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        const name = e.target.name as keyof LevelFormData;

        // Set Form Data
        setLevelFormData(prev => ({...prev, [name]: value}));

        // Set Validation
        if (levelFormDataTouched[name]) {
            setLevelFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
        }
    }


    const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>): void => {

        const name = e.target.name as keyof LevelFormData;
        const value = e.target.value;

        setLevelFormDataTouched(prev => ({...prev, [name]: true}));
        setLevelFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
    }


    const handleLevelFormSubmit = async (e: React.FormEvent, levelFormData: LevelFormData, levelId: string | null) => {

        e.preventDefault()

        setIsFormProcessing(true);

        // Validate the form
        const formSubmissionError: LevelFormDataError = validateForm(levelFormData);
    
        // Check if error exist
        let isErrorExist = false;

        Object.keys(formSubmissionError).forEach(name => {
            isErrorExist = formSubmissionError[name as keyof LevelFormData]?.length ? true : false;
        });

        if (isErrorExist) {
            setLevelFormDataError(formSubmissionError);
            setLevelFormDataTouched({name: true});
        }
        else {

            // Reset form states
            setLevelFormDataError({});
            setLevelFormDataTouched({});

            try {

                const method = mode === 'edit' ? 'PUT' : 'POST';
                const actionURL = mode === 'edit' ? `${LEVELURL}${levelId}` : LEVELURL;

                const response = await fetch(actionURL, {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(levelFormData)
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


    useEffect(() => {
        // Set focus to name input
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);


    return (
        <form onSubmit={(e) => handleLevelFormSubmit(e, levelFormData, LevelId)}>
            <div className="mb-4">
                <label htmlFor="LevelName"
                    className={`block mb-1 ${levelFormDataError.name ? 'text-red-600' : ''}`}>
                    Name <span className="text-red-600" aria-hidden="true">*</span>
                </label>

                <input type="text" 
                    id="LevelName" 
                    name="name"
                    value={levelFormData.name} 
                    onChange={handleInputChange} 
                    onBlur={handleNameBlur}
                    required={true}
                    ref={nameInputRef}
                    className={`w-full border rounded-md px-3 py-2 ${levelFormDataError.name ? 'border-red-600' : 'border-gray-400'} bg-gray-50`} 
                    { ...(levelFormDataError.name && { "aria-invalid" : "true", "aria-describedby" : "LevelNameError" }) }
                    />
                { levelFormDataError.name && <div id="LevelNameError" className="text-red-600">{levelFormDataError.name}</div>}
            </div>

            <div className="mt-4">
                {
                    isFormProcessing ? (
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