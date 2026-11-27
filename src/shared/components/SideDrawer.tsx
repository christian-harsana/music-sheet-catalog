import { type ReactNode, useEffect, useRef, useId } from "react";
import { twMerge } from "tailwind-merge";

type SideDrawerProps = {
    title?: string;
    width?: 'narrow' | 'medium' | 'wide';
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function SideDrawer(props: SideDrawerProps) {

    const WIDTH_CLASSES = { narrow: 'w-xs', medium: 'w-md', wide: 'w-xl' } as const;
    const {title, width = 'medium', isOpen, onClose, children} = props;
    
    const widthClass = WIDTH_CLASSES[width];
    const drawerPanelClasses = 'flex h-full flex-col p-3';
    const drawerHeaderClasses = 'flex shrink-0 flex-nowrap gap-3 justify-between px-2 pb-2 border-b border-gray-300';
    const drawerTitleClasses = 'mb-0 font-semibold text-xl';
    const drawerCloseButtonClasses = 'flex justify-center items-center w-7 h-7 not-disabled:cursor-pointer rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-violet-500';
    const drawerBodyClasses = 'flex-1 overflow-y-auto overflow-x-hidden px-2 py-3';
    const dialogClasses = twMerge(
        'fixed inset-y-0 right-0 left-auto z-60 h-dvh max-h-dvh bg-gray-50 text-gray-900 overflow-x-hidden motion-reduce:transition-none',
        'transition-[display,overlay,translate] translate-x-full open:translate-x-0 duration-300 transition-discrete starting:open:translate-x-full',
        'backdrop:bg-black/75 backdrop:opacity-0',
        'backdrop:transition-[opacity] open:backdrop:opacity-100 backdrop:duration-300 backdrop:transition-discrete starting:open:backdrop:opacity-0 motion-reduce:backdrop:transition-none',
        widthClass
    );

    const titleId = useId();
    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleDrawerClose = () => {
        dialogRef.current?.close();
    }

    useEffect(() => {

        const drawer = dialogRef.current;
        if (!drawer) return;

        if (isOpen && !drawer.open) drawer.showModal();
        if (!isOpen && drawer.open) drawer.close();

    }, [isOpen]);

    return (
        <dialog 
            className={dialogClasses} 
            ref={dialogRef} 
            aria-labelledby={titleId}
            onClose={onClose}
            onClick={(e) => { if (e.target === e.currentTarget) handleDrawerClose() }}
        >
            <div className={drawerPanelClasses}>
                <header className={drawerHeaderClasses}>
                    <h2 className={drawerTitleClasses}>{title}</h2>
                    <button type="button" className={drawerCloseButtonClasses} onClick={handleDrawerClose}>
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
        </dialog>
    )
}