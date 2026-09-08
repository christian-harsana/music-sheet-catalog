import type { ReactNode } from 'react';
import IconSpinner from "./IconSpinner";


type ButtonProps = {
    children: ReactNode;
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium';
    tag?: 'button' | 'a';
    href?: string;
    target?: '_blank'
    type?: 'submit' | 'button';
    state?: 'working' | 'disabled';
    handleClick?: () => void;
};

export default function Button({children, fullWidth, tag, href, target, type, variant, size, state, handleClick}: ButtonProps) {

    const baseClasses = 'flex flex-nowrap justify-center gap-3 border rounded-md font-semibold';
    const mediumClasses = 'px-4 py-2';
    const smallClasses = 'px-3 py-2';
    const primaryClasses = 'border-violet-500 enabled:hover:border-violet-600 bg-violet-500 enabled:hover:bg-violet-600 text-gray-50'; 
    const secondaryClasses = 'border-violet-600 enabled:hover:border-violet-600 bg-transparent enabled:hover:bg-violet-600 text-violet-600 enabled:hover:text-gray-50';
    const workingClasses = 'cursor-progress opacity-50';
    const disabledClasses = 'opacity-50 disabled:cursor-not-allowed';

    let styleClasses = baseClasses;
    let isFullWidth = fullWidth ?? false;
    let isWorking = false;
    let isDisabled = false;
    let buttonType = type ?? "button";

    if (isFullWidth) {
       styleClasses = `${styleClasses} w-full`; 
    }

    switch(size) {
        case 'small':
            styleClasses = `${styleClasses} ${smallClasses}`;
            break;

        default:
            styleClasses = `${styleClasses} ${mediumClasses}`;
    }

    switch(variant) {
        case 'secondary':
            styleClasses = `${styleClasses} ${secondaryClasses}`;
            break;

        default:
            styleClasses = `${styleClasses} ${primaryClasses}`;
    }

    switch(state) {
        case 'working':
            styleClasses = `${styleClasses} ${workingClasses}`;
            isWorking = true;
            isDisabled = true;
            break;

        case 'disabled':
            styleClasses = `${styleClasses} ${disabledClasses}`;
            isDisabled = true;
            break; 
    }

    if (tag === 'a') {
        return (
            <a 
                href={href}
                target={target}
                className={styleClasses}
            >
                {children}
            </a>
        )
    }

	return (
		<button
            type={buttonType}
            onClick={handleClick}
            className={styleClasses}
            disabled={isDisabled}
            aria-busy={isWorking}
            >
            {isWorking ? <IconSpinner/> : null}
            {children}
        </button>
	);
}
