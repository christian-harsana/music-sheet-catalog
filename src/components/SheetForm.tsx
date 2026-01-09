import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from "react-router";
import { UIContext } from '../contexts/UIContext';
import { AuthContext } from '../contexts/AuthContext';
import { DataRefreshContext } from '../contexts/DataRefreshContext';
import IconSpinner from './IconSpinner';
import type { Sheet } from '../types/sheet.type';
import type { Genre } from '../types/genre.type';
import type { Level } from '../types/level.type';
import type { Source } from '../types/source.type';

type SheetFormData = {
    title: string,
    sourceId: string,
    levelId: string,
    genreId: string
}

type SheetFormDataError = {
    [K in keyof SheetFormData]?: string
}

type SheetFormDataTouched = {
    [K in keyof SheetFormData]?: boolean
}

type SheetFormProp = {
    sheet?: Sheet
}

const BASEURL = 'http://localhost:3000/';
const SHEETURL = `${BASEURL}api/sheet/`;
const GENREURL = `${BASEURL}api/genre/`;
const LEVELURL = `${BASEURL}api/level/`;
const SOURCEURL = `${BASEURL}api/source/`;

export default function SheetForm({sheet} : SheetFormProp) {

    const mode = sheet ? "edit" : "add";
    const sheetId = sheet?.id ?? null;
    const {id, sourceTitle, levelName, genreName, ...formDefaultData} = sheet ?? {title: "", sourceId: "", levelId: "", genreId: ""};
    const [SheetFormData, setSheetFormData] = useState<SheetFormData>(formDefaultData);
    const [SheetFormDataError, setSheetFormDataError] = useState<SheetFormDataError>({});
    const [SheetFormDataTouched, setSheetFormDataTouched] = useState<SheetFormDataTouched>({});
    const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);
    const [genreList, setGenreList] = useState<Genre[]>([]);
    const [sourceList, setSourceList] = useState<Source[]>([]);
    const [levelList, setLevelList] = useState<Level[]>([]);
    const { addToast, closeModal } = useContext(UIContext);
    const { token } = useContext(AuthContext);
    const { triggerRefresh } = useContext(DataRefreshContext);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    function validateField(field: string, value: string): string {

        switch(field) {
            case "title":
                if (value.trim().length < 1) return "Name is required";
                break;
        }

        return "";
    }


    function validateForm(SheetFormData: SheetFormData): SheetFormDataError {

        const formSubmissionError: SheetFormDataError = {};

        // Loop through the field and validate
        Object.keys(SheetFormData).forEach((name) => {

            const fieldName = name as keyof SheetFormData;
            let error = validateField(fieldName, SheetFormData[fieldName]);

            formSubmissionError[fieldName] = error;
        });

        return formSubmissionError;
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const value = e.target.value;
        const name = e.target.name as keyof SheetFormData;

        // Set Form Data
        setSheetFormData(prev => ({...prev, [name]: value}));

        // Set Validation
        if (SheetFormDataTouched[name]) {
            setSheetFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
        }
    }


    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {

        const name = e.target.name as keyof SheetFormData;
        const value = e.target.value;

        setSheetFormDataTouched(prev => ({...prev, [name]: true}));
        setSheetFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
    }


    const handleSheetFormSubmit = async (e: React.FormEvent, sheetFormData: SheetFormData, sheetId: string | null) => {

        e.preventDefault()

        setIsFormProcessing(true);

        // Validate the form
        const formSubmissionError: SheetFormDataError = validateForm(SheetFormData);
    
        // Check if error exist
        let isErrorExist = false;

        Object.keys(formSubmissionError).forEach(name => {
            isErrorExist = formSubmissionError[name as keyof SheetFormData]?.length ? true : false;
        });

        if (isErrorExist) {
            setSheetFormDataError(formSubmissionError);
            setSheetFormDataTouched({
                title: true,
                sourceId: true,
                levelId: true,
                genreId: true
            });
        }
        else {

            // Reset form states
            setSheetFormDataError({});
            setSheetFormDataTouched({});

            try {

                const method = mode === 'edit' ? 'PUT' : 'POST';
                const actionURL = mode === 'edit' ? `${SHEETURL}${sheetId}` : SHEETURL;

                const response = await fetch(actionURL, {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(sheetFormData)
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

        if (!token) return;

        // Fetch Genre
        const fetchGenres = async() => {

            try {
                const response = await fetch(`${GENREURL}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        addToast(result.error, "error");
                        localStorage.removeItem('music_sheet_catalog_token');
                        closeModal();
                        navigate('/login');
                        return;
                    }

                    addToast(result.error, "error");
                    return;
                }

                const resultData: Genre[] = result.data;

                setGenreList(resultData);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown Error";
                addToast(errorMessage, "error");
            }
        }

        // Fetch Levels
        const fetchLevels = async() => {

            try {
                const response = await fetch(`${LEVELURL}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        addToast(result.error, "error");
                        localStorage.removeItem('music_sheet_catalog_token');
                        closeModal();
                        navigate('/login');
                        return;
                    }

                    addToast(result.error, "error");
                    return;
                }

                const resultData: Level[] = result.data;

                setLevelList(resultData);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown Error";
                addToast(errorMessage, "error");
            }
        }

        // Fetch Sources
        const fetchSources = async() => {

            try {
                const response = await fetch(`${SOURCEURL}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        addToast(result.error, "error");
                        localStorage.removeItem('music_sheet_catalog_token');
                        closeModal();
                        navigate('/login');
                        return;
                    }

                    addToast(result.error, "error");
                    return;
                }

                const resultData: Source[] = result.data;

                setSourceList(resultData);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown Error";
                addToast(errorMessage, "error");
            }
        }

        fetchGenres();
        fetchLevels();
        fetchSources();

        // Set focus to name input
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [token]);


    return (
        <form onSubmit={(e) => handleSheetFormSubmit(e, SheetFormData, sheetId)}>
            <div className="mb-4">
                <label htmlFor="sheetTitle"
                    className={`block mb-1 ${SheetFormDataError.title ? 'text-red-600' : ''}`}>
                    Title <span className="text-red-600" aria-hidden="true">*</span>
                </label>

                <input type="text" 
                    id="sheetTitle" 
                    name="title"
                    value={SheetFormData.title} 
                    onChange={handleInputChange} 
                    onBlur={handleInputBlur}
                    required={true}
                    ref={titleInputRef}
                    className={`w-full border rounded-md px-3 py-2 ${SheetFormDataError.title ? 'border-red-600' : 'border-gray-400'} bg-gray-50`} 
                    { ...(SheetFormDataError.title && { "aria-invalid" : "true", "aria-describedby" : "genreNameError" }) }
                    />
                { SheetFormDataError.title && <div id="genreNameError" className="text-red-600">{SheetFormDataError.title}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="sheetSource" className="block mb-1">
                    Source
                </label>

                <div className="relative">
                    <select id="sheetSource"
                        name="sourceId"
                        onChange={handleInputChange}
                        value={SheetFormData.sourceId}
                        className="block appearance-none w-full border rounded-md ps-3 pe-8 py-2 border-gray-400 bg-gray-50">
                        <option value="">Please Select</option>
                        {
                            sourceList.map(source => 
                                ( <option key={`source-${source.id}`} value={source.id}>{source.title}</option> )
                            )
                        }
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" 
                        aria-hidden="true" 
                        width="10"
                        className="absolute top-3.5 right-3">
                        {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                        <path d="M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                    </svg>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="sheetLevel" className="block mb-1">
                    Level
                </label>
                
                <div className="relative">
                    <select id="sheetLevel"
                        name="levelId"
                        onChange={handleInputChange}
                        value={SheetFormData.levelId}
                        className="block appearance-none w-full border rounded-md ps-3 pe-8 py-2 border-gray-400 bg-gray-50">
                        <option value="">Please Select</option>
                        {
                            levelList.map(level => 
                                ( <option key={`level-${level.id}`} value={level.id}>{level.name}</option> )
                            )
                        }
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" 
                        aria-hidden="true" 
                        width="10"
                        className="absolute top-3.5 right-3">
                        {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                        <path d="M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                    </svg>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="sheetGenre" className="block mb-1">
                    Genre
                </label>
                
                <div className="relative">
                    <select id="sheetGenre"
                        name="genreId"
                        onChange={handleInputChange}
                        value={SheetFormData.genreId}
                        className="block appearance-none w-full border rounded-md ps-3 pe-8 py-2 border-gray-400 bg-gray-50">
                        <option value="">Please Select</option>
                        {
                            genreList.map(genre => 
                                ( <option key={`genre-${genre.id}`} value={genre.id}>{genre.name}</option> )
                            )
                        }
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" 
                        aria-hidden="true" 
                        width="10"
                        className="absolute top-3.5 right-3">
                        {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                        <path d="M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                    </svg>
                </div>
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