import { useState, useRef, useEffect } from 'react';
import { useUI } from '../../../contexts/uiContext';
import { useAuth } from '../../../contexts/authContext';
import { useCreateSource, useUpdateSource } from '../hooks/sourceHooks';
import Button from '../../../shared/components/Button';
import type { Source, SourceFormData } from '../types/source.type';
import TextInput from '../../../shared/components/TextInput';

type SourceFormDataError = {
	[K in keyof SourceFormData]?: string;
};

type SourceFormDataTouched = {
	[K in keyof SourceFormData]?: boolean;
};

type SourceFormProps = {
	source?: Source;
	refreshData: () => void;
};

export default function SourceForm({ source, refreshData }: SourceFormProps) {
	const sourceId = source?.id ?? null;
	const { id: _id, ...formDefaultData } = source ?? { title: '', author: '', format: '' };
	const [sourceFormData, setSourceFormData] = useState<SourceFormData>(formDefaultData);
	const [sourceFormDataError, setSourceFormDataError] = useState<SourceFormDataError>({});
	const [sourceFormDataTouched, setSourceFormDataTouched] = useState<SourceFormDataTouched>({});
	const { addToast, closeModal } = useUI();
	const { token } = useAuth();
	const titleInputRef = useRef<HTMLInputElement>(null);
	const { createSource, isLoading: isCreatingSource } = useCreateSource();
	const { updateSource, isLoading: isUpdatingSource } = useUpdateSource();
	const isLoading = isCreatingSource || isUpdatingSource;

	function validateField(field: string, value: string): string {
		switch (field) {
			case 'title':
				if (value.trim().length < 1) return 'Title is required';
				break;
		}

		return '';
	}

	function validateForm(SourceFormData: SourceFormData): SourceFormDataError {
		const formSubmissionError: SourceFormDataError = {};

		// Loop through the field and validate
		Object.keys(SourceFormData).forEach((name) => {
			const fieldName = name as keyof SourceFormData;
			const error = validateField(fieldName, SourceFormData[fieldName]);

			formSubmissionError[fieldName] = error;
		});

		return formSubmissionError;
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const name = e.target.name as keyof SourceFormData;

		// Set Form Data
		setSourceFormData((prev) => ({ ...prev, [name]: value }));

		// Set Validation
		if (sourceFormDataTouched[name]) {
			setSourceFormDataError((prev) => ({ ...prev, [name]: validateField(name, value) }));
		}
	};

	const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
		const name = e.target.name as keyof SourceFormData;
		const value = e.target.value;

		setSourceFormDataTouched((prev) => ({ ...prev, [name]: true }));
		setSourceFormDataError((prev) => ({ ...prev, [name]: validateField(name, value) }));
	};

	const handleSourceFormSubmit = async (
		e: React.FormEvent,
		SourceFormData: SourceFormData,
		sourceId: string | null,
	) => {
		e.preventDefault();

		// Validate the form
		const formSubmissionError: SourceFormDataError = validateForm(SourceFormData);

		// Check if error exist
		let isErrorExist = false;

		Object.keys(formSubmissionError).forEach((name) => {
			isErrorExist = formSubmissionError[name as keyof SourceFormData]?.length ? true : false;
		});

		if (isErrorExist) {
			setSourceFormDataError(formSubmissionError);
			setSourceFormDataTouched({
				title: true,
				author: true,
				format: true,
			});
		} else {
			// Reset form states
			setSourceFormDataError({});
			setSourceFormDataTouched({});

			if (!token) {
				addToast('Invalid token', 'error');
				return;
			}

			const result = !sourceId
				? await createSource(sourceFormData, token)
				: await updateSource(sourceId, sourceFormData, token);

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
		<form onSubmit={(e) => handleSourceFormSubmit(e, sourceFormData, sourceId)}>
			<div className="mb-4">
				<label
					htmlFor="sourceTitle"
					className={`block mb-1 ${sourceFormDataError.title ? 'text-red-600' : ''}`}
				>
					Title{' '}
					<span className="text-red-600" aria-hidden="true">
						*
					</span>
				</label>

				<TextInput
					type="text"
					id="sourceTitle"
					name="title"
					placeholder="i.e. book title, collection title, etc."
					value={sourceFormData.title}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					required
					ref={titleInputRef}
					invalid={!!sourceFormDataError.title}
					aria-describedby={sourceFormDataError.title ? 'sourceTitleError' : undefined}
				/>
				{sourceFormDataError.title && (
					<div id="sourceTitleError" className="mt-1 text-red-600 text-sm" aria-live='polite'>
						{sourceFormDataError.title}
					</div>
				)}
			</div>

			<div className="mb-4">
				<label
					htmlFor="sourceAuthor"
					className={`block mb-1 ${sourceFormDataError.author ? 'text-red-600' : ''}`}
				>
					Author
				</label>

				<TextInput
					type="text"
					id="sourceAuthor"
					name="author"
					placeholder="i.e. author name, composer name, etc."
					value={sourceFormData.author}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					invalid={!!sourceFormDataError.author}
					aria-describedby={sourceFormDataError.author ? 'sourceTitleError' : undefined}
				/>
				{sourceFormDataError.author && (
					<div id="sourceTitleError" className="mt-1 text-red-600 text-sm" aria-live='polite'>
						{sourceFormDataError.author}
					</div>
				)}
			</div>

			<div className="mb-4">
				<label
					htmlFor="sourceFormat"
					className={`block mb-1 ${sourceFormDataError.format ? 'text-red-600' : ''}`}
				>
					Format
				</label>

				<TextInput
					type="text"
					id="sourceFormat"
					name="format"
					placeholder="i.e. Print, Digital, etc."
					value={sourceFormData.format}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					invalid={!!sourceFormDataError.format}
					aria-describedby={sourceFormDataError.format ? 'sourceTitleError' : undefined}
				/>
				{sourceFormDataError.format && (
					<div id="sourceTitleError" className="mt-1 text-red-600 text-sm" aria-live='polite'>
						{sourceFormDataError.format}
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
