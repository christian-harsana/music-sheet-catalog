import { useState, useContext, useRef, useEffect } from 'react';
import { UIContext } from '../../../contexts/UIContext';
import { AuthContext }  from '../../../contexts/AuthContext';
import IconSpinner from '../../../shared/components/IconSpinner';
import type { Level, LevelFormData } from '../types/level.type';
import { useCreateLevel, useUpdateLevel } from '../hooks/levelHooks';

type LevelFormDataError = {
    [K in keyof LevelFormData]?: string
}

type LevelFormDataTouched = {
    [K in keyof LevelFormData]?: boolean
}

type LevelFormProps = {
    level?: Level,
    refreshData: () => void
}

export default function LevelForm({level, refreshData} : LevelFormProps) {

    const levelId = level?.id ?? null;
    const {id, ...formDefaultData} = level ?? {name: ""};
    const [levelFormData, setLevelFormData] = useState<LevelFormData>(formDefaultData);
    const [levelFormDataError, setLevelFormDataError] = useState<LevelFormDataError>({});
    const [levelFormDataTouched, setLevelFormDataTouched] = useState<LevelFormDataTouched>({});
    const { addToast, closeModal } = useContext(UIContext);
    const { token } = useContext(AuthContext);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const { createLevel, isLoading: isCreatingLevel } = useCreateLevel();
    const { updateLevel, isLoading: isUpdatingLevel } = useUpdateLevel();
    const isLoading = isCreatingLevel || isUpdatingLevel;


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


    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {

        const name = e.target.name as keyof LevelFormData;
        const value = e.target.value;

        setLevelFormDataTouched(prev => ({...prev, [name]: true}));
        setLevelFormDataError(prev => ({...prev, [name]: validateField(name, value)}));
    }


    const handleLevelFormSubmit = async (e: React.FormEvent, levelFormData: LevelFormData, levelId: string | null) => {

        e.preventDefault()

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

            if (!token) {
                addToast('Invalid token', 'error');
                return;
            }

            const result = !levelId ? await createLevel(levelFormData, token) : await updateLevel(levelId, levelFormData, token) 

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
        // Set focus to name input
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);


    return (
        <form onSubmit={(e) => handleLevelFormSubmit(e, levelFormData, levelId)}>
            <div className="mb-4">
                <label htmlFor="levelName"
                    className={`block mb-1 ${levelFormDataError.name ? 'text-red-600' : ''}`}>
                    Name <span className="text-red-600" aria-hidden="true">*</span>
                </label>

                <input type="text" 
                    id="levelName" 
                    name="name"
                    value={levelFormData.name} 
                    onChange={handleInputChange} 
                    onBlur={handleInputBlur}
                    required={true}
                    ref={nameInputRef}
                    className={`w-full border rounded-md px-3 py-2 ${levelFormDataError.name ? 'border-red-600' : 'border-gray-400'} bg-gray-50`} 
                    { ...(levelFormDataError.name && { "aria-invalid" : "true", "aria-describedby" : "levelNameError" }) }
                    />
                { levelFormDataError.name && <div id="levelNameError" className="text-red-600">{levelFormDataError.name}</div>}
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