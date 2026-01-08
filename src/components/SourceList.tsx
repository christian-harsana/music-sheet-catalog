import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";
import { DataRefreshContext } from "../contexts/DataRefreshContext";
import { type Source } from "../types/source.type";
import Loading from "./Loading";
import Modal from "./Modal";
import SourceForm from "./SourceForm";
import IconSpinner from "./IconSpinner";

const BASEURL = 'http://localhost:3000/';
const SOURCEURL = `${BASEURL}api/source/`;

function DeleteConfirmation({id, name} : {id: string, name: string}) {
    
    const {token} = useContext(AuthContext);
    const {addToast, closeModal} = useContext(UIContext);
    const {triggerRefresh} = useContext(DataRefreshContext);
    const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);

    const handleDelete = async (id: string) => {

        setIsFormProcessing(true);

        const DELETESOURCEURL = `${SOURCEURL}${id}`;

        try {
            const response = await fetch(`${DELETESOURCEURL}`, {
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
            setIsFormProcessing(false);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";

            addToast(errorMessage, "error");
            setIsFormProcessing(false);
        }
    }
    
    return(
        <>
            <p>Are you sure want to delete <strong>{name}</strong>?</p>

            <div className="mt-4 flex flex-nowrap gap-3">
                {
                    isFormProcessing ? (
                        <button type="button"
                            disabled
                            className="flex flex-nowrap gap-3 justify-center w-full px-3 py-2 border border-violet-600 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50 font-semibold cursor-progress opacity-50" 
                            onClick={() => handleDelete(id)}>
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


export default function SourceList() {
    const {token} = useContext(AuthContext);
    const {refreshTrigger} = useContext(DataRefreshContext);
    const {addToast, showModal} = useContext(UIContext);
    const navigate = useNavigate();
    const [sources, setSources] = useState<Source[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const showEditForm = (source: Source) => {
        showModal(
            <Modal title={"Edit Source"}>
                <SourceForm source={source} />
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

        const fetchSources = async () => {
            try {
                const response = await fetch(`${SOURCEURL}`, {
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

                const resultData: Source[] = result.data;

                setSources(resultData);
            }
            catch(error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                addToast(errorMessage, "error");
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchSources();
    }, [token, refreshTrigger]);


    // RENDER
    if (isLoading) {
        return (<Loading />)
    }

    return (
        <table className="w-full border rounded-md border-gray-300">
            <thead>
                <tr className="bg-gray-200">
                    <th scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Title</th>
                    <th scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Author</th>
                    <th scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Format</th>
                    <th scope="col" className="px-3 py-2 border-b border-gray-300 text-left"></th>
                </tr>
            </thead>
            <tbody>
                {
                    sources.length < 1 ? (
                        <tr className="bg-gray-50">
                            <td colSpan={4} className="px-3 py-2">There is currently no data yet.</td>
                        </tr>
                    ) : (
                        sources.map(source => 
                            <tr key={source.id} className="odd:bg-gray-50 even:bg-gray-100">
                                <td className="px-3 py-2">{source.title}</td>
                                <td className="px-3 py-2">{source.author}</td>
                                <td className="px-3 py-2">{source.format}</td>
                                <td className="px-3 py-2">
                                    <div className="flex flex-nowrap gap-3">
                                        <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showEditForm(source)}>Edit</button>
                                        <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showDeleteConfirmation(source.id, source.title)}>Delete</button>
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