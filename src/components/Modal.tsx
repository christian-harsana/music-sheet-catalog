import { type ReactNode } from 'react';

type ModalProps = {
    title: string,
    handleCloseModal: () => void,
    children: ReactNode
}

export default function Modal({title, handleCloseModal, children}: ModalProps) {

    return (
        <div aria-live="polite">
            <div className="flex">
                <h3>{title}</h3>
                <button type="button" onClick={handleCloseModal}>
                    Close
                </button>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}