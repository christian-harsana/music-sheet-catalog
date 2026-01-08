import { createContext, useState, type ReactNode } from "react";


type DataRefreshContextType = {
    refreshTrigger: number,
    triggerRefresh: () => void
}

export const DataRefreshContext = createContext<DataRefreshContextType> ({
    refreshTrigger: 0,
    triggerRefresh: () => {} 
});


export function DataRefreshProvider({children}: {children: ReactNode}) {

    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <DataRefreshContext.Provider value={{refreshTrigger, triggerRefresh}}>
            {children}
        </DataRefreshContext.Provider>
    )
}