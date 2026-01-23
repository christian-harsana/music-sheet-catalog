import Layout from '../../../layouts/Layout';
import UserProfile from '../components/UserProfile';

export default function ProfilePage() {

    return (
        <Layout heading={'Profile'}>
            <UserProfile />
        </Layout>
    )
}