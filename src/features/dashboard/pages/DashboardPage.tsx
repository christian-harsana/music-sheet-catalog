import { useContext } from 'react';
import Layout from '../../../layouts/Layout';
import Dashboard from '../components/Dashboard';
import { AuthContext } from '../../../contexts/AuthContext';

export default function DashboardPage() {

    const {user} = useContext(AuthContext);
    const heading = user?.name ? `Welcome, ${user.name}` : 'Welcome';
    

    return(
        <Layout heading={heading}>
            <Dashboard />
        </Layout>       
    )
}