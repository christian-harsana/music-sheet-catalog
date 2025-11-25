import { createContext, useState } from "react";
import type { ReactNode } from "react";

type UIContextType = {
    isToastDisplayed: boolean,
    displayToast: () => void,
    hideToast: () => void
}

export const UIContext = createContext<UIContextType> ({
    isToastDisplayed: false,
    displayToast: () => {},
    hideToast: () => {}
});

export function UIProvider({children} : {children: ReactNode}) {

    const [isToastDisplayed, setIsToastDisplayed] = useState<boolean>(false);

    const displayToast = () => setIsToastDisplayed(true);
    const hideToast = () => setIsToastDisplayed(false);

    return(
        <UIContext.Provider value={{isToastDisplayed, displayToast, hideToast}}>
            {children}
        </UIContext.Provider>
    )
}
