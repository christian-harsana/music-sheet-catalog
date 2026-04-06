import { type ReactNode } from 'react';

type CardProps = {
	children: ReactNode;
};

export default function Card({ children }: CardProps) {
	return (
		<div className="px-5 py-4 w-full h-full rounded-md border border-gray-300">{children}</div>
	);
}
