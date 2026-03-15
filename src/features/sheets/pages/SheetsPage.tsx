import Layout from '../../../layouts/Layout';
import SheetList from '../components/SheetList';

export default function SheetsPage() {

    return(
        <Layout heading={'Sheets'}>
            <p className='mb-4 text-gray-500'>View and manage music sheets in your collection.</p>
            <SheetList />
        </Layout>
    )
}