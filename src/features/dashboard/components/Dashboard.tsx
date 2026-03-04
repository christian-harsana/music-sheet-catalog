import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { api } from '../../../shared/utils/api';
import IconSpinner from '../../../shared/components/IconSpinner';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { BG_COLOR_CLASSES, FILL_COLOR_CLASSES } from '../../../shared/utils/constants';
import { useErrorHandler } from '../../../shared/hooks/utilHooks';
import { UIContext } from '../../../contexts/UIContext';
import { Link } from 'react-router';

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

    const {token, logout} = useContext(AuthContext);
    const {addToast} = useContext(UIContext);
    const [sheetsByLevel, setSheetsByLevel] = useState<SheetByLevel[]>([]);
    const [sheetsByGenre, setSheetsByGenre] = useState<SheetByGenre[]>([]);
    const [incompleteSheetCount, setIncompleteSheetCount] = useState<number>(0);
    const [totalSheetCount, setTotalSheetCount] = useState<number>(0);
    const [totalSourceCount, setTotalSourceCount] = useState<number>(0);
    const [totalLevelCount, setTotalLevelCount] = useState<number>(0);
    const [totalGenreCount, setTotalGenreCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {handleError} = useErrorHandler();

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
                setTotalSheetCount(result.data[3][0].count);
                setTotalSourceCount(result.data[4][0].count);
                setTotalLevelCount(result.data[5][0].count);
                setTotalGenreCount(result.data[6][0].count);
            }
            catch (error: unknown) {
                handleError(error, { 
                    onUnauthorised: logout, 
                    onError: (message) => addToast(message, 'error') 
                });
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
            <div className="w-full">
                <div className="px-5 py-4 w-full h-full rounded-md border border-gray-300">

                    <div className="flex gap-4 justify-between">
                        <h2 className="mb-2 text-md font-semibold text-gray-900">Total Sheets</h2>
                        <div>
                            <Link to="/sheets" className="px-2 py-0.5 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-xs text-gray-50">
                                View Collection
                            </Link>
                        </div>
                    </div>

                    {
                        isLoading ? 
                            (
                                <div className="flex justify-center">
                                    <IconSpinner color="dark"/>
                                </div>
                            ) : (
                                <div className="flex flex-nowrap gap-4">
                                    <div>
                                        <div className="text-4xl font-bold">{totalSheetCount}</div>
                                        <div className="text-sm text-gray-500">in your collection</div>
                                    </div>
                                    <div className="pl-4 border-l border-l-gray-300">
                                        <div className={`text-4xl font-bold ${incompleteSheetCountClass}`}>
                                            {incompleteSheetCount}
                                        </div>
                                        <div className="text-sm text-gray-500">with missing details</div>
                                    </div>
                                </div>
                            )         
                    }    
                </div>
            </div>

            <div className="w-full sm:w-[calc(33.33%-0.667rem)]">
                
                <div className="px-5 py-4 w-full h-full rounded-md border border-gray-300">
                    <div className="flex gap-4 justify-between">
                        <h2 className="mb-2 text-md font-semibold text-gray-900">Total Sources</h2>
                        <div>
                            <Link to="/sources" className="px-2 py-0.5 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-xs text-gray-50">
                                Manage
                            </Link>
                        </div>
                    </div>

                    {
                        isLoading ? 
                            (
                                <div className="flex justify-center">
                                    <IconSpinner color="dark"/>
                                </div>
                            ) : (
                                <>
                                    <div className={`text-4xl font-bold`}>{totalSourceCount}</div>
                                    <div className="text-sm text-gray-500">in your collection</div>
                                </>
                            )         
                    } 
                </div>   
            </div>

            <div className="w-full sm:w-[calc(33.33%-0.667rem)]">
                <div className="px-5 py-4 w-full h-full rounded-md border border-gray-300">                
                    <div className="flex gap-4 justify-between">
                        <h2 className="mb-2 text-md font-semibold text-gray-900">Difficulty Levels</h2>
                        <div>
                            <Link to="/levels" className="px-2 py-0.5 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-xs text-gray-50">
                                Manage
                            </Link>
                        </div>
                    </div>

                    {
                        isLoading ? 
                            (
                                <div className="flex justify-center">
                                    <IconSpinner color="dark"/>
                                </div>
                            ) : (
                                <>
                                    <div className={`text-4xl font-bold`}>{totalLevelCount}</div>
                                    <div className="text-sm text-gray-500">represented</div>
                                </>
                            )         
                    }    
                </div>
            </div>
                
            <div className="w-full sm:w-[calc(33.33%-0.667rem)]">
                <div className="px-5 py-4 w-full h-full rounded-md border border-gray-300">
                    <div className="flex gap-4 justify-between">
                        <h2 className="mb-2 text-md font-semibold text-gray-900">Genres</h2>
                        <div>
                            <Link to="/genres" className="px-2 py-0.5 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-xs text-gray-50">
                                Manage
                            </Link>
                        </div>
                    </div>

                    {
                        isLoading ? 
                            (
                                <div className="flex justify-center">
                                    <IconSpinner color="dark"/>
                                </div>
                            ) : (
                                <>
                                    <div className={`text-4xl font-bold`}>{totalGenreCount}</div>
                                    <div className="text-sm text-gray-500">represented</div>
                                </>
                            )         
                    }    
                </div>
            </div>

            <div className="w-full sm:w-[calc(50%-0.5rem)]">
                <div className="px-5 py-4 w-full h-full rounded-md border border-gray-300">
                    <h2 className="mb-2 text-md font-semibold text-gray-900">Sheets by Genre</h2>
                    
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
            </div>
            
            <div className="w-full sm:w-[calc(50%-0.5rem)]">
                <div className="px-5 py-4 w-full h-full rounded-md border border-gray-300">
                    <h2 className="mb-2 text-md font-semibold text-gray-900">Sheets by Level</h2>

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
        </div>
    )
}

export default Dashboard;