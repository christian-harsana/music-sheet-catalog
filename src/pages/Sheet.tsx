import Navigation from "../components/Navigation";
import SheetList from '../components/SheetList';


export default function Sheet() {

    return(
        <div className="flex flex-nowrap">
            <div className="h-screen basis-3xs">
                <Navigation />
            </div>

            <main className="h-screen basis-full bg-gray-50 text-gray-900">
                <div className="p-6">
                    <h1 className="font-semibold text-2xl mb-4">Sheet</h1>

                    <div className="mb-4">
                        <SheetList />
                    </div>
                </div>
            </main>
        </div>
    )
}