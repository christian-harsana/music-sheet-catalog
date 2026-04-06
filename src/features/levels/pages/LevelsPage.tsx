import Layout from '../../../layouts/Layout';
import LevelList from '../components/LevelList';

export default function LevelsPage() {
	return (
		<Layout heading={'Levels'}>
			<p className="mb-4 text-gray-500">
				View and manage difficulty levels used in your collection.
			</p>
			<LevelList />
		</Layout>
	);
}
