import { Link } from "react-router";
import LayoutCard from "../../layouts/LayoutCard";

export default function ErrorPage() {

    return(
        <LayoutCard>
            <h1 className="mb-4 font-bold text-2xl text-center uppercase">Error</h1>
        
            <p className="mb-4 text-center">
                Looks like the page you are looking for is not available.<br/>
                Go to <Link to="/" className="text-violet-500 font-semibold underline hover:no-underline">Home</Link> instead?
            </p>
        </LayoutCard>
    )
}