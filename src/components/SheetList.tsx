import { useContext } from "react";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";
import { useGetSheets, useDeleteSheet } from "../hooks/sheetHooks";
import { type Sheet } from "../types/sheet.type";
import Loading from "./Loading";
import Modal from "./Modal";
import SheetForm from "./SheetForm";
import IconSpinner from "./IconSpinner";


function DeleteConfirmation({id, name, refreshData} : {id: string, name: string, refreshData: () => void}) {
    
    const {token} = useContext(AuthContext);
    const {addToast, closeModal} = useContext(UIContext);
    const {deleteSheet, isLoading} = useDeleteSheet();

    const handleDelete = async (id: string) => {

        if (!token) {
            addToast('Failed to delete - Invalid token', 'error');
            return;
        }

        const result = await deleteSheet(id, token);

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


export default function SheetList() {
    const {showModal} = useContext(UIContext);
    const {sheets, refreshSheets, isLoading} = useGetSheets();
    

    const handleAddSheet = () => {
            showModal(
                <Modal title={'Add Sheet'}>
                    <SheetForm refreshData={refreshSheets}/>
                </Modal>
            )
        };

    const showEditForm = (sheet: Sheet) => {
        showModal(
            <Modal title={"Edit Sheet"}>
                <SheetForm sheet={sheet} 
                    refreshData={refreshSheets} />
            </Modal>
        )
    }

    const showDeleteConfirmation = (id: string, name: string) => {
        showModal(
            <Modal title={"Confirmation"}>
                <DeleteConfirmation id={id} 
                    name={name} 
                    refreshData={refreshSheets} />
            </Modal>
        )
    }

    // RENDER
    if (isLoading) {
        return (<Loading />)
    }

    return (
        <>
            <div className="mb-4">
                <button type="button" 
                    onClick={handleAddSheet}
                    className="px-4 py-2 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50">
                    Add Sheet
                </button>
            </div>

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
        </>
    )
}