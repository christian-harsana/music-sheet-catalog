import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { NotificationType } from "../types/common.type";
import Toast from "../components/Toast";

type Notification = {
    id: string,
    message: string,
    type: NotificationType,
}

type UIContextType = { 
    addToast: (message: string, type?: NotificationType) => void,
    removeToast: (id: string) => void,
}

export const UIContext = createContext<UIContextType> ({
    addToast: () => {},
    removeToast: () => {}
});

type ToastContainerProps = {
    notificationList: Notification[],
    handleRemoveToast: (id: string) => void
}

export function ToastContainer({notificationList, handleRemoveToast} : ToastContainerProps ) {

    return(
        <div className="fixed bottom-15 right-15 flex flex-col gap-2" aria-live="polite">
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


export function UIProvider({children} : {children: ReactNode}) {

    const [notificationList, setnotificationList] = useState<Notification[]>([]);

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

    return(
        <UIContext.Provider value={{addToast, removeToast}}>
            {children}
            { notificationList && <ToastContainer notificationList={notificationList} handleRemoveToast={removeToast} /> }
        </UIContext.Provider>
    )
}
