import { useContext, type ReactNode } from 'react';
import { UIContext } from '../../contexts/UIContext';

type ModalProps = {
    title?: string,
    children: ReactNode
}

export default function Modal({title, children}: ModalProps) {

    const {closeModal} = useContext(UIContext);

    return (
        <div className="w-[calc(100%-3rem)] max-w-md rounded-md overflow-hidden">
            <div className="flex flex-nowrap gap-3 justify-between px-5 py-3 bg-gray-300 text-gray-900">
                {title && <h3 className="font-semibold">{title}</h3>}
                <button type="button" onClick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="10" aria-hidden="true">
                        {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                        <path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/>
                    </svg>
                    <span className="sr-only">Close</span>
                </button>
            </div>
            <div className="px-5 py-4 bg-gray-50 text-gray-900">
                {children}
            </div>
        </div>
    )
}