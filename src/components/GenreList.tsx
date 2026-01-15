import { useContext } from "react";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";
import { useGetGenres, useDeleteGenre } from "../hooks/genreHooks";
import { type Genre } from "../types/genre.type";
import Loading from "./Loading";
import Modal from "./Modal";
import GenreForm from "./GenreForm";
import IconSpinner from "./IconSpinner";

function DeleteConfirmation({id, name, refreshData} : {id: string, name: string, refreshData: () => void }) {
    
    const {token} = useContext(AuthContext);
    const {addToast, closeModal} = useContext(UIContext);
    const {deleteGenre, isLoading} = useDeleteGenre();

    const handleDelete = async (id: string) => {

        if (!token) {
            addToast('Failed to delete - Invalid token', 'error');
            return;
        }

        const result = await deleteGenre(id, token); 
    
        if (result.status === 'success') {
            refreshData();
            closeModal();
            addToast(result.message);
        }
        else {
            addToast(result.message, 'error');
        }  
    }
    
    return(
        <>
            <p>Are you sure want to delete <strong>{name}</strong>?</p>

            <div className="mt-4 flex flex-nowrap gap-3">
                {
                    isLoading ? (
                        <button type="button"
                            disabled
                            className="flex flex-nowrap gap-3 justify-center w-full px-3 py-2 border border-violet-600 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50 font-semibold cursor-progress opacity-50">
                            <IconSpinner />
                            Deleting...
                        </button>
                    ) : 
                    (
                        <button type="button"
                            className="w-full px-3 py-2 border border-violet-600 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50 font-semibold" 
                            onClick={() => handleDelete(id)}>
                            Yes
                        </button>
                    )
                }
                
                <button type="button" 
                    className="w-full px-3 py-2 border border-violet-600 hover:border-violet-600 rounded-md bg-transparent hover:bg-violet-600 text-violet-600 hover:text-gray-50 font-semibold"
                    onClick={closeModal}>
                    No
                </button>
            </div>
        </>
    )
}


export default function GenreList() {
    const { showModal } = useContext(UIContext);
    const { genres, refreshGenres, isLoading } = useGetGenres();
    
    const handleAddGenre = () => {
        showModal(
            <Modal title={'Add Genre'}>
                <GenreForm refreshData={refreshGenres} />
            </Modal>
        )
    }

    const showEditForm = (genre: Genre) => {
        showModal(
            <Modal title={"Edit Genre"}>
                <GenreForm genre={genre}
                    refreshData={refreshGenres} />
            </Modal>
        )
    }

    const showDeleteConfirmation = (id: string, name: string) => {
        showModal(
            <Modal title={"Confirmation"}>
                <DeleteConfirmation id={id} 
                    name={name} 
                    refreshData={refreshGenres} />
            </Modal>
        )
    }

    // RENDER
    if (isLoading) {
        return (<Loading />)
    }

    return (
        <>
            <div className="flex justify-between gap-4 mb-4">
                <button type="button" 
                    onClick={handleAddGenre}
                    className="px-4 py-2 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50">
                    Add Genre
                </button>
            </div>

            <table className="w-full border rounded-md border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Name</th>
                        <th scope="col" className="px-3 py-2 border-b border-gray-300 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        genres.length < 1 ? (
                            <tr className="bg-gray-50">
                                <td colSpan={2} className="px-3 py-2">There is currently no data yet.</td>
                            </tr>
                        ) : (
                            genres.map(genre => 
                                <tr key={genre.id} className="odd:bg-gray-50 even:bg-gray-100">
                                    <td className="px-3 py-2">{genre.name}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex flex-nowrap gap-3">
                                            <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showEditForm(genre)}>Edit</button>
                                            <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showDeleteConfirmation(genre.id, genre.name)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )
                    }
                </tbody>
            </table>
        </>
    )
}