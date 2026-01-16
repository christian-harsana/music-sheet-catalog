import Navigation from "../components/Navigation";

function Home() {

    return(
        <div className="flex flex-nowrap">
            <div className="h-screen basis-3xs">
                <Navigation />
            </div>

            <main className="h-screen basis-full bg-gray-50 text-gray-900">
                <div className="p-6">
                    <h1 className="font-semibold text-2xl mb-4">Home</h1>

                    <div className="mb-4">
                        <p>Hello from the home page...</p>
                    </div>
                </div>
            </main>
        </div>       
    )
}

export default Home;