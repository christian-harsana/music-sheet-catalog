import type { ComponentPropsWithRef } from "react"
import { twMerge } from "tailwind-merge";

type TextInputProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
    type?: 'text' | 'password' | 'email';
    invalid?: boolean;
};

export default function TextInput(props: TextInputProps) {
    
    const {type = 'text', invalid, className, disabled, ...rest} = props;
    
    const baseClasses = 'w-full min-w-0 border rounded-md px-3 py-2 bg-gray-50 focus-visible:outline-offset-2 focus-visible:outline-3 placeholder:text-gray-500'; 
    const disabledClasses = 'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';

    let styleClasses = `${baseClasses} ${disabledClasses}`;

    if (invalid) {
        styleClasses = `${styleClasses} border-red-600 focus-visible:outline-red-500`;
    }
    else {
        styleClasses = `${styleClasses} border-gray-500 focus-visible:outline-violet-600`;
    }

    styleClasses = twMerge(styleClasses, className);    

    return (
        <input
            type={type}
            className={styleClasses}
            disabled={disabled}
            {...rest}
            aria-invalid={invalid || undefined}
        />
    )
}