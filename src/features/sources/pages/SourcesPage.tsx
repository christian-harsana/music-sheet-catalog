import Layout from '../../../layouts/Layout';
import SourceList from '../components/SourceList';

export default function SourcesPage() {

    return(
        <Layout heading={'Sources'}>
            <p className='mb-4 text-gray-500'>View and manage sources (books, collections) used in your library.</p>
            <SourceList />
        </Layout>
    )
}