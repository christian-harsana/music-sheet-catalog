import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";
import { DataRefreshContext } from "../contexts/DataRefreshContext";
import { type Level } from "../types/level.type";
import Loading from "./Loading";
import Modal from "./Modal";
import LevelForm from "./LevelForm";
import IconSpinner from "./IconSpinner";

const BASEURL = 'http://localhost:3000/';
const LEVELURL = `${BASEURL}api/level/`;

function DeleteConfirmation({id, name} : {id: string, name: string}) {
    
    const {token} = useContext(AuthContext);
    const {addToast, closeModal} = useContext(UIContext);
    const {triggerRefresh} = useContext(DataRefreshContext);
    const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);

    const handleDelete = async (id: string) => {

        setIsFormProcessing(true);

        const DELETELEVELURL = `${LEVELURL}${id}`;

        try {
            const response = await fetch(`${DELETELEVELURL}`, {
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


export default function LevelList() {
    const {token} = useContext(AuthContext);
    const {refreshTrigger} = useContext(DataRefreshContext);
    const {addToast, showModal} = useContext(UIContext);
    const navigate = useNavigate();
    const [levels, setLevels] = useState<Level[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const showEditForm = (level: Level) => {
        showModal(
            <Modal title={"Edit Level"}>
                <LevelForm level={level} />
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

        const fetchLevels = async () => {
            try {
                const response = await fetch(`${LEVELURL}`, {
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

                const resultData: Level[] = result.data;

                setLevels(resultData);
            }
            catch(error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                addToast(errorMessage, "error");
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchLevels();
    }, [token, refreshTrigger]);


    // RENDER
    if (isLoading) {
        return (<Loading />)
    }

    return (
        <table className="w-full border rounded-md border-gray-300">
            <thead>
                <tr className="bg-gray-200">
                    <th scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Name</th>
                    <th scope="col" className="px-3 py-2 border-b border-gray-300 text-left"></th>
                </tr>
            </thead>
            <tbody>
                {
                    levels.length < 1 ? (
                        <tr className="bg-gray-50">
                            <td colSpan={2} className="px-3 py-2">There is currently no Level data yet.</td>
                        </tr>
                    ) : (
                        levels.map(level => 
                            <tr key={level.id} className="odd:bg-gray-50 even:bg-gray-100">
                                <td className="px-3 py-2">{level.name}</td>
                                <td className="px-3 py-2">
                                    <div className="flex flex-nowrap gap-3">
                                        <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showEditForm(level)}>Edit</button>
                                        <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showDeleteConfirmation(level.id, level.name)}>Delete</button>
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