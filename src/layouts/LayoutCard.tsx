import type { ReactNode } from "react";
import Logo from "../shared/components/Logo";

export default function LayoutCard({children} : {children : ReactNode}) {

    return (
        <main className="flex flex-col justify-center items-center min-h-screen">
                    
            <div className="mb-6 flex justify-center">
                <Logo />
            </div>
        
            <div className="w-[calc(100%-3rem)] max-w-md px-7 py-5 rounded-lg bg-gray-50 text-gray-950">
                {children}
            </div>
        </main>
    )
}