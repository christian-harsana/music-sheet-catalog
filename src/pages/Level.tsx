import { useContext } from 'react';
import Navigation from "../components/Navigation";
import LevelList from '../components/LevelList';
import LevelForm from '../components/LevelForm';
import Modal from '../components/Modal';
import { UIContext } from '../contexts/UIContext';


export default function Level() {

    const {showModal} = useContext(UIContext);

    const handleAddLevel = () => {
        showModal(
            <Modal title={'Add Level'}>
                <LevelForm />
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
                        <h1 className="font-semibold text-2xl">Level</h1>

                        <button type="button" 
                            onClick={handleAddLevel}
                            className="px-4 py-2 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50">
                            Add Level
                        </button>                        
                    </div>

                    <div className="mb-4">
                        <LevelList />
                    </div>
                </div>
            </main>
        </div>
    )
}