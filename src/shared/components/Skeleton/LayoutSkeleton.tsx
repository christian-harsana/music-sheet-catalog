export default function LayoutSkeleton() {

    return(
        <div className="flex flex-col flex-nowrap h-screen lg:flex-row">
            <div className="fixed top-0 left-0 z-50 flex flex-row flex-nowrap justify-between items-center w-full h-14 overflow-hidden bg-gray-950 lg:relative lg:overflow-y-auto lg:flex-col lg:items-start lg:justify-start lg:shrink-0 lg:w-3xs lg:h-full">
                <div className="px-4 lg:px-5 lg:py-5 w-full">
                    <div className="my-2 h-6 w-1/2 max-w-xs rounded bg-gray-200 animate-pulse"></div>
                </div>
                <div className="hidden w-full lg:block">
                    <div className="mb-4 px-4 lg:px-5">
                        <div className="my-2 h-6 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="my-2 h-6 w-full rounded bg-gray-200 animate-pulse"></div>
                    </div>

                    <div className="mb-4 px-4 lg:px-5">
                        <div className="mb-2 h-6 w-2/3 rounded bg-gray-200 animate-pulse"></div>
                        <div className="my-2 h-6 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="my-2 h-6 w-full rounded bg-gray-200 animate-pulse"></div>
                    </div>

                    <div className="mb-4 px-4 lg:px-5">
                        <div className="mb-2 h-6 w-2/3 rounded bg-gray-200 animate-pulse"></div>
                        <div className="my-2 h-6 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="my-2 h-6 w-full rounded bg-gray-200 animate-pulse"></div>
                    </div>
                </div>
            </div>

            <main className="grow pt-14 bg-gray-50 text-gray-900 lg:pt-0 lg:overflow-y-auto">
                <div className="px-4 py-6 lg:px-6">
                    <div className="mb-4 h-6 w-1/2 max-w-sm rounded bg-gray-200 animate-pulse"></div>

                    <div className="mb-4">
                        <div className="mb-4 h-6 w-2/3 rounded bg-gray-200 animate-pulse"></div>
                        
                        <div className="mb-2 h-6 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="mb-2 h-6 w-3/4 rounded bg-gray-200 animate-pulse"></div>
                        <div className="mb-2 h-6 w-1/4 rounded bg-gray-200 animate-pulse"></div>
                        <div className="mb-2 h-6 w-2/4 rounded bg-gray-200 animate-pulse"></div>
                        <div className="mb-2 h-6 w-3/4 rounded bg-gray-200 animate-pulse"></div>
                        <div className="mb-2 h-6 w-full rounded bg-gray-200 animate-pulse"></div>
                    </div>
                </div>
            </main>
        </div>
    )
}