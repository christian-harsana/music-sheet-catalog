import type { ComponentPropsWithRef } from "react";
import IconSpinner from "./IconSpinner";
import { twMerge } from "tailwind-merge";

type SelectProps<T> = Omit<ComponentPropsWithRef<'select'>, 'children'> & {
    options: T[];
    getOptionValue: (option: T) => string;
    getOptionLabel: (option: T) => string;
    placeholder?: string;
    placeholderValue?: string;
    loading?: boolean;
    invalid?: boolean;
};

export default function Select<T>(props: SelectProps<T>) {

    const {options, getOptionValue, getOptionLabel, placeholder = 'Please select', placeholderValue = '', loading = false, disabled = false, invalid, className, ...rest} = props;

    const baseClasses = 'block appearance-none w-full border rounded-md ps-3 pe-8 py-2 border-gray-500 bg-gray-50 focus-visible:outline-offset-2 focus-visible:outline-3 focus-visible:outline-violet-600 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';
    const baseIconClasses = 'absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none';
    
    const isDisabled = loading || disabled;

    const styleClasses = twMerge(
        baseClasses,
        invalid && 'border-red-600 focus-visible:outline-red-600', 
        className
    );

    const arrowIconClasses = twMerge(
        baseIconClasses,
        isDisabled && 'fill-gray-500'
    );

    return (
        <div className='relative w-full'>
            <select
                className={styleClasses}
                disabled={isDisabled}
                {...rest}
                aria-busy={loading}
                aria-invalid={invalid || undefined}>

                <option value={placeholderValue}>{placeholder}</option>
                {
                    options.map((option) => {
                        
                        const value = getOptionValue(option);
                        
                        return ( 
                            <option key={value} value={value}>
                                {getOptionLabel(option)}
                            </option>
                        )
                    })
                }  
            </select>

            {loading ? (
                <span className={baseIconClasses}>
                    <IconSpinner color='dark' />
                </span>
            ) : (
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 384 512'
                    aria-hidden='true'
                    width='10'
                    className={arrowIconClasses}
                >
                    {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                    <path d='M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160' />
                </svg>
            )}
        </div>
    )
}