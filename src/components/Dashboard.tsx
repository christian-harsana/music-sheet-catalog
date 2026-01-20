import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../utils/api";
import IconSpinner from "./IconSpinner";
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

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

const BG_COLOR_CLASSES = ['bg-blue-500', 'bg-teal-500', 'bg-yellow-500', 'bg-orange-500', 'bg-green-500', 'bg-lime-500', 'bg-red-500', 'bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-gray-500', 'bg-gray-900'];
const FILL_COLOR_CLASSES = ['fill-blue-500', 'fill-teal-500', 'fill-yellow-500', 'fill-orange-500', 'fill-green-500', 'fill-lime-500', 'fill-red-500', 'fill-pink-500', 'fill-purple-500', 'fill-indigo-500', 'fill-cyan-500', 'fill-emerald-500', 'fill-gray-500', 'fill-gray-900'];


function Dashboard() {

    const {token} = useContext(AuthContext);
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
        <div className="flex flex-wrap gap-4">
            <div className="px-5 py-4 w-full h-auto rounded-md border border-gray-300 text-center">
                <h2 className="mb-3 font-bold text-gray-900">Sheets With Incomplete Data</h2>
                
                {
                    isLoading ? 
                        (
                            <div className="flex justify-center">
                                <IconSpinner color="dark"/>
                            </div>
                        ) : (
                            <span className="text-4xl text-red-600 font-bold">{incompleteSheetCount}</span>
                        )         
                }
                
            </div>

            <div className="px-5 py-4 w-[calc(50%-0.5rem)] h-auto rounded-md border border-gray-300">
                <h2 className="mb-3 font-bold text-gray-900">Sheets by Genre</h2>
                
                {
                    isLoading ? 
                        ( 
                            <div className="flex justify-center">
                                <IconSpinner color="dark"/>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <PieChart
                                        style={{
                                            width: '100%',
                                            maxHeight: '350px',
                                            aspectRatio: 1,
                                        }}
                                        responsive>
                                        <Pie
                                            data={sheetsByGenre}
                                            dataKey={`${'count'}`}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius="50%"
                                            fill="#8884d8"
                                            isAnimationActive={true}
                                        >
                                            {
                                                sheetsByGenre.map((data, index) => (
                                                    <Cell key={`cell-${data.genreId}`} className={`${FILL_COLOR_CLASSES[index % FILL_COLOR_CLASSES.length]}`} />
                                                ))
                                            }
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value: any, name: any, props: any) => {
                                                const genreName = props.payload.genreName ?? "No Genre";
                                                return [value, genreName];
                                            }}
                                            />
                                        <RechartsDevtools />
                                    </PieChart>
                                </div>
                                 <div className="mb-4">
                                    <ul className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
                                        {
                                            sheetsByGenre.map((sheet, index) => 
                                                <li key={!sheet.genreId ? `0` : sheet.genreId} className="flex gap-2">
                                                    <div className="self-center">
                                                        <div className={`w-4 h-4 rounded ${BG_COLOR_CLASSES[index % BG_COLOR_CLASSES.length]}`}></div>
                                                    </div>
                                                    <div className="text-left font-semibold">{!sheet.genreName ? `No genre` : sheet.genreName} ({sheet.count})</div>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </>
                        )         
                }     
            </div>
            
            <div className="px-5 py-4 w-[calc(50%-0.5rem)] h-auto rounded-md border border-gray-300">
                <h2 className="mb-3 font-bold text-gray-900">Sheets by Level</h2>

                {
                    isLoading ? 
                        (
                            <div className="flex justify-center">
                                <IconSpinner color="dark"/>
                            </div>
                        ) : (
                            <div className="">
                                <div className="mb-4 mx-auto">
                                    <PieChart
                                        style={{
                                            width: '100%',
                                            maxHeight: '350px',
                                            aspectRatio: 1,
                                        }}
                                        responsive>
                                        <Pie
                                            data={sheetsByLevel}
                                            dataKey={`${'count'}`}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius="50%"
                                            fill="#000"
                                            isAnimationActive={true}
                                        >
                                            {
                                                sheetsByLevel.map((data, index) => (
                                                    <Cell key={`cell-${data.levelId}`} className={`${FILL_COLOR_CLASSES[index % FILL_COLOR_CLASSES.length]}`} />
                                                ))
                                            }
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value: any, name: any, props: any) => {
                                                const levelName = props.payload.levelName ?? "No Level";
                                                return [value, levelName];
                                            }}
                                            />
                                        <RechartsDevtools />
                                    </PieChart>
                                </div>
                                <div className="mb-4">
                                    <ul className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
                                        {
                                            sheetsByLevel.map((sheet, index) => 
                                                <li key={!sheet.levelId ? `0` : sheet.levelId} className="flex gap-2">
                                                    <div className="self-center">
                                                        <div className={`w-4 h-4 rounded ${BG_COLOR_CLASSES[index % BG_COLOR_CLASSES.length]}`}></div>
                                                    </div>
                                                    <div className="text-left font-semibold">{!sheet.levelName ? `No level` : sheet.levelName} ({sheet.count})</div>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </div>
                        )         
                }
            </div>
        </div>
    )
}

export default Dashboard;