import { useId } from 'react';
import { Link } from 'react-router';
import Card from './Card';
import IconSpinner from '../IconSpinner';

type StatCardProps = {
	title: string;
	cta?: string;
	ctaHref?: string;
	isLoading: boolean;
	value1: number;
	value1SupportingText: string;
	value1Class?: string;
	value2?: number;
	value2SupportingText?: string;
	value2Class?: string;
};

export default function StatCard({
	title,
	cta,
	ctaHref,
	isLoading,
	value1,
	value1SupportingText = '',
	value1Class = '',
	value2,
	value2SupportingText = '',
	value2Class = '',
}: StatCardProps) {
	const titleId = useId();

	return (
		<Card>
			<div className="flex gap-4 justify-between">
				<h2 id={titleId} className="mb-2 text-md font-semibold text-gray-900">
					{title}
				</h2>
				{cta && ctaHref && (
					<div>
						<Link
							to={ctaHref}
							aria-label={`${cta} for ${title}`}
							className="px-2 py-0.5 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-xs text-gray-50"
						>
							{cta}
						</Link>
					</div>
				)}
			</div>

			<div aria-live="polite" aria-busy={isLoading}>
				{isLoading ? (
					<div className="flex justify-center">
						<IconSpinner color="dark" />
					</div>
				) : (
					<dl className="flex flex-nowrap gap-4" aria-labelledby={titleId}>
						<div>
							<dd className={`text-4xl font-bold ${value1Class}`}>{value1}</dd>
							<dt className="text-sm text-gray-500">{value1SupportingText}</dt>
						</div>
						{value2 !== undefined && (
							<div className="pl-4 border-l border-l-gray-300">
								<dd className={`text-4xl font-bold ${value2Class}`}>{value2}</dd>
								<dt className="text-sm text-gray-500">{value2SupportingText}</dt>
							</div>
						)}
					</dl>
				)}
			</div>
		</Card>
	);
}
