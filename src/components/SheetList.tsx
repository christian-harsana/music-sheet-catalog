import React, { useState, useContext, useMemo, type ChangeEvent } from "react";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";
import { useGetGenres } from '../hooks/genreHooks';
import { useGetLevels } from '../hooks/levelHooks';
import { useGetSources } from '../hooks/sourceHooks';
import { useGetSheets, useDeleteSheet } from "../hooks/sheetHooks";
import { useDebounce } from "../hooks/utilHooks";
import type { Source } from '../types/source.type';
import type { Genre } from '../types/genre.type';
import type { Level } from '../types/level.type';
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

type SheetTableProps = {
    sheets: Sheet[],
    refreshSheets: () => void,
    sources: Source[],
    isLoadingSource: boolean,
    levels: Level[],
    isLoadingLevel: boolean,
    genres: Genre[],
    isLoadingGenre: boolean
}


function SheetTable({sheets, refreshSheets, sources, isLoadingSource, levels, isLoadingLevel, genres, isLoadingGenre} : SheetTableProps) {

    const {showModal} = useContext(UIContext);

    const showEditForm = (sheet: Sheet) => {
        showModal(
            <Modal title={'Edit Sheet'}>
                <SheetForm sheet={sheet} 
                    refreshData={refreshSheets}
                    sources={sources} 
                    isLoadingSource={isLoadingSource}
                    levels={levels}
                    isLoadingLevel={isLoadingLevel}
                    genres={genres}
                    isLoadingGenre={isLoadingGenre} />
            </Modal>
        )
    }

    const showDeleteConfirmation = (id: string, name: string) => {
        showModal(
            <Modal title={'Confirmation'}>
                <DeleteConfirmation id={id} 
                    name={name} 
                    refreshData={refreshSheets} />
            </Modal>
        )
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
                            <td colSpan={5} className="px-3 py-2">There is currently no data to display.</td>
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

const SheetTableMemo = React.memo(SheetTable);

export default function SheetList() {

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [levelFilter, setLevelFilter] = useState<string>('all');
    const [genreFilter, setGenreFilter] = useState<string>('all');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const {showModal} = useContext(UIContext);
    const {genres, isLoading: isLoadingGenre } = useGetGenres();
    const {levels, isLoading: isLoadingLevel } = useGetLevels();
    const {sources, isLoading: isLoadingSource } = useGetSources();
    const {sheets, refreshSheets, isLoading: isLoadingSheet} = useGetSheets();

    const filteredSheets = useMemo(() => {return sheets.filter(sheet => {

        if (!sheet) return false;

        const matchesTitle = sheet.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        const matchesSourceTitle = sheet.sourceTitle.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        const matchesLevel = levelFilter === "all" || String(sheet.levelId) === levelFilter;
        const matchesGenre = genreFilter === "all" || String(sheet.genreId) === genreFilter;

        return (matchesTitle || matchesSourceTitle) && matchesLevel && matchesGenre;
    })
    }, [sheets, debouncedSearchQuery, levelFilter, genreFilter]);


    const handleAddSheet = () => {
        showModal(
            <Modal title={'Add Sheet'}>
                <SheetForm refreshData={refreshSheets} 
                    sources={sources} 
                    isLoadingSource={isLoadingSource}
                    levels={levels}
                    isLoadingLevel={isLoadingLevel}
                    genres={genres}
                    isLoadingGenre={isLoadingGenre}
                    />
            </Modal>
        )
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
    }

    // RENDER
    if (isLoadingSheet) {
        return (<Loading />)
    }

    return (
        <>
            <div className="mb-4 flex flex-wrap gap-3 justify-between">
                <div className="flex flex-wrap gap-3">
                    <div className="relative w-3xs">
                        <input type="text" 
                            id="sheetSearch"
                            value={searchQuery} 
                            placeholder="Search title or source"
                            onChange={handleSearchChange}
                            className={`w-full border rounded-md ps-3 pe-10 py-2 border-gray-400 bg-gray-50`} 
                            />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" className="absolute top-2.5 right-3 fill-gray-400" aria-hidden={true}>
                            {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                        </svg>
                    </div>

                    <div className="relative w-3xs">
                        <select id="levelFilter"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLevelFilter(e.target.value)}
                            value={levelFilter}
                            className="block appearance-none w-full border rounded-md ps-3 pe-8 py-2 border-gray-400 bg-gray-50"
                            disabled={isLoadingLevel} >
                            <option value="all">All levels</option>
                            {
                                levels.map((level: Level) => 
                                    ( <option key={`level-${level.id}`} value={level.id}>{level.name}</option> )
                                )
                            }
                        </select>
                        { isLoadingLevel? (
                            <span className="absolute top-3 right-3">
                                <IconSpinner color={"dark"} />
                            </span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" 
                                aria-hidden="true" 
                                width="10"
                                className="absolute top-3.5 right-3">
                                {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                                <path d="M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                            </svg>
                        )}
                    </div>

                    <div className="relative w-3xs">
                        <select id="genreFilter"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGenreFilter(e.target.value)}
                            value={genreFilter}
                            className="block appearance-none w-full border rounded-md ps-3 pe-8 py-2 border-gray-400 bg-gray-50"
                            disabled={isLoadingGenre} >
                            <option value="all">All genres</option>
                            {
                                genres.map((genre: Genre) => 
                                    ( <option key={`genre-${genre.id}`} value={genre.id}>{genre.name}</option> )
                                )
                            }
                        </select>
                        { isLoadingLevel? (
                            <span className="absolute top-3 right-3">
                                <IconSpinner color={"dark"} />
                            </span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" 
                                aria-hidden="true" 
                                width="10"
                                className="absolute top-3.5 right-3">
                                {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                                <path d="M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                            </svg>
                        )}
                    </div>
                </div>

                <button type="button" 
                    onClick={handleAddSheet}
                    className="px-4 py-2 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50">
                    Add Sheet
                </button>
            </div>

            <SheetTableMemo sheets={filteredSheets} 
                refreshSheets={refreshSheets}
                sources={sources} 
                isLoadingSource={isLoadingSource}
                levels={levels}
                isLoadingLevel={isLoadingLevel}
                genres={genres}
                isLoadingGenre={isLoadingGenre} />
        </>
    )
}