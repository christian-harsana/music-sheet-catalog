import type { ComponentPropsWithRef } from "react"
import { twMerge } from "tailwind-merge";

type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
    label: string,
    invalid?: boolean
};


// NOTES:
// - The class checkbox-tick is defined at index.css
// - className prop value only applied to the input element of the checkbox

export default function Checkbox(props: CheckboxProps) {

    const {label, disabled, invalid, className, ...rest} = props;

    const inputClasses = twMerge(
        'checkbox-tick appearance-none block size-5 border rounded-md border-gray-500 bg-gray-50 checked:bg-violet-500 focus-visible:outline-offset-2 focus-visible:outline-3 focus-visible:outline-violet-600 disabled:bg-gray-100 disabled:checked:bg-gray-400 cursor-pointer disabled:cursor-not-allowed',
        invalid && 'border-red-600 focus-visible:outline-red-500',
        className 
    );

    const labelClasses = twMerge(
        'flex items-start gap-2 cursor-pointer',
        disabled && 'text-gray-500 cursor-not-allowed'
    );

    return (
        <label className={labelClasses}>
            <span className="mt-0.5">
                <input
                    type="checkbox"
                    className={inputClasses}
                    disabled={disabled}
                    {...rest}
                    aria-invalid={invalid || undefined}
                /> 
            </span>
            
            {label}
        </label>
    )
}