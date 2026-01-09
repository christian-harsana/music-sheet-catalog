import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";
import { DataRefreshContext } from "../contexts/DataRefreshContext";
import { type Sheet } from "../types/sheet.type";
import Loading from "./Loading";
import Modal from "./Modal";
import SheetForm from "./SheetForm";
import IconSpinner from "./IconSpinner";

const BASEURL = 'http://localhost:3000/';
const SHEETURL = `${BASEURL}api/sheet/`;

function DeleteConfirmation({id, name} : {id: string, name: string}) {
    
    const {token} = useContext(AuthContext);
    const {addToast, closeModal} = useContext(UIContext);
    const {triggerRefresh} = useContext(DataRefreshContext);
    const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);

    const handleDelete = async (id: string) => {

        setIsFormProcessing(true);

        const DELETESHEETURL = `${SHEETURL}${id}`;

        try {
            const response = await fetch(`${DELETESHEETURL}`, {
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


export default function SheetList() {
    const {token} = useContext(AuthContext);
    const {refreshTrigger} = useContext(DataRefreshContext);
    const {addToast, showModal} = useContext(UIContext);
    const navigate = useNavigate();
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const showEditForm = (sheet: Sheet) => {
        showModal(
            <Modal title={"Edit Sheet"}>
                <SheetForm sheet={sheet} />
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

        const fetchSheets = async () => {
            try {
                const response = await fetch(`${SHEETURL}`, {
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

                const resultData: Sheet[] = result.data;

                setSheets(resultData);
            }
            catch(error: unknown) {

                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                addToast(errorMessage, "error");
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchSheets();
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
                    <th scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Source</th>
                    <th scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Level</th>
                    <th scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Genre</th>
                    <th scope="col" className="px-3 py-2 border-b border-gray-300 text-left"></th>
                </tr>
            </thead>
            <tbody>
                {
                    sheets.length < 1 ? (
                        <tr className="bg-gray-50">
                            <td colSpan={5} className="px-3 py-2">There is currently no data yet.</td>
                        </tr>
                    ) : (
                        sheets.map(sheet => 
                            <tr key={sheet.id} className="odd:bg-gray-50 even:bg-gray-100">
                                <td className="px-3 py-2">{sheet.title}</td>
                                <td className="px-3 py-2">{sheet.sourceTitle}</td>
                                <td className="px-3 py-2">{sheet.levelName}</td>
                                <td className="px-3 py-2">{sheet.genreName}</td>
                                <td className="px-3 py-2">
                                    <div className="flex flex-nowrap gap-3">
                                        <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showEditForm(sheet)}>Edit</button>
                                        <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showDeleteConfirmation(sheet.id, sheet.title)}>Delete</button>
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