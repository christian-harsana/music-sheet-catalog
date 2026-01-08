import { useState, useContext, useRef, useEffect } from 'react';
import { UIContext } from '../contexts/UIContext';
import { AuthContext } from '../contexts/AuthContext';
import { DataRefreshContext } from '../contexts/DataRefreshContext';
import IconSpinner from './IconSpinner';
import type { Source } from '../types/source.type';

type SourceFormData = {
    title: string,
    author: string,
    format: string
}

type SourceFormDataError = {
    [K in keyof SourceFormData]?: string
}

type SourceFormDataTouched = {
    [K in keyof SourceFormData]?: boolean
}

type SourceFormProp = {
    source?: Source
}

const BASEURL = 'http://localhost:3000/';
const SOURCEURL = `${BASEURL}api/source/`;


export default function SourceForm({source} : SourceFormProp) {

    const mode = source ? "edit" : "add";
    const sourceId = source?.id ?? null;
    const {id, ...formDefaultData} = source ?? {title: "", author: "", format: ""};

    const [SourceFormData, setSourceFormData] = useState<SourceFormData>(formDefaultData);
    const [SourceFormDataError, setSourceFormDataError] = useState<SourceFormDataError>({});
    const [SourceFormDataTouched, setSourceFormDataTouched] = useState<SourceFormDataTouched>({});
    const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);
    const { addToast, closeModal } = useContext(UIContext);
    const { token } = useContext(AuthContext);
    const { triggerRefresh } = useContext(DataRefreshContext);
    const titleInputRef = useRef<HTMLInputElement>(null);

    function validateField(field: string, value: string): string {

        switch(field) {
            case "title":
                if (value.trim().length < 1) return "Title is required";
                break;
        }

        return "";
    }


    function validateForm(SourceFormData: SourceFormData): SourceFormDataError {

        const formSubmissionError: SourceFormDataError = {};

        // Loop through the field and validate
        Object.keys(SourceFormData).forEach((name) => {

            const fieldName = name as keyof SourceFormData;
            let error = validateField(fieldName, SourceFormData[fieldName]);

            formSubmissionError[fieldName] = error;
        });

        return formSubmissionError;
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        const name = e.target.name as keyof SourceFormData;

        // Set Form Data
        setSourceFormData(prev => ({...prev, [name]: value}));

        // Set Validation
        if (SourceFormDataTouched[name]) {
            setSourceFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
        }
    }


    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {

        const name = e.target.name as keyof SourceFormData;
        const value = e.target.value;

        setSourceFormDataTouched(prev => ({...prev, [name]: true}));
        setSourceFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
    }


    const handleSourceFormSubmit = async (e: React.FormEvent, SourceFormData: SourceFormData, sourceId: string | null) => {

        e.preventDefault()

        setIsFormProcessing(true);

        // Validate the form
        const formSubmissionError: SourceFormDataError = validateForm(SourceFormData);
    
        // Check if error exist
        let isErrorExist = false;

        Object.keys(formSubmissionError).forEach(name => {
            isErrorExist = formSubmissionError[name as keyof SourceFormData]?.length ? true : false;
        });

        if (isErrorExist) {
            setSourceFormDataError(formSubmissionError);
            setSourceFormDataTouched({
                title: true,
                author: true, 
                format: true
            });
        }
        else {

            // Reset form states
            setSourceFormDataError({});
            setSourceFormDataTouched({});

            try {

                const method = mode === 'edit' ? 'PUT' : 'POST';
                const actionURL = mode === 'edit' ? `${SOURCEURL}${sourceId}` : SOURCEURL;

                const response = await fetch(actionURL, {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(SourceFormData)
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
        // Set focus to title input
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, []);


    return (
        <form onSubmit={(e) => handleSourceFormSubmit(e, SourceFormData, sourceId)}>
            <div className="mb-4">
                <label htmlFor="sourceTitle"
                    className={`block mb-1 ${SourceFormDataError.title ? 'text-red-600' : ''}`}>
                    Title <span className="text-red-600" aria-hidden="true">*</span>
                </label>

                <input type="text" 
                    id="sourceTitle" 
                    name="title"
                    value={SourceFormData.title} 
                    onChange={handleInputChange} 
                    onBlur={handleInputBlur}
                    required={true}
                    ref={titleInputRef}
                    className={`w-full border rounded-md px-3 py-2 ${SourceFormDataError.title ? 'border-red-600' : 'border-gray-400'} bg-gray-50`} 
                    { ...(SourceFormDataError.title && { "aria-invalid" : "true", "aria-describedby" : "sourceTitleError" }) }
                    />
                { SourceFormDataError.title && <div id="sourceTitleError" className="text-red-600">{SourceFormDataError.title}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="sourceAuthor"
                    className={`block mb-1 ${SourceFormDataError.author ? 'text-red-600' : ''}`}>
                    Author
                </label>

                <input type="text" 
                    id="sourceAuthor" 
                    name="author"
                    value={SourceFormData.author} 
                    onChange={handleInputChange} 
                    onBlur={handleInputBlur}
                    className={`w-full border rounded-md px-3 py-2 ${SourceFormDataError.author ? 'border-red-600' : 'border-gray-400'} bg-gray-50`} 
                    { ...(SourceFormDataError.author && { "aria-invalid" : "true", "aria-describedby" : "sourceTitleError" }) }
                    />
                { SourceFormDataError.author && <div id="sourceTitleError" className="text-red-600">{SourceFormDataError.author}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="sourceFormat"
                    className={`block mb-1 ${SourceFormDataError.format ? 'text-red-600' : ''}`}>
                    Format
                </label>

                <input type="text" 
                    id="sourceFormat" 
                    name="format"
                    value={SourceFormData.format} 
                    onChange={handleInputChange} 
                    onBlur={handleInputBlur}
                    className={`w-full border rounded-md px-3 py-2 ${SourceFormDataError.format ? 'border-red-600' : 'border-gray-400'} bg-gray-50`} 
                    { ...(SourceFormDataError.format && { "aria-invalid" : "true", "aria-describedby" : "sourceTitleError" }) }
                    />
                { SourceFormDataError.format && <div id="sourceTitleError" className="text-red-600">{SourceFormDataError.format}</div>}
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