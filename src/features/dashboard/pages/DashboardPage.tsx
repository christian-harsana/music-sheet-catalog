import Layout from '../../../layouts/Layout';
import Dashboard from '../components/Dashboard';
import { useAuth } from '../../../contexts/authContext';

export default function DashboardPage() {
	const { user } = useAuth();
	const heading = user?.name ? `Welcome, ${user.name}` : 'Welcome';

	return (
		<Layout heading={heading}>
			<p className="mb-4 text-gray-500">Here's an overview of your collection.</p>
			<Dashboard />
		</Layout>
	);
}
