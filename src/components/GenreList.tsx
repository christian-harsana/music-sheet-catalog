import { useState, useContext, useEffect } from "react";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "./Loading";

type Genre = {
    id: string,
    name: string
}

const BASEURL = 'http://localhost:3000/';
const GENREURL = `${BASEURL}api/genre/`;

function GenreRows({genres} : {genres: Genre[]}) {

    return (
        <>
            {
                genres.map(genre => 
                    <tr key={genre.id}>
                        <td>{genre.name}</td>
                        <td>
                            <div className="flex flex-nowrap gap-3">
                                <button type="button">Edit</button>
                                <button type="button">Delete</button>
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