import Layout from '../../../layouts/Layout';
import GenreList from '../components/GenreList';

export default function GenresPage() {
	return (
		<Layout heading={'Genres'}>
			<p className="mb-4 text-gray-500">View and manage genres used in your collection.</p>
			<GenreList />
		</Layout>
	);
}
