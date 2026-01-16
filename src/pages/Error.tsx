import { Link } from "react-router";

export default function Error() {

    return(
        <main className="flex justify-center items-center min-h-screen">
            <div className="w-[calc(100%-3rem)] max-w-md px-7 py-5 rounded-lg bg-gray-50 text-gray-950">

                <h1 className="mb-4 font-bold text-2xl text-center uppercase">Error</h1>
            
                <p className="mb-4 text-center">
                    Looks like the page you are looking for is not available.<br/>
                    Go to <Link to="/" className="text-violet-500 font-semibold underline hover:no-underline">Home</Link> instead?
                </p>
            </div>
        </main>
    )
}