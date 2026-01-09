import { useContext } from 'react';
import Navigation from "../components/Navigation";
import SheetList from '../components/SheetList';
import SheetForm from '../components/SheetForm';
import Modal from '../components/Modal';
import { UIContext } from '../contexts/UIContext';


export default function Sheet() {

    const {showModal} = useContext(UIContext);

    const handleAddSheet = () => {
        showModal(
            <Modal title={'Add Sheet'}>
                <SheetForm />
            </Modal>
        )
    }

    return(
        <div className="flex flex-nowrap">
            <div className="h-screen basis-3xs">
                <Navigation />
            </div>

            <main className="h-screen basis-full bg-gray-50 text-gray-900">
                <div className="p-6">
                    <div className="flex justify-between gap-4 mb-4">
                        <h1 className="font-semibold text-2xl">Sheet</h1>

                        <button type="button" 
                            onClick={handleAddSheet}
                            className="px-4 py-2 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50">
                            Add Sheet
                        </button>                        
                    </div>

                    <div className="mb-4">
                        <SheetList />
                    </div>
                </div>
            </main>
        </div>
    )
}