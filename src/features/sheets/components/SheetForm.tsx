import { useState, useContext, useRef, useEffect } from 'react';
import { UIContext } from '../../../contexts/UIContext';
import { AuthContext } from '../../../contexts/AuthContext';
import IconSpinner from '../../../shared/components/IconSpinner';
import type { Sheet, SheetFormData } from '../types/sheet.type';
import type { SourceLookup } from '../../../features/sources/types/source.type';
import type { Level } from '../../../features/levels/types/level.type';
import type { Genre } from '../../../features/genres/types/genre.type';
import { useCreateSheet, useUpdateSheet } from '../hooks/sheetHooks';
import { KEYS } from '../../../shared/utils/constants';


type SheetFormDataError = {
    [K in keyof SheetFormData]?: string
}

type SheetFormDataTouched = {
    [K in keyof SheetFormData]?: boolean
}

type SheetFormProp = {
    sheet?: Sheet,
    sourcesLookup: SourceLookup[],
    isLoadingSource: boolean,
    levelsLookup: Level[],
    isLoadingLevel: boolean,
    genresLookup: Genre[],
    isLoadingGenre: boolean,
    refreshData: () => void
}


export default function SheetForm({
    sheet, 
    refreshData, 
    sourcesLookup, 
    isLoadingSource, 
    levelsLookup, 
    isLoadingLevel, 
    genresLookup, 
    isLoadingGenre } : SheetFormProp) {

    const sheetId = sheet?.id ?? null;
    const {id, sourceTitle, levelName, genreName, ...formDefaultData} = sheet ?? {title: "", key: "", composer: "", sourceId: null, levelId: null, genreId: null, examPiece: false};
    const [SheetFormData, setSheetFormData] = useState<SheetFormData>(formDefaultData);
    const [SheetFormDataError, setSheetFormDataError] = useState<SheetFormDataError>({});
    const [SheetFormDataTouched, setSheetFormDataTouched] = useState<SheetFormDataTouched>({});
    const { addToast, closeModal } = useContext(UIContext);
    const { token } = useContext(AuthContext);
    const titleInputRef = useRef<HTMLInputElement>(null);
    
    const {createSheet, isLoading: isCreatingSheet} = useCreateSheet();
    const {updateSheet, isLoading: isUpdatingSheet} = useUpdateSheet();
    const isLoading = isCreatingSheet || isUpdatingSheet;


    function validateField(field: string, value: string | number | boolean | null): string {

        switch(field) {
            case "title":
                const title: string = value as string;

                if (!title || title.trim().length < 1) return "Name is required";
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

        let value: string | number | boolean;
        const name = e.target.name as keyof SheetFormData;

        if (e.target instanceof HTMLSelectElement) {

            if (name === 'sourceId' || name === 'levelId' || name === 'genreId') {
                value = parseInt(e.target.value);
            }
            else {
                value = e.target.value
            }
        }
        else {
            if (name === 'examPiece') {
                value = e.target.checked;
            }
            else {
                value = e.target.value;
            }
        }

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
                key: true,
                composer: true, 
                sourceId: true,
                levelId: true,
                genreId: true,
                examPiece: true
            });
        }
        else {

            // Reset form states
            setSheetFormDataError({});
            setSheetFormDataTouched({});

            if (!token) {
                addToast('Invalid token', 'error');
                return;
            }

            const result = !sheetId ? await createSheet(sheetFormData, token) : await updateSheet(sheetId, sheetFormData, token);

            if (result.success) {
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

        // Set focus to title input
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, []);


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
                    { ...(SheetFormDataError.title && { "aria-invalid" : "true", "aria-describedby" : "sheetTitleError" }) }
                    />
                { SheetFormDataError.title && <div id="sheetTitleError" className="text-red-600">{SheetFormDataError.title}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="sheetKey" className="block mb-1">Key</label>

                <div className="relative">
                    <select id="sheetKey"
                        name="key"
                        onChange={handleInputChange}
                        value={SheetFormData.key ?? ""}
                        className="block appearance-none w-full border rounded-md ps-3 pe-8 py-2 border-gray-400 bg-gray-50">
                        <option value="">Please Select</option>
                        {
                            KEYS.map((key, index) => 
                                ( <option key={`key-${index}`} value={key}>{key}</option> )
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
                <label htmlFor="composer"
                    className={`block mb-1 ${SheetFormDataError.composer ? 'text-red-600' : ''}`}>
                    Composer
                </label>

                <input type="text" 
                    id="sheetComposer" 
                    name="composer"
                    value={SheetFormData.composer} 
                    onChange={handleInputChange} 
                    onBlur={handleInputBlur}
                    className={`w-full border rounded-md px-3 py-2 ${SheetFormDataError.composer ? 'border-red-600' : 'border-gray-400'} bg-gray-50`} 
                    { ...(SheetFormDataError.composer && { "aria-invalid" : "true", "aria-describedby" : "sheetComposerError" }) }
                    />
                { SheetFormDataError.title && <div id="sheetComposerError" className="text-red-600">{SheetFormDataError.composer}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="sheetSource" className="block mb-1">
                    Source
                </label>

                <div className="relative">
                    <select id="sheetSource"
                        name="sourceId"
                        onChange={handleInputChange}
                        value={SheetFormData.sourceId ?? ""}
                        className="block appearance-none w-full border rounded-md ps-3 pe-8 py-2 border-gray-400 bg-gray-50"
                        disabled={isLoadingSource} >
                        <option value="">Please Select</option>
                        {
                            sourcesLookup.map((source: SourceLookup) => 
                                ( <option key={`source-${source.id}`} value={source.id}>{source.title}</option> )
                            )
                        }
                    </select>
                    { isLoadingSource? (
                        <span className="absolute top-3 right-3">
                            <IconSpinner color={"dark"} />
                        </span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" 
                            aria-hidden="true" 
                            width="10"
                            className="absolute top-3.5 right-3">
                            {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                            <path d="M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                        </svg>
                    )}
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
                        value={SheetFormData.levelId ?? ""}
                        className="block appearance-none w-full border rounded-md ps-3 pe-8 py-2 border-gray-400 bg-gray-50"
                        disabled={isLoadingLevel} >
                        <option value="">Please Select</option>
                        {
                            levelsLookup.map((level: Level) => 
                                ( <option key={`level-${level.id}`} value={level.id}>{level.name}</option> )
                            )
                        }
                    </select>
                    { isLoadingLevel? (
                        <span className="absolute top-3 right-3">
                            <IconSpinner color={"dark"} />
                        </span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" 
                            aria-hidden="true" 
                            width="10"
                            className="absolute top-3.5 right-3">
                            {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                            <path d="M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                        </svg>
                    )}
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
                        value={SheetFormData.genreId ?? ""}
                        className="block appearance-none w-full border rounded-md ps-3 pe-8 py-2 border-gray-400 bg-gray-50"
                        disabled={isLoadingGenre} >
                        <option value="">Please Select</option>
                        {
                            genresLookup.map((genre: Genre) => 
                                ( <option key={`genre-${genre.id}`} value={genre.id}>{genre.name}</option> )
                            )
                        }
                    </select>

                    { isLoadingGenre? (
                        <span className="absolute top-3 right-3">
                            <IconSpinner color={"dark"} />
                        </span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" 
                            aria-hidden="true" 
                            width="10"
                            className="absolute top-3.5 right-3">
                            {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                            <path d="M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                        </svg>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="sheetExamPiece" className='flex flex-nowrap items-start'>
                    <span className='mt-0.5 mr-2'>
                        <input type="checkbox"
                            id="sheetExamPiece"
                            name="examPiece"
                            onChange={handleInputChange}
                            checked={SheetFormData.examPiece ?? false}
                            className="block size-5 border rounded-md border-gray-400 bg-gray-50"/>
                    </span>
                    Exam piece
                </label>
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