import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type SideDrawerProps = {
    title?: string;
    width?: 'narrow' | 'medium' | 'wide';
    isOpen: boolean;
    handleClose: () => void;
    children: ReactNode;
}

export default function SideDrawer(props: SideDrawerProps) {

    const {title, width = 'medium', isOpen, handleClose, children} = props;

    let widthClass = '';

    switch (width) {
        case 'narrow':
            widthClass = 'w-xs';
            break;

        case 'medium': 
            widthClass = 'w-md';
            break;

        case 'wide':
            widthClass = 'w-xl';
            break;
    }

    const drawerContainerClasses = twMerge(
        'fixed inset-0 z-60 w-screen h-screen transition-[visibility] duration-300',
        isOpen ? 'visible' : 'invisible pointer-events-none'
    );

    const drawerOverlayClasses = twMerge(
        'absolute inset-0 z-10 w-screen h-screen bg-black/75 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0'
    );

    const drawerPanelClasses = twMerge(
        'absolute top-0 right-0 z-20 h-screen p-3 bg-gray-50 text-gray-900 overflow-y-auto overflow-x-hidden transition-transform duration-300',
        widthClass,
        isOpen ? 'translate-x-0' : 'translate-x-full'
    );

    const drawerHeaderClasses = 'flex flex-nowrap gap-3 justify-between px-2 pb-2 border-b border-gray-300';
    const drawerTitleClasses = 'mb-0 font-semibold text-xl';
    const drawerBodyClasses = 'relative px-2 py-3'

    return (
        // Side Drawer Container
        <div className={drawerContainerClasses} aria-hidden={!isOpen}>

            {/* Overlay */}
            <div className={drawerOverlayClasses} onClick={handleClose}></div>

            {/* Drawer Panel */}
            <div className={drawerPanelClasses} >
                <header className={drawerHeaderClasses}>
                    <h3 className={drawerTitleClasses}>{title}</h3>
                    <button type="button" className="flex justify-center items-center w-7 h-7 not-disabled:cursor-pointer rounded-full focus:outline-3 focus:outline-offset-2 focus:outline-violet-500" onClick={handleClose}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                            width="15"
                            aria-hidden="true"
                            className="fill-gray-500"
                        >
                            {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                            <path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z" />
                        </svg>
                        <span className="sr-only">Close</span>
                    </button>
                </header>

                <div className={drawerBodyClasses}>
                    {children}
                </div>
            </div>
        </div>
    )
}