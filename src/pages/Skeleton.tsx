export default function Skeleton() {

    return(
        <div className="flex flex-nowrap">
            <div className="h-screen basis-3xs">
                <div className="p-5">
                    <div className="mb-4">
                        <div className="my-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="my-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                    </div>

                    <div className="mb-4">
                        <div className="mb-2 h-7 w-2/3 rounded bg-gray-200 animate-pulse"></div>
                        <div className="my-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="my-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                    </div>

                    <div className="mb-4">
                        <div className="mb-2 h-7 w-2/3 rounded bg-gray-200 animate-pulse"></div>
                        <div className="my-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="my-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                    </div>
                </div>
            </div>

            <main className="h-screen basis-full bg-gray-50 text-gray-900">
                <div className="p-6">
                    <div className="mb-4 h-7 w-sm rounded bg-gray-200 animate-pulse"></div>

                    <div className="mb-4">
                        <div className="mb-4 h-7 w-1/2 rounded bg-gray-200 animate-pulse"></div>
                        
                        <div className="mb-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="mb-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="mb-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="mb-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="mb-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                        <div className="mb-2 h-7 w-full rounded bg-gray-200 animate-pulse"></div>
                    </div>
                </div>
            </main>
        </div>
    )
}