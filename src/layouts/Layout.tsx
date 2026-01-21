import type { ReactNode } from "react";
import Logo from "../shared/components/Logo";
import Navigation from "./Navigation";

type LayoutProps = {
    heading: string,
    children: ReactNode
}

export default function Layout({heading, children}: LayoutProps) {

    return (
        <div className="flex flex-nowrap">
            <div className="h-screen basis-3xs p-5">
                <Logo />
                <Navigation />
            </div>

            <main className="h-screen basis-full bg-gray-50 text-gray-900">
                <div className="p-6">
                    <h1 className="font-semibold text-2xl mb-4">{heading}</h1>

                    <div className="mb-4">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}