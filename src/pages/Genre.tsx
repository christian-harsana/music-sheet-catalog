import { useContext } from 'react';
import Navigation from "../components/Navigation";
import GenreList from '../components/GenreList';
import GenreForm from '../components/GenreForm';
import Modal from '../components/Modal';
import { UIContext } from '../contexts/UIContext';


export default function Genre() {

    const {showModal} = useContext(UIContext);

    const handleAddGenre = () => {
        showModal(
            <Modal title={'Add Genre'}>
                <GenreForm />
            </Modal>
        )
    }

    return(
        <main>
            <Navigation />
            <h1 className="mb-4 font-semibold text-2xl">Genre</h1>

            <div className="mb-4">
                <button type="button" 
                    onClick={handleAddGenre}
                    className="px-3 py-2 border border-violet-400 hover:border-violet-500 rounded-md bg-violet-400 hover:bg-violet-500">
                    Add Genre
                </button>
            </div>

            <div className="mb-4">
                <GenreList />
            </div>
        </main>
    )
}