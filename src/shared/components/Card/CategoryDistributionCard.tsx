import Card from './Card';
import IconSpinner from '../IconSpinner';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { BG_COLOR_CLASSES, FILL_COLOR_CLASSES } from '../../../shared/utils/constants';
import type { CategoryDistributionData } from '../../../features/dashboard/types/dashboard.type';

type CategoryDistributionCardProps = {
	title: string;
	data: CategoryDistributionData[];
	isLoading: boolean;
};

export default function CategoryDistributionCard({
	title,
	data,
	isLoading,
}: CategoryDistributionCardProps) {
	return (
		<Card>
			<h2 className="mb-2 text-md font-semibold text-gray-900">{title}</h2>

			{isLoading ? (
				<div className="flex justify-center">
					<IconSpinner color="dark" />
				</div>
			) : data.length ? (
				<>
					<div className="mb-4">
						<PieChart
							style={{
								width: '100%',
								maxHeight: '350px',
								aspectRatio: 1,
							}}
							responsive
						>
							<Pie
								data={data}
								dataKey={`${'count'}`}
								cx="50%"
								cy="50%"
								outerRadius="50%"
								fill="#8884d8"
								isAnimationActive={true}
							>
								{data.map((data, index) => (
									<Cell
										key={`cell-${data.id}`}
										className={`${FILL_COLOR_CLASSES[index % FILL_COLOR_CLASSES.length]}`}
									/>
								))}
							</Pie>
							<Tooltip
								formatter={(
									value: number | string | undefined,
									_name: string | undefined,
									props: { payload?: { name?: string } },
								) => {
									const name = props.payload?.name ?? 'No category';
									return [value ?? '', name];
								}}
							/>
							<RechartsDevtools />
						</PieChart>
					</div>
					<div className="mb-4">
						<ul className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
							{data.map((d, index) => (
								<li key={!d.id ? `0` : d.id} className="flex gap-2">
									<div className="self-center">
										<div
											className={`w-4 h-4 rounded ${BG_COLOR_CLASSES[index % BG_COLOR_CLASSES.length]}`}
										></div>
									</div>
									<div className="text-left font-semibold">
										{!d.name ? `No genre` : d.name} ({d.count})
									</div>
								</li>
							))}
						</ul>
					</div>
				</>
			) : (
				<p>There is currently no data.</p>
			)}
		</Card>
	);
}
