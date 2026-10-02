import { useState, useRef, useEffect } from 'react';
import { useUI } from '../../../contexts/uiContext';
import { useAuth } from '../../../contexts/authContext';
import TextInput from '../../../shared/components/TextInput';
import Button from '../../../shared/components/Button';
import type { Level, LevelFormData } from '../types/level.type';
import { useCreateLevel, useUpdateLevel } from '../hooks/levelHooks';

type LevelFormDataError = {
	[K in keyof LevelFormData]?: string;
};

type LevelFormDataTouched = {
	[K in keyof LevelFormData]?: boolean;
};

type LevelFormProps = {
	level?: Level;
	refreshData: () => void;
};

export default function LevelForm({ level, refreshData }: LevelFormProps) {
	const levelId = level?.id ?? null;
	const { id: _id, ...formDefaultData } = level ?? { name: '' };
	const [levelFormData, setLevelFormData] = useState<LevelFormData>(formDefaultData);
	const [levelFormDataError, setLevelFormDataError] = useState<LevelFormDataError>({});
	const [levelFormDataTouched, setLevelFormDataTouched] = useState<LevelFormDataTouched>({});
	const { addToast, closeModal } = useUI();
	const { token } = useAuth();
	const nameInputRef = useRef<HTMLInputElement>(null);
	const { createLevel, isLoading: isCreatingLevel } = useCreateLevel();
	const { updateLevel, isLoading: isUpdatingLevel } = useUpdateLevel();
	const isLoading = isCreatingLevel || isUpdatingLevel;

	function validateField(field: string, value: string): string {
		switch (field) {
			case 'name':
				if (value.trim().length < 1) return 'Name is required';
				break;
		}

		return '';
	}

	function validateForm(levelFormData: LevelFormData): LevelFormDataError {
		const formSubmissionError: LevelFormDataError = {};

		// Loop through the field and validate
		Object.keys(levelFormData).forEach((name) => {
			const fieldName = name as keyof LevelFormData;
			const error = validateField(fieldName, levelFormData[fieldName]);

			formSubmissionError[fieldName] = error;
		});

		return formSubmissionError;
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const name = e.target.name as keyof LevelFormData;

		// Set Form Data
		setLevelFormData((prev) => ({ ...prev, [name]: value }));

		// Set Validation
		if (levelFormDataTouched[name]) {
			setLevelFormDataError((prev) => ({ ...prev, [name]: validateField(name, value) }));
		}
	};

	const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
		const name = e.target.name as keyof LevelFormData;
		const value = e.target.value;

		setLevelFormDataTouched((prev) => ({ ...prev, [name]: true }));
		setLevelFormDataError((prev) => ({ ...prev, [name]: validateField(name, value) }));
	};

	const handleLevelFormSubmit = async (
		e: React.FormEvent,
		levelFormData: LevelFormData,
		levelId: string | null,
	) => {
		e.preventDefault();

		// Validate the form
		const formSubmissionError: LevelFormDataError = validateForm(levelFormData);

		// Check if error exist
		let isErrorExist = false;

		Object.keys(formSubmissionError).forEach((name) => {
			isErrorExist = formSubmissionError[name as keyof LevelFormData]?.length ? true : false;
		});

		if (isErrorExist) {
			setLevelFormDataError(formSubmissionError);
			setLevelFormDataTouched({ name: true });
		} else {
			// Reset form states
			setLevelFormDataError({});
			setLevelFormDataTouched({});

			if (!token) {
				addToast('Invalid token', 'error');
				return;
			}

			const result = !levelId
				? await createLevel(levelFormData, token)
				: await updateLevel(levelId, levelFormData, token);

			if (result.success) {
				addToast(result.message);
				refreshData();
				closeModal();
			} else {
				addToast(result.message, 'error');
			}
		}
	};

	useEffect(() => {
		// Set focus to name input
		if (nameInputRef.current) {
			nameInputRef.current.focus();
		}
	}, []);

	return (
		<form onSubmit={(e) => handleLevelFormSubmit(e, levelFormData, levelId)}>
			<div className="mb-4">
				<label
					htmlFor="levelName"
					className={`block mb-1 ${levelFormDataError.name ? 'text-red-600' : ''}`}
				>
					Name{' '}
					<span className="text-red-600" aria-hidden="true">
						*
					</span>
				</label>

				<TextInput
					type="text"
					id="levelName"
					name="name"
					value={levelFormData.name}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					required
					ref={nameInputRef}
					invalid={!!levelFormDataError.name}
					aria-describedby={levelFormDataError.name ? 'levelNameError' : undefined}
				/>
				{levelFormDataError.name && (
					<div id="levelNameError" className="mt-1 text-red-600 text-sm" aria-live='polite'>
						{levelFormDataError.name}
					</div>
				)}
			</div>

			<div className="mt-4">
				<Button
					fullWidth={true}
					type="submit"
					loading={isLoading}>
					{isLoading ? "Saving..." : "Save"}
				</Button>
			</div>
		</form>
	);
}
