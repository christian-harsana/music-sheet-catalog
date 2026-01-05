import { useState } from 'react';
import Navigation from "../components/Navigation";
import GenreList from '../components/GenreList';
import GenreForm from '../components/GenreForm';
import Modal from '../components/Modal';


function Genre() {

    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    const handleAddGenre = () => {
        setShowAddModal(true);
    }

    const handleCloseAddGenreModal = () => {
        setShowAddModal(false);
    }

    return(
        <main>
            <Navigation />
            <h1 className="mb-4 font-semibold text-2xl">Genre</h1>

            <div className="mb-4">
                <button type="button" 
                    onClick={handleAddGenre}
                    className="px-3 py-2 border border-fuchsia-400 hover:border-fuchsia-500 rounded-md bg-fuchsia-400 hover:bg-fuchsia-500">
                    Add Genre
                </button>
            </div>

            <div className="mb-4">
                <GenreList />
            </div>

            { showAddModal && 
                <Modal title={'Add Genre'} handleCloseModal={handleCloseAddGenreModal}>
                    <GenreForm />
                </Modal>
            }
        </main>
    )
}

export default Genre;