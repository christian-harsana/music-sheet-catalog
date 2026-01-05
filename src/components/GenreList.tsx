import { useState, useContext, useEffect } from "react";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "./Loading";
import Modal from "./Modal";

type Genre = {
    id: string,
    name: string
}

const BASEURL = 'http://localhost:3000/';
const GENREURL = `${BASEURL}api/genre/`;

function DeleteConfirmation({id, name} : {id: string, name: string}) {
    
    const {token} = useContext(AuthContext);
    const {addToast, closeModal} = useContext(UIContext);

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


function GenreRows({genres} : {genres: Genre[]}) {

    const {showModal} = useContext(UIContext);

    const showDeleteConfirmation = (id: string, name: string) => {
        showModal(
            <Modal title={"Confirmation"}>
                <DeleteConfirmation id={id} name={name} />
            </Modal>
        )
    }

    return (
        <>
            {
                genres.map(genre => 
                    <tr key={genre.id}>
                        <td>{genre.name}</td>
                        <td>
                            <div className="flex flex-nowrap gap-3">
                                <button type="button">Edit</button>
                                <button type="button" onClick={() => showDeleteConfirmation(genre.id, genre.name)}>Delete</button>
                            </div>
                        </td>
                    </tr>
                )
            }
        </>
    );
}


export default function GenreList() {
    const {token} = useContext(AuthContext);
    const {addToast} = useContext(UIContext);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
    }, [token, addToast]);

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
                        <GenreRows genres={genres} />
                    )
                }
            </tbody>
        </table>
    )
}