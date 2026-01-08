import { useContext, type ReactNode } from 'react';
import { UIContext } from '../contexts/UIContext';

type ModalProps = {
    title?: string,
    children: ReactNode
}

export default function Modal({title, children}: ModalProps) {

    const {closeModal} = useContext(UIContext);

    return (
        <div aria-live="polite">
            <div className="flex flex-nowrap">
                {title && <h3>{title}</h3>}
                <button type="button" onClick={closeModal}>
                    Close
                </button>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}