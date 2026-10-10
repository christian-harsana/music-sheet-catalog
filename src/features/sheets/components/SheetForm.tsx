import { useState, useRef, useEffect } from 'react';
import { useUI } from '../../../contexts/uiContext';
import { useAuth } from '../../../contexts/authContext';
import Button from '../../../shared/components/Button';
import type { Sheet, SheetFormData } from '../types/sheet.type';
import type { SourceLookup } from '../../../features/sources/types/source.type';
import type { Level } from '../../../features/levels/types/level.type';
import type { Genre } from '../../../features/genres/types/genre.type';
import { useCreateSheet, useUpdateSheet } from '../hooks/sheetHooks';
import { KEYS } from '../../../shared/utils/constants';
import TextInput from '../../../shared/components/TextInput';
import Select from '../../../shared/components/Select';
import Checkbox from '../../../shared/components/Checkbox';

type SheetFormDataError = {
	[K in keyof SheetFormData]?: string;
};

type SheetFormDataTouched = {
	[K in keyof SheetFormData]?: boolean;
};

type SheetFormProp = {
	sheet?: Sheet;
	sourcesLookup: SourceLookup[];
	isLoadingSource: boolean;
	levelsLookup: Level[];
	isLoadingLevel: boolean;
	genresLookup: Genre[];
	isLoadingGenre: boolean;
	refreshData: () => void;
};

