import Navigation from "../components/Navigation";
import GenreList from '../components/GenreList';

function Genre() {

    const handleAddGenre = () => {
        console.log('Add Genre');
    }

    return(
        <main>
            <Navigation />
            <h1 className="mb-4 font-semibold text-2xl">Genre</h1>

            <div className="mb-3">
                <button type="button" 
                    onClick={handleAddGenre}
                    className="px-3 py-2 border border-fuchsia-400 hover:border-fuchsia-500 rounded-md bg-fuchsia-400 hover:bg-fuchsia-500">
                    Add Genre
                </button>
            </div>

            <GenreList />
        </main>
    )
}

export default Genre;