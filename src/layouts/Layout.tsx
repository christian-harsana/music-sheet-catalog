import type { ReactNode } from "react";
import Logo from "../shared/components/Logo";
import Navigation from "./Navigation";

type LayoutProps = {
    heading: string,
    children: ReactNode
}

export default function Layout({heading, children}: LayoutProps) {

    return (
        <div className="flex flex-col flex-nowrap h-screen lg:flex-row">
            <div className="fixed top-0 left-0 z-50 flex flex-row flex-nowrap justify-between items-center w-full h-14 bg-gray-950 lg:relative lg:overflow-y-auto lg:flex-col lg:items-start lg:justify-start lg:shrink-0 lg:w-3xs lg:h-full">
                <div className="ps-4 lg:px-5 lg:py-5 lg:w-full">
                    <Logo />
                </div>
                <div className="pe-4 lg:pe-0 lg:w-full">
                    <Navigation />
                </div>
            </div>

            <main className="grow pt-14 bg-gray-50 text-gray-900 lg:pt-0 lg:overflow-y-auto">
                <div className="px-4 py-6 lg:px-6">
                    <h1 className="font-semibold text-2xl mb-4">{heading}</h1>

                    <div className="mb-4">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}