export default function SheetForm({
	sheet,
	refreshData,
	sourcesLookup,
	isLoadingSource,
	levelsLookup,
	isLoadingLevel,
	genresLookup,
	isLoadingGenre,
}: SheetFormProp) {
	const sheetId = sheet?.id ?? null;
	const {
		id: _id,
		sourceTitle: _sourceTitle,
		levelName: _levelName,
		genreName: _genreName,
		...formDefaultData
	} = sheet ?? {
		title: '',
		key: '',
		composer: '',
		sourceId: null,
		levelId: null,
		genreId: null,
		examPiece: false,
	};
	const [SheetFormData, setSheetFormData] = useState<SheetFormData>(formDefaultData);
	const [SheetFormDataError, setSheetFormDataError] = useState<SheetFormDataError>({});
	const [SheetFormDataTouched, setSheetFormDataTouched] = useState<SheetFormDataTouched>({});
	const { addToast, closeModal } = useUI();
	const { token } = useAuth();
	const titleInputRef = useRef<HTMLInputElement>(null);

	const { createSheet, isLoading: isCreatingSheet } = useCreateSheet();
	const { updateSheet, isLoading: isUpdatingSheet } = useUpdateSheet();
	const isLoading = isCreatingSheet || isUpdatingSheet;

	function validateField(field: string, value: string | number | boolean | null): string {
		switch (field) {
			case 'title': {
				const title: string = value as string;

				if (!title || title.trim().length < 1) return 'Name is required';
				break;
			}
		}

		return '';
	}

	function validateForm(SheetFormData: SheetFormData): SheetFormDataError {
		const formSubmissionError: SheetFormDataError = {};

		// Loop through the field and validate
		Object.keys(SheetFormData).forEach((name) => {
			const fieldName = name as keyof SheetFormData;
			const error = validateField(fieldName, SheetFormData[fieldName]);

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
			} else {
				value = e.target.value;
			}
		} else {
			if (name === 'examPiece') {
				value = e.target.checked;
			} else {
				value = e.target.value;
			}
		}

		// Set Form Data
		setSheetFormData((prev) => ({ ...prev, [name]: value }));

		// Set Validation
		if (SheetFormDataTouched[name]) {
			setSheetFormDataError((prev) => ({ ...prev, [name]: validateField(name, value) }));
		}
	};

	const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
		const name = e.target.name as keyof SheetFormData;
		const value = e.target.value;

		setSheetFormDataTouched((prev) => ({ ...prev, [name]: true }));
		setSheetFormDataError((prev) => ({ ...prev, [name]: validateField(name, value) }));
	};

	const handleSheetFormSubmit = async (
		e: React.FormEvent,
		sheetFormData: SheetFormData,
		sheetId: string | null,
	) => {
		e.preventDefault();

		// Validate the form
		const formSubmissionError: SheetFormDataError = validateForm(SheetFormData);

		// Check if error exist
		let isErrorExist = false;

		Object.keys(formSubmissionError).forEach((name) => {
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
				examPiece: true,
			});
		} else {
			// Reset form states
			setSheetFormDataError({});
			setSheetFormDataTouched({});

			if (!token) {
				addToast('Invalid token', 'error');
				return;
			}

			const result = !sheetId
				? await createSheet(sheetFormData, token)
				: await updateSheet(sheetId, sheetFormData, token);

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
		// Set focus to title input
		if (titleInputRef.current) {
			titleInputRef.current.focus();
		}
	}, []);

	return (
		<form onSubmit={(e) => handleSheetFormSubmit(e, SheetFormData, sheetId)}>
			<div className="mb-4">
				<label
					htmlFor="sheetTitle"
					className={`block mb-1 ${SheetFormDataError.title ? 'text-red-600' : ''}`}
				>
					Title{' '}
					<span className="text-red-600" aria-hidden="true">
						*
					</span>
				</label>

				<TextInput
					type="text"
					id="sheetTitle"
					name="title"
					value={SheetFormData.title}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					required
					ref={titleInputRef}
					invalid={!!SheetFormDataError.title}
					aria-describedby={SheetFormDataError.title ? 'sheetTitleError' : undefined}
				/>
				{SheetFormDataError.title && (
					<div id="sheetTitleError" className="mt-1 text-red-600 text-sm" aria-live='polite'>
						{SheetFormDataError.title}
					</div>
				)}
			</div>

			<div className="mb-4">
				<label htmlFor="sheetKey" className="block mb-1">
					Key
				</label>

				<Select 
					options={KEYS}
					getOptionLabel={(o) => o.label}
					getOptionValue={(o) => o.value}
					id="sheetKey"
					name="key"
					onChange={handleInputChange}
					value={SheetFormData.key ?? ''}
				/>				
			</div>

			<div className="mb-4">
				<label
					htmlFor="composer"
					className={`block mb-1 ${SheetFormDataError.composer ? 'text-red-600' : ''}`}
				>
					Composer
				</label>

				<TextInput
					type="text"
					id="sheetComposer"
					name="composer"
					value={SheetFormData.composer}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					invalid={!!SheetFormDataError.composer}
					aria-describedby={SheetFormDataError.composer ? 'sheetComposerError' : undefined}
				/>
				{SheetFormDataError.title && (
					<div id="sheetComposerError" className="mt-1 text-red-600 text-sm" aria-live='polite'>
						{SheetFormDataError.composer}
					</div>
				)}
			</div>

			<div className="mb-4">
				<label htmlFor="sheetSource" className="block mb-1">
					Source
				</label>

				<Select 
					options={sourcesLookup}
					getOptionLabel={(o) => o.title}
					getOptionValue={(o) => o.id}
					loading={isLoadingSource}
					id="sheetSource"
					name="sourceId"
					onChange={handleInputChange}
					value={SheetFormData.sourceId ?? ''}
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="sheetLevel" className="block mb-1">
					Level
				</label>

				<Select
					options={levelsLookup}
					getOptionLabel={(o) => o.name}
					getOptionValue={(o) => o.id}
					loading={isLoadingLevel}
					id="sheetLevel"
					name="levelId"
					onChange={handleInputChange}
					value={SheetFormData.levelId ?? ''}
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="sheetGenre" className="block mb-1">
					Genre
				</label>

				<Select
					options={genresLookup}
					getOptionLabel={(o) => o.name}
					getOptionValue={(o) => o.id}
					loading={isLoadingGenre}
					id="sheetGenre"
					name="genreId"
					onChange={handleInputChange}
					value={SheetFormData.genreId ?? ''}
				/>
			</div>

			<div className="mb-4">
				<Checkbox
					label='Exam piece'
					id="sheetExamPiece"
					name="examPiece"
					onChange={handleInputChange}
					checked={SheetFormData.examPiece ?? false}
				/>
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
