import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { api } from '../../../shared/utils/api';
import IconSpinner from '../../../shared/components/IconSpinner';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { BG_COLOR_CLASSES, FILL_COLOR_CLASSES } from '../../../shared/utils/constants';
import { useErrorHandler } from '../../../shared/hooks/utilHooks';

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
    const [sheetsByLevel, setSheetsByLevel] = useState<SheetByLevel[]>([]);
    const [sheetsByGenre, setSheetsByGenre] = useState<SheetByGenre[]>([]);
    const [incompleteSheetCount, setIncompleteSheetCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const errorHandler = useErrorHandler();

    // TODO: extract data fetching to custom hook
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
                errorHandler(error);
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchSummary();
    }, [])

    const incompleteSheetCountClass = incompleteSheetCount > 0 ? 'text-red-600' : 'text-green-500';

    // TODO: transform the dashboard widgets into components
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
                            <span className={`text-4xl font-bold ${incompleteSheetCountClass}`}>{incompleteSheetCount}</span>
                        )         
                }
                
            </div>

            <div className="px-5 py-4 w-full h-auto rounded-md border border-gray-300 sm:w-[calc(50%-0.5rem)]">
                <h2 className="mb-3 font-bold text-gray-900">Sheets by Genre</h2>
                
                {
                    isLoading ? 
                        ( 
                            <div className="flex justify-center">
                                <IconSpinner color="dark"/>
                            </div>
                        ) : (

                            sheetsByGenre.length ? (
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
                                                formatter={(value: any, _name: any, props: any) => {
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
                            ) : (
                                <p>There is currently no data.</p>
                            )
                        )         
                }     
            </div>
            
            <div className="px-5 py-4 w-full h-auto rounded-md border border-gray-300 sm:w-[calc(50%-0.5rem)]">
                <h2 className="mb-3 font-bold text-gray-900">Sheets by Level</h2>

                {
                    isLoading ? 
                        (
                            <div className="flex justify-center">
                                <IconSpinner color="dark"/>
                            </div>
                        ) : (
                            sheetsByLevel.length ? (
                                <>
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
                                                formatter={(value: any, _name: any, props: any) => {
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
                                </>
                            ) : (
                                <p>There is current no data.</p>
                            )
                        )         
                }
            </div>
        </div>
    )
}

export default Dashboard;