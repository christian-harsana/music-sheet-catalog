import Card from '../../../shared/components/Card/Card';
import StatCard from '../../../shared/components/Card/StatCard';
import IconSpinner from '../../../shared/components/IconSpinner';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { BG_COLOR_CLASSES, FILL_COLOR_CLASSES } from '../../../shared/utils/constants';
import { useGetDashboardSummary } from '../hooks/dashboardHooks';

function Dashboard() {

    const {sheetsByLevel, 
            sheetsByGenre, 
            incompleteSheetCount,
            totalSheetCount,
            totalSourceCount,
            totalLevelCount,
            totalGenreCount,
            isLoading } = useGetDashboardSummary();
    
    const incompleteSheetCountClass = incompleteSheetCount > 0 ? 'text-red-600' : 'text-green-500';

    return (
        <div className="flex flex-wrap gap-4">
            <div className="w-full xl:w-[calc(34%-0.75rem)]">
                <StatCard 
                    title="Total Sheets"
                    cta="View Collection"
                    ctaHref="/sheets"
                    isLoading={isLoading}
                    value1={totalSheetCount}
                    value1SupportingText="in your collection"
                    value2={incompleteSheetCount}
                    value2SupportingText="with missing details"
                    value2Class={incompleteSheetCountClass}
                />
            </div>

            <div className="w-full sm:w-[calc(33.33%-0.667rem)] xl:w-[calc(22%-0.75rem)]">
                <StatCard 
                    title="Total Sources"
                    cta="Manage"
                    ctaHref="/sources"
                    isLoading={isLoading}
                    value1={totalSourceCount}
                    value1SupportingText="in your collection"
                />
            </div>

            <div className="w-full sm:w-[calc(33.33%-0.667rem)] xl:w-[calc(22%-0.75rem)]">
                <StatCard 
                    title="Difficulty Levels"
                    cta="Manage"
                    ctaHref="/levels"
                    isLoading={isLoading}
                    value1={totalLevelCount}
                    value1SupportingText="represented"
                />
            </div>
                
            <div className="w-full sm:w-[calc(33.33%-0.667rem)] xl:w-[calc(22%-0.75rem)]">
                <StatCard 
                    title="Genres"
                    cta="Manage"
                    ctaHref="/genres"
                    isLoading={isLoading}
                    value1={totalGenreCount}
                    value1SupportingText="represented"
                />
            </div>

            <div className="w-full sm:w-[calc(50%-0.5rem)]">
                <Card>
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
                </Card>
            </div>
            
            <div className="w-full sm:w-[calc(50%-0.5rem)]">
                <Card>
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
                                    <p>There is currently no data.</p>
                                )
                            )         
                    }
                </Card>
            </div>
        </div>
    )
}

export default Dashboard;