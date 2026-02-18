import { useContext } from "react";
import { UIContext } from "../../../contexts/UIContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { type Source } from "../types/source.type";
import Loading from "../../../shared/components/Loading";
import Modal from "../../../shared/components/Modal";
import SourceForm from "./SourceForm";
import IconSpinner from "../../../shared/components/IconSpinner";
import Pagination from "../../../shared/components/Pagination";
import { useGetSources, useDeleteSource } from "../hooks/sourceHooks";

// TODO: Turn delete confirmation into reusable component
function DeleteConfirmation({id, name, refreshData} : {id: string, name: string, refreshData: () => void}) {
    
    const {token} = useContext(AuthContext);
    const {addToast, closeModal} = useContext(UIContext);
    const {deleteSource, isLoading} = useDeleteSource();
    

    const handleDelete = async (id: string) => {

        if (!token) {
            addToast('Failed to delete - Invalid token', 'error');
            return;
        }

        const result = await deleteSource(id, token);

        if (result.success) {
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


export default function SourceList() {

    const {showModal} = useContext(UIContext);
    const {sources, refreshSources, isLoading, currentPage, totalPages, paginate} = useGetSources();

    const handleAddSource = () => {
            showModal(
                <Modal title={'Add Source'}>
                    <SourceForm refreshData={refreshSources} />
                </Modal>
            )
        }


    const showEditForm = (source: Source) => {
        showModal(
            <Modal title={"Edit Source"}>
                <SourceForm source={source}
                    refreshData={refreshSources} />
            </Modal>
        )
    }

    const showDeleteConfirmation = (id: string, name: string) => {
        showModal(
            <Modal title={"Confirmation"}>
                <DeleteConfirmation id={id} 
                    name={name}
                    refreshData={refreshSources} />
            </Modal>
        )
    }


    // RENDER
    return (
        <>
            <div className="mb-4">
                <button type="button" 
                    onClick={handleAddSource}
                    className="px-4 py-2 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50">
                    Add Source
                </button>
            </div>

            <div className="mb-3">
                <table role="table" className="block w-full overflow-hidden border rounded-md border-gray-300 md:table md:overflow-visible">
                    <caption className="sr-only">
                        <h2>Source list</h2>
                    </caption>
                    <thead role="rowgroup" className="hidden invisible md:table-header-group md:visible">
                        <tr role="row" className="bg-gray-200">
                            <th role="columnheader" scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Title</th>
                            <th role="columnheader" scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Author</th>
                            <th role="columnheader" scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Format</th>
                            <th role="columnheader" scope="col" className="px-3 py-2 border-b border-gray-300 text-left"></th>
                        </tr>
                    </thead>
                    <tbody role="rowgroup" className="block md:table-row-group"> 
                        {
                            isLoading ? (
                                <tr role="row" className="block bg-gray-50 md:table-row">
                                    <td role="cell" colSpan={4} className="block px-3 py-4 md:table-cell md:py-2">
                                        <div className='flex justify-center'>
                                            <Loading />
                                        </div>
                                    </td>
                                </tr>
                            ) : (    
                                sources.length < 1 ? (
                                    <tr role="row" className="block bg-gray-50 md:table-row">
                                        <td role="cell" colSpan={4} className="block px-3 py-4 md:table-cell md:py-2">There is currently no data yet.</td>
                                    </tr>
                                ) : (
                                    sources.map(source => 
                                        <tr key={source.id} role="row" className="block odd:bg-gray-50 even:bg-gray-100 md:table-row">
                                            <td role="cell" className="block px-3 pt-4 pb-1 text-xl font-bold md:table-cell md:pt-2 md:pb-2 md:text-base md:font-normal">{source.title}</td>
                                            <td role="cell" className="block px-3 pb-1 font-semibold before:w-15 before:inline-block before:content-[attr(data-title)':'] before:me-1.5 before:font-normal md:table-cell md:pt-2 md:pb-2 md:before:content-none md:font-normal" data-title="Author">{source.author}</td>
                                            <td role="cell" className="block px-3 pb-1 font-semibold before:w-15 before:inline-block before:content-[attr(data-title)':'] before:me-1.5 before:font-normal md:table-cell md:pt-2 md:pb-2 md:before:content-none md:font-normal" data-title="Format">{source.format}</td>
                                            <td role="cell" className="block px-3 pt-2 pb-4 md:table-cell md:pt-2 md:pb-2">
                                                <div className="flex flex-nowrap gap-3">
                                                    <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showEditForm(source)}>Edit</button>
                                                    <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showDeleteConfirmation(source.id, source.title)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={currentPage} 
                totalPages={totalPages}
                paginate={paginate}
            />
        </>
    )
}