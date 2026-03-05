import StatCard from '../../../shared/components/Card/StatCard';
import CategoryDistributionCard from '../../../shared/components/Card/CategoryDistributionCard';
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

    const normalisedSheetsByLevel = sheetsByLevel.map(d => ({
        id: d.levelId,
        name: d.levelName,
        count: d.count
    }));

    const normalisedSheetsByGenre = sheetsByGenre.map(d => ({
        id: d.genreId,
        name: d.genreName,
        count: d.count
    }));

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
                <CategoryDistributionCard
                    title="Sheets by Genre"
                    data={normalisedSheetsByGenre}
                    isLoading={isLoading}
                />
            </div>
            
            <div className="w-full sm:w-[calc(50%-0.5rem)]">
                <CategoryDistributionCard
                    title="Sheets by Level"
                    data={normalisedSheetsByLevel}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}

export default Dashboard;