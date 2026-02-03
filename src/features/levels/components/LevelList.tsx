import { useContext } from "react";
import { UIContext } from "../../../contexts/UIContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { useGetLevels, useDeleteLevel } from "../hooks/levelHooks";
import { type Level } from "../types/level.type";
import LevelForm from "./LevelForm";
import Loading from "../../../shared/components/Loading";
import Modal from "../../../shared/components/Modal";
import IconSpinner from "../../../shared/components/IconSpinner";

// TODO: Turn delete confirmation into reusable component
function DeleteConfirmation({id, name, refreshData} : {id: string, name: string, refreshData: () => void}) {
    
    const {token} = useContext(AuthContext);
    const {addToast, closeModal} = useContext(UIContext);
    const {deleteLevel, isLoading} = useDeleteLevel();
    
    const handleDelete = async (id: string) => {

        if (!token) {
            addToast('Failed to delete - Invalid token', 'error');
            return;
        }

        const result = await deleteLevel(id, token);

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


export default function LevelList() {
    const {showModal} = useContext(UIContext);
    const {levels, refreshLevels, isLoading } = useGetLevels();
    
    const handleAddLevel = () => {
        showModal(
            <Modal title={'Add Level'}>
                <LevelForm refreshData={refreshLevels} />
            </Modal>
        )
    }

    const showEditForm = (level: Level) => {
        showModal(
            <Modal title={"Edit Level"}>
                <LevelForm level={level} 
                    refreshData={refreshLevels} />
            </Modal>
        )
    }

    const showDeleteConfirmation = (id: string, name: string) => {
        showModal(
            <Modal title={"Confirmation"}>
                <DeleteConfirmation id={id} 
                    name={name} 
                    refreshData={refreshLevels} />
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
                    onClick={handleAddLevel}
                    className="px-4 py-2 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50">
                    Add Level
                </button>
            </div>

            <table role="table" className="block w-full overflow-hidden border rounded-md border-gray-300 md:table md:overflow-visible">
                <caption className="sr-only">
                    <h2>Level List</h2>
                </caption>
                <thead role="rowgroup" className="hidden invisible md:table-header-group md:visible">
                    <tr role="row" className="bg-gray-200">
                        <th scope="col" role="columnheader" className="px-3 py-2 border-r border-b border-gray-300 text-left">Name</th>
                        <th scope="col" role="columnheader" className="px-3 py-2 border-b border-gray-300 text-left"></th>
                    </tr>
                </thead>
                <tbody role="rowgroup" className="block md:table-row-group">
                    {
                        levels.length < 1 ? (
                            <tr role="row" className="block bg-gray-50 md:table-row">
                                <td role="cell" colSpan={2} className="block px-3 py-4 md:table-cell md:py-2">There is currently no data yet.</td>
                            </tr>
                        ) : (
                            levels.map(level => 
                                <tr key={level.id} role="row" className="block odd:bg-gray-50 even:bg-gray-100 md:table-row">
                                    <td role="cell" className="block px-3 pt-4 pb-1 text-xl font-bold md:table-cell md:pt-2 md:pb-2 md:text-base md:font-normal">{level.name}</td>
                                    <td role="cell" className="block px-3 pt-2 pb-4 md:table-cell md:pt-2 md:pb-2">
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
        </>
    )
}