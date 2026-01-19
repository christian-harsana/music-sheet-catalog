import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { UIContext } from "../contexts/UIContext";
import IconSpinner from "./IconSpinner";

type SheetByLevel = {
    levelId: string | null;
    levelName: string | null;
    count: number;
}

type SheetByGenre = {
    genreId: string | null;
    genreName: string | null;
    count: number;
}


function Dashboard() {

    const {token} = useContext(AuthContext);
    const {addToast} = useContext(UIContext);
    const [sheetsByLevel, setSheetsByLevel] = useState<SheetByLevel[]>([]);
    const [sheetsByGenre, setSheetsByGenre] = useState<SheetByGenre[]>([]);
    const [incompleteSheetCount, setIncompleteSheetCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {

        const fetchSummary = async() => {
                    
            if (!token) return;

            try {
                const response = await api.get(`stats`, token);
                const result = await response.json();

                setSheetsByLevel(result.data[0]);
                setSheetsByGenre(result.data[1]);
                setIncompleteSheetCount(result.data[2][0].count);
            }
            catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(errorMessage); // TODO: Create error handlers
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchSummary();
    }, [])

    return (
        <div className="flex flex-wrap gap-3">
            <div className="px-5 py-4 w-1/4 h-auto rounded-md border border-gray-300 text-center">
                <h2 className="mb-3 font-bold text-gray-900">Sheets With Incomplete Data</h2>
                
                {
                    isLoading ? 
                        (
                            <div className="flex justify-center">
                                <IconSpinner color="dark"/>
                            </div>
                        ) : 
                        (<span className="text-4xl text-red-600 font-bold">{incompleteSheetCount}</span>)         
                }
                
            </div>

            <div className="px-5 py-4 w-1/4 h-auto rounded-md border border-gray-300">
                <h2 className="mb-3 font-bold text-gray-900">Sheets by Genre</h2>
                
                {
                    isLoading ? 
                        ( 
                            <div className="flex justify-center">
                                <IconSpinner color="dark"/>
                            </div>
                        ) : (
                             <table>
                                <tbody>
                                {
                                    sheetsByGenre.map(sheet => 
                                        <tr key={!sheet.genreId ? `0` : sheet.genreId}>
                                            <th scope="row" className="text-left pe-3 font-semibold">{!sheet.genreName ? <span className="text-red-600">No genre</span> : sheet.genreName}</th>
                                            <td className="ps-3">{sheet.count}</td>
                                        </tr>)
                                }
                                </tbody>
                            </table>
                        )         
                }
               
            </div>
            
             <div className="px-5 py-4 w-1/4 h-auto rounded-md border border-gray-300">
                <h2 className="mb-3 font-bold text-gray-900">Sheets by Level</h2>

                {
                    isLoading ? 
                        (
                            <div className="flex justify-center">
                                <IconSpinner color="dark"/>
                            </div>
                        ) : (
                            <table>
                                <tbody>
                                {
                                    sheetsByLevel.map(sheet => 
                                        <tr key={!sheet.levelId ? `0` : sheet.levelId}>
                                            <th scope="row" className="text-left pe-3 font-semibold">{!sheet.levelName ? <span className="text-red-600">No level</span> : sheet.levelName}</th>
                                            <td className="ps-3">{sheet.count}</td>
                                        </tr>)
                                }
                                </tbody>
                            </table>
                        )         
                }
            </div>
        </div>
    )
}

export default Dashboard;