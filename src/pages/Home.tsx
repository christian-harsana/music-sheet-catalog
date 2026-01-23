import Layout from "../layouts/Layout";
import Dashboard from "../components/Dashboard";

export default function Home() {

    return(
        <Layout heading={'Dashboard'}>
            <Dashboard />
        </Layout>       
    )
}