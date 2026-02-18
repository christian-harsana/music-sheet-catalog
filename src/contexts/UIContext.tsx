import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { NotificationType } from "../shared/types/common.type";
import Toast from "../shared/components/Toast";

type Notification = {
    id: string,
    message: string,
    type: NotificationType,
}

type UIContextType = { 
    addToast: (message: string, type?: NotificationType) => void,
    removeToast: (id: string) => void,
    showModal: (content: ReactNode) => void,
    closeModal: () => void
}

export const UIContext = createContext<UIContextType> ({
    addToast: () => {},
    removeToast: () => {},
    showModal: () => {},
    closeModal: () => {}
});

type ToastContainerProps = {
    notificationList: Notification[],
    handleRemoveToast: (id: string) => void
}

function ToastContainer({notificationList, handleRemoveToast} : ToastContainerProps ) {

    return(
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2" aria-live="polite">
            {
                notificationList.map(notification => {
                    
                    return(
                        <Toast key={notification.id}
                            id={notification.id} 
                            text={notification.message}
                            type={notification.type}
                            removeToast={handleRemoveToast} 
                        />
                    )
                })
            }
        </div>
    )
};


function ModalOverlay({children}: {children: ReactNode}) {

    return (
        <div className="fixed top-0 left-0 z-30 flex justify-center items-center w-screen h-screen bg-black/75" aria-live="polite">
            {children}
        </div>
    )
}


export function UIProvider({children} : {children: ReactNode}) {

    const [notificationList, setnotificationList] = useState<Notification[]>([]);
    const [modal, setModal] = useState<ReactNode>(null);

    const addToast = (message: string, type: NotificationType = "success") => {

        const newToast: Notification = {
            id: self.crypto.randomUUID(),
            message: message,
            type: type
        }

        setnotificationList(prev => [...prev, newToast]);
    };

    const removeToast = (id: string) => {
        setnotificationList(prev => prev.filter(toast => toast.id !== id));
    };

    const showModal = (content: ReactNode) => {
        setModal(content);
    }

    const closeModal = () => {
        setModal(null);
    }

    return(
        <UIContext.Provider value={{addToast, removeToast, showModal, closeModal}}>
            {children}
            { modal && <ModalOverlay>{modal}</ModalOverlay>}
            { notificationList && <ToastContainer notificationList={notificationList} handleRemoveToast={removeToast} /> }
        </UIContext.Provider>
    )
}
