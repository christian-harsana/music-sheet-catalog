import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";
import { DataRefreshContext } from "../contexts/DataRefreshContext";
import { type Genre } from "../types/genre.type";
import Loading from "./Loading";
import Modal from "./Modal";
import GenreForm from "./GenreForm";

const BASEURL = 'http://localhost:3000/';
const GENREURL = `${BASEURL}api/genre/`;

function DeleteConfirmation({id, name} : {id: string, name: string}) {
    
    const {token} = useContext(AuthContext);
    const {addToast, closeModal} = useContext(UIContext);
    const {triggerRefresh} = useContext(DataRefreshContext);

    const handleDelete = async (id: string) => {

        const DELETEGENREURL = `${GENREURL}${id}`;

        try {
            const response = await fetch(`${DELETEGENREURL}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
            const result = await response.json();

            addToast(result.message);
            triggerRefresh();
            closeModal();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";

            addToast(errorMessage, "error");
        }
    }
    
    return(
        <>
            <p>Are you sure want to delete <strong>{name}</strong>?</p>

            <div className="flex flex-nowrap gap-3">
                <button type="button" onClick={() => handleDelete(id)}>Yes</button>
                <button type="button" onClick={closeModal}>No</button>
            </div>
        </>
    )
}


export default function GenreList() {
    const {token} = useContext(AuthContext);
    const {refreshTrigger} = useContext(DataRefreshContext);
    const {addToast, showModal} = useContext(UIContext);
    const navigate = useNavigate();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const showEditForm = (genre: Genre) => {
        showModal(
            <Modal title={"Edit Genre"}>
                <GenreForm genre={genre} />
            </Modal>
        )
    }

    const showDeleteConfirmation = (id: string, name: string) => {
        showModal(
            <Modal title={"Confirmation"}>
                <DeleteConfirmation id={id} name={name} />
            </Modal>
        )
    }

    useEffect(() => {

        if (!token) return;

        const fetchGenres = async () => {
            try {
                const response = await fetch(`${GENREURL}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();

                if (!response.ok) {

                    if (response.status === 401) {
                        addToast(result.error, "error");
                        localStorage.removeItem('music_sheet_catalog_token');
                        navigate('/login');
                        return;
                    }

                    addToast(result.error, "error");
                    return;
                }

                const resultData: Genre[] = result.data;

                setGenres(resultData);
            }
            catch(error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                addToast(errorMessage, "error");
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchGenres();
    }, [token, refreshTrigger]);


    // RENDER
    if (isLoading) {
        return (<Loading />)
    }

    return (
        <table>
            <thead>
                <tr>
                    <th scope="col" className="text-left">Name</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {
                    genres.length < 1 ? (
                        <tr>
                            <td colSpan={2}>There is currently no Genre data yet.</td>
                        </tr>
                    ) : (
                        genres.map(genre => 
                            <tr key={genre.id}>
                                <td>{genre.name}</td>
                                <td>
                                    <div className="flex flex-nowrap gap-3">
                                        <button type="button" onClick={() => showEditForm(genre)}>Edit</button>
                                        <button type="button" onClick={() => showDeleteConfirmation(genre.id, genre.name)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        )
                    )
                }
            </tbody>
        </table>
    )
}