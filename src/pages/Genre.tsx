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
        <div className="flex flex-nowrap">
            <div className="h-screen basis-3xs">
                <Navigation />
            </div>

            <main className="h-screen basis-full bg-gray-50 text-gray-900">
                <div className="p-6">
                    <div className="flex justify-between gap-4 mb-4">
                        <h1 className="font-semibold text-2xl">Genre</h1>

                        <button type="button" 
                            onClick={handleAddGenre}
                            className="px-4 py-2 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50">
                            Add Genre
                        </button>                        
                    </div>

                    <div className="mb-4">
                        <GenreList />
                    </div>
                </div>
            </main>
        </div>
    )
}