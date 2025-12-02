import { createContext, useState } from "react";
import type { ReactNode } from "react";

type UIContextType = {
    isToastDisplayed: boolean,
    isLoading: boolean,
    setIsToastDisplayed: React.Dispatch<React.SetStateAction<boolean>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const UIContext = createContext<UIContextType> ({
    isToastDisplayed: false,
    isLoading: false,
    setIsToastDisplayed: () => {},
    setIsLoading: () => {}
});

export function UIProvider({children} : {children: ReactNode}) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isToastDisplayed, setIsToastDisplayed] = useState<boolean>(false);

    return(
        <UIContext.Provider value={{isToastDisplayed, isLoading, setIsToastDisplayed, setIsLoading}}>
            {children}
        </UIContext.Provider>
    )
}
