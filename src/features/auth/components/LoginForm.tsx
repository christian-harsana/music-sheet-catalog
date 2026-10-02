import { useState, type ChangeEvent, type FocusEvent } from 'react';
import { useAuth } from '../../../contexts/authContext';
import { useError } from '../../../contexts/errorContext';
import { useUI } from '../../../contexts/uiContext';
import { api } from '../../../shared/utils/api';
import type { AuthUser } from '../../../shared/types/common.type';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';

type loginFormDataType = {
	email: string;
	password: string;
};

type loginFormErrorType = {
	[K in keyof loginFormDataType]?: string;
};

type loginFieldTouchedType = {
	[K in keyof loginFormDataType]?: boolean;
};

export default function LoginForm() {
	const { login } = useAuth();
	const { addToast } = useUI();
	const [loginFormData, setLoginFormData] = useState<loginFormDataType>({
		email: '',
		password: '',
	});
	const [loginFormError, setLoginFormError] = useState<loginFormErrorType>({});
	const [loginFieldTouched, setLoginFieldTouched] = useState<loginFieldTouchedType>({});
	const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);
	const { handleError } = useError();

	function validateField(name: string, value: string): string {
		const error = '';

		switch (name) {
			case 'email':
				if (value.length < 1) return 'Email is required';
				break;

			case 'password':
				if (value.length < 1) return 'Password is required';
				break;
		}

		return error;
	}

	function validateForm(loginFormData: loginFormDataType) {
		const submissionError: loginFormErrorType = {};

		Object.keys(loginFormData).forEach((name) => {
			const fieldName = name as keyof loginFormDataType;
			const error = validateField(name, loginFormData[fieldName]);

			submissionError[fieldName] = error;
		});

		return submissionError;
	}

	function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
		const value = e.target.value;
		const name = e.target.name as keyof loginFormDataType;

		setLoginFormData((prev) => ({ ...prev, [name]: value }));

		if (loginFieldTouched[name]) {
			setLoginFormError((prev) => ({ ...prev, [name]: validateField(name, value) }));
		}
	}

	function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
		const name = e.target.name as keyof loginFormDataType;
		const value = e.target.value;

		setLoginFieldTouched((prev) => ({ ...prev, [name]: true }));
		setLoginFormError((prev) => ({ ...prev, [name]: validateField(name, value) }));
	}

	async function handleLoginFormSubmit(e: React.FormEvent, loginFormData: loginFormDataType) {
		e.preventDefault();

		setIsFormProcessing(true);

		// Validate Form
		const formSubmissionError: loginFormErrorType = validateForm(loginFormData);
		let isErrorExist = false;

		// Check if there is any error
		Object.keys(loginFormData).forEach((name) => {
			isErrorExist = formSubmissionError[name as keyof loginFormDataType]?.length ? true : false;
		});

		if (isErrorExist) {
			// Update form states
			setLoginFormError(formSubmissionError);
			setLoginFieldTouched({
				email: true,
				password: true,
			});
			setIsFormProcessing(false);
		} else {
			// Update form states
			setLoginFormError({});
			setLoginFieldTouched({});

			try {
				const response = await api.post(`auth/login`, loginFormData);
				const result = await response.json();

				// On Success, store token to Context and Local Storage
				const user: AuthUser = {
					id: result.data.userId,
					email: result.data.email,
					name: result.data.name,
				};

				// Store user to Context and local Storage
				login(user, result.data.token);
			} catch (error: unknown) {
				handleError(error, {
					onError: (message) => addToast(message, 'error'),
				});
			} finally {
				setIsFormProcessing(false);
			}
		}
	}

	return (
		<form onSubmit={(e) => handleLoginFormSubmit(e, loginFormData)}>
			<h1 className="mb-4 font-bold text-2xl text-center uppercase">Login</h1>

			<div className="mb-4">
				<label
					htmlFor="email"
					className={`block mb-1 ${loginFormError.email ? 'text-red-600' : ''}`}
				>
					Email
				</label>

				<TextInput
					id="email"
					type="email"
					name="email"
					value={loginFormData.email}
					onChange={(e) => handleInputChange(e)}
					onBlur={(e) => handleInputBlur(e)}
					required
					invalid={!!loginFormError.email}
					aria-describedby={loginFormError.email ? "emailError" : undefined}
				/>
				{loginFormError.email && (
					<div id="emailError" className="mt-1 text-red-600 text-sm" aria-live="polite">
						{loginFormError.email}
					</div>
				)}
			</div>

			<div className="mb-4">
				<label
					htmlFor="password"
					className={`block mb-1 ${loginFormError.password ? 'text-red-600' : ''}`}
				>
					Password
				</label>
				<TextInput
					id="password"
					type="password"
					name="password"
					value={loginFormData.password}
					onChange={(e) => handleInputChange(e)}
					onBlur={(e) => handleInputBlur(e)}
					required
					invalid={!!loginFormError.password}
					aria-describedby={loginFormError.password ? "passwordError" : undefined}
				/>
				{loginFormError.password && (
					<div id="passwordError" className="mt-1 text-red-600 text-sm" aria-live="polite">
						{loginFormError.password}
					</div>
				)}
			</div>

			<div className="mb-4">
				<Button
					fullWidth={true}
					type="submit"
					loading={isFormProcessing}
					className="uppercase">
					{isFormProcessing ? "Login..." : "Login"}
				</Button>
			</div>

			<p className="mb-4 text-center">
				{/* Don't have an account? <Link to="/signup" className="text-sm text-violet-500 font-semibold underline hover:no-underline">Sign Up</Link> */}
				<em>
					For demonstration purpose you may use the following email: <strong>user@demo.app</strong>{' '}
					password: <strong>Demo1234</strong>
				</em>
			</p>
		</form>
	);
}
