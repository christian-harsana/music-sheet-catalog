import { useEffect } from "react";
import type { NotificationType } from "../types/common.type";

type ToastProps = {
    id: string,
    text: string,
    type?: NotificationType,
    removeToast: (id: string) => void
}

export default function Toast({id, text, type, removeToast}: ToastProps) {

    const toastType = type? type : "success";
    const toastBaseClasses = "flex flex-nowrap gap-4 rounded-lg p-6";
    let toastClasses = "";
    let toastIcon: React.ReactNode = null;

    useEffect(() => {

        // Remove toast after certain duration
        const timer = setTimeout(() => {
            removeToast(id);
        }, 5000);

        return () => {
            clearTimeout(timer);
        }

    }, [id])

    switch (toastType) {
        case "error":
            toastClasses = `${toastBaseClasses} bg-red-700`;
            toastIcon = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" className="fill-white" aria-hidden="true">/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */<path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zm0-192a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.6 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"/></svg>);
            break;

        default:
            toastClasses = `${toastBaseClasses} bg-green-500`;
            toastIcon = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" className="fill-white" aria-hidden="true" >/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */<path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"/></svg>);
    }

    return (
        <div id={id} className={toastClasses}>
            {toastIcon}
            <p>{text}</p>
        </div>
    )
}