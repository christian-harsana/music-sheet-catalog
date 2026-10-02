import type { ComponentPropsWithRef, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import IconSpinner from "./IconSpinner";

type ButtonCommonProps = {
    children: ReactNode;
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium';
};

type ButtonAsButtonProps = ButtonCommonProps & 
    Omit<ComponentPropsWithRef<'button'>, 'type'> & {
    tag?: 'button';
    type?: 'submit' | 'button' | 'reset';
    loading?: boolean;
};

type ButtonAsLinkProps = ButtonCommonProps & 
    Omit<ComponentPropsWithRef<'a'>, 'href'> & {
    tag: 'a';
    href: string;
};

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

function getStyleClasses(
    fullWidth: ButtonCommonProps['fullWidth'], 
    variant: ButtonCommonProps['variant'], 
    size: ButtonCommonProps['size'],
    className: string | undefined) {

    const baseClasses = 'inline-flex flex-nowrap justify-center gap-3 border rounded-md focus:outline-3 focus:outline-offset-2 focus:outline-violet-500 font-semibold align-middle transition-transform not-disabled:cursor-pointer not-disabled:active:scale-[0.98]';
    const mediumClasses = 'px-4 py-2';
    const smallClasses = 'px-2 py-1 text-xs';
    const primaryClasses = 'border-violet-500 not-disabled:hover:border-violet-600 bg-violet-500 not-disabled:hover:bg-violet-600 not-disabled:active:bg-violet-700 text-gray-50'; 
    const secondaryClasses = 'border-violet-600 not-disabled:hover:border-violet-600 bg-transparent not-disabled:hover:bg-violet-600 not-disabled:active:bg-violet-700 text-violet-600 not-disabled:hover:text-gray-50';

    let styleClasses = baseClasses;

    if (fullWidth) {
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

    return twMerge(styleClasses, className);
}


export default function Button(props: ButtonProps) {

    if (props.tag === 'a') {

        const {children, fullWidth, variant, size, tag, href, target, rel, className, ...rest} = props;
        let styleClasses = getStyleClasses(fullWidth, variant, size, className);
        let relValue = rel ?? '';
        
        relValue = target === '_blank' ? `${relValue} noopener noreferrer`.trim() : relValue;
       
        return (
            <a 
                className={styleClasses}
                href={href}
                target={target}
                rel={relValue}
                {...rest}
            >
                {children}
            </a>
        )
    }

    const {children, fullWidth, variant, size, tag, type = 'button', loading, disabled, className, ...rest} = props;

    const isLoading = loading ?? false;
    const isDisabled = isLoading || (disabled ?? false);
    
    const loadingClasses = 'cursor-progress opacity-50';
    const disabledClasses = 'disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed';

    let styleClasses = getStyleClasses(fullWidth, variant, size, className);
    styleClasses = `${styleClasses} ${disabledClasses}`;

    if (isLoading) styleClasses = `${styleClasses} ${loadingClasses}`;

	return (
		<button
            type={type}
            className={styleClasses}
            disabled={isDisabled} 
            aria-busy={isLoading}
            {...rest}
            >
            {isLoading ? <IconSpinner/> : null}
            {children}
        </button>
	);
}