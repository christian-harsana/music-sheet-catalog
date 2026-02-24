import React, { useContext, type ChangeEvent } from 'react';
import { UIContext } from '../../../contexts/UIContext';
import { AuthContext } from '../../../contexts/AuthContext';
import { useGetGenres } from '../../genres/hooks/genreHooks';
import { useGetLevels } from '../../levels/hooks/levelHooks';
import { useGetSourcesLookup } from '../../sources/hooks/sourceHooks';
import { useGetSheets, useDeleteSheet } from '../hooks/sheetHooks';
import type { SourceLookup } from '../../sources/types/source.type';
import type { Genre } from '../../genres/types/genre.type';
import type { Level } from '../../levels/types/level.type';
import type { Sheet } from '../types/sheet.type';
import Loading from '../../../shared/components/Loading';
import Modal from '../../../shared/components/Modal';
import SheetForm from './SheetForm';
import IconSpinner from '../../../shared/components/IconSpinner';
import Pagination from '../../../shared/components/Pagination';
import { KEYS } from '../../../shared/utils/constants';

// TODO: Turn delete confirmation into reusable component
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

type SheetTableProps = {
    sheets: Sheet[],
    refreshSheets: () => void,
    isLoadingSheet: boolean,
    sourcesLookup: SourceLookup[],
    isLoadingSource: boolean,
    levelsLookup: Level[],
    isLoadingLevel: boolean,
    genresLookup: Genre[],
    isLoadingGenre: boolean
}


function SheetTable({sheets, 
    refreshSheets, 
    isLoadingSheet,
    sourcesLookup, 
    isLoadingSource, 
    levelsLookup, 
    isLoadingLevel, 
    genresLookup, 
    isLoadingGenre} : SheetTableProps) {

    const {showModal} = useContext(UIContext);

    const showEditForm = (sheet: Sheet) => {
        showModal(
            <Modal title={'Edit Sheet'}>
                <SheetForm sheet={sheet} 
                    refreshData={refreshSheets}
                    sourcesLookup={sourcesLookup} 
                    isLoadingSource={isLoadingSource}
                    levelsLookup={levelsLookup}
                    isLoadingLevel={isLoadingLevel}
                    genresLookup={genresLookup}
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
        <table role="table" className="block w-full overflow-hidden border rounded-md border-gray-300 md:table md:overflow-visible">
            <caption className="sr-only">
                <h2>Sheet collection</h2>
            </caption>
            <thead role="rowgroup" className="hidden invisible md:table-header-group md:visible">
                <tr role="row" className="bg-gray-200">
                    <th role="columnheader" scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Title</th>
                    <th role="columnheader" scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Key</th>
                    <th role="columnheader" scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Level</th>
                    <th role="columnheader" scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Genre</th>
                    <th role="columnheader" scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Exam Piece</th>
                    <th role="columnheader" scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Composer</th>
                    <th role="columnheader" scope="col" className="px-3 py-2 border-r border-b border-gray-300 text-left">Source</th>
                    <th role="columnheader" scope="col" className="px-3 py-2 border-b border-gray-300 text-left"></th>
                </tr>
            </thead>
            <tbody role="rowgroup" className="block md:table-row-group">
                {
                    isLoadingSheet ? (
                        <tr role="row" className="block bg-gray-50 md:table-row">
                            <td role="cell" colSpan={8} className="block px-3 py-4 md:table-cell md:py-2">
                                <div className='flex justify-center'>
                                    <Loading />
                                </div>
                            </td>
                        </tr>
                    ) : (
                        sheets.length < 1 ? (
                            <tr role="row" className="block bg-gray-50 md:table-row">
                                <td role="cell" colSpan={8} className="block px-3 py-4 md:table-cell md:py-2">There is currently no data to display.</td>
                            </tr>
                        ) : (
                            sheets.map(sheet => 
                                <tr key={sheet.id} role="row" className="block odd:bg-gray-50 even:bg-gray-100 md:table-row">
                                    <td role="cell" className="block px-3 pt-4 pb-1 text-xl font-bold md:table-cell md:pt-2 md:pb-2 md:text-base md:font-normal">{sheet.title}</td>
                                    <td role="cell" className="block px-3 pb-1 font-semibold before:w-25 before:inline-block before:content-[attr(data-title)':'] before:me-1.5 before:font-normal md:table-cell md:pt-2 md:pb-2 md:before:content-none md:font-normal" data-title="Key">{sheet.key}</td>
                                    <td role="cell" className="block px-3 pb-1 font-semibold before:w-25 before:inline-block before:content-[attr(data-title)':'] before:me-1.5 before:font-normal md:table-cell md:pt-2 md:pb-2 md:before:content-none md:font-normal" data-title="Level">{sheet.levelName}</td>
                                    <td role="cell" className="block px-3 pb-1 font-semibold before:w-25 before:inline-block before:content-[attr(data-title)':'] before:me-1.5 before:font-normal md:table-cell md:pt-2 md:pb-2 md:before:content-none md:font-normal" data-title="Genre">{sheet.genreName}</td>
                                    <td role="cell" className="block px-3 pb-1 font-semibold before:w-25 before:inline-block before:content-[attr(data-title)':'] before:me-1.5 before:font-normal md:table-cell md:pt-2 md:pb-2 md:before:content-none md:font-normal" data-title="Exam Piece">{sheet.examPiece ? "Yes" : "No" }</td>
                                    <td role="cell" className="block px-3 pb-1 font-semibold before:block before:content-[attr(data-title)':'] before:me-1.5 before:font-normal md:table-cell md:pt-2 md:pb-2 md:before:content-none md:font-normal" data-title="Composer">{sheet.composer}</td>
                                    <td role="cell" className="block px-3 pb-1 font-semibold before:block before:content-[attr(data-title)':'] before:me-1.5 before:font-normal md:table-cell md:pt-2 md:pb-2 md:before:content-none md:font-normal" data-title="Source">{sheet.sourceTitle}</td>
                                    <td role="cell" className="block px-3 pt-2 pb-4 md:table-cell md:pt-2 md:pb-2">
                                        <div className="flex flex-nowrap gap-3">
                                            <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showEditForm(sheet)}>Edit</button>
                                            <button type="button" className="px-2 py-1 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-sm text-gray-50" onClick={() => showDeleteConfirmation(sheet.id, sheet.title)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )
                    )
                }
            </tbody>
        </table>
    )
}

const SheetTableMemo = React.memo(SheetTable);

export default function SheetList() {

    const {showModal} = useContext(UIContext);
    const {genres, isLoading: isLoadingGenre } = useGetGenres();
    const {levels, isLoading: isLoadingLevel } = useGetLevels();
    const {sourcesLookup, isLoading: isLoadingSourceLookup } = useGetSourcesLookup();
    const {sheets, refreshSheets, isLoading: isLoadingSheet, currentPage, paginate, totalPages, filters, filterSheets} = useGetSheets();

    const handleAddSheet = () => {
        showModal(
            <Modal title={'Add Sheet'}>
                <SheetForm refreshData={refreshSheets} 
                    sourcesLookup={sourcesLookup} 
                    isLoadingSource={isLoadingSourceLookup}
                    levelsLookup={levels}
                    isLoadingLevel={isLoadingLevel}
                    genresLookup={genres}
                    isLoadingGenre={isLoadingGenre}
                    />
            </Modal>
        )
    };

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const name = e.target.name;
        let value;

        if (e.target instanceof HTMLSelectElement) {
            value = e.target.value;
        }
        else {
            if (name === 'examPiece') {
                value = e.target.checked;
            }
            else {
                value = e.target.value;
            }
        }

        filterSheets({...filters, [name]: value });
    }

    // RENDER
    return (
        <>
            <div className="mb-4 flex flex-wrap gap-3 justify-between">
                <div className="flex flex-wrap gap-3">
                    <div className="relative w-3xs">
                        <input type="text" 
                            id="sheetSearch"
                            name="search"
                            value={filters.search} 
                            placeholder="Search title or source"
                            onChange={handleFilterChange}
                            className={`w-full border rounded-md ps-3 pe-10 py-2 border-gray-400 bg-gray-50`} 
                            />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" className="absolute top-2.5 right-3 fill-gray-400" aria-hidden={true}>
                            {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                        </svg>
                    </div>

                    <div className="relative w-3xs">
                        <select id="keyFilter"
                            name="key"
                            onChange={handleFilterChange}
                            value={filters.key}
                            className="block appearance-none w-full border rounded-md ps-3 pe-8 py-2 border-gray-400 bg-gray-50">
                            <option value="all">All keys</option>
                            {
                                KEYS.map((key, index) => 
                                    ( <option key={`key-${index}`} value={key}>{key}</option> )
                                )
                            }
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" 
                            aria-hidden="true" 
                            width="10"
                            className="absolute top-3.5 right-3">
                            {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                            <path d="M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                        </svg>
                    </div>

                    <div className="relative w-3xs">
                        <select id="levelFilter"
                            name="level"
                            onChange={handleFilterChange}
                            value={filters.level}
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
                            name="genre"
                            onChange={handleFilterChange}
                            value={filters.genre}
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

                    <div className="self-center">
                        <label htmlFor="examPieceFilter" className='flex flex-nowrap items-start'>
                            <span className='mt-0.5 mr-2'>
                                <input type="checkbox"
                                    id="examPieceFilter"
                                    name="examPiece"
                                    onChange={handleFilterChange}
                                    checked={filters.examPiece}
                                    className="block size-5 border rounded-md border-gray-400 bg-gray-50"/>
                            </span>
                            Exam piece
                        </label>
                    </div>
                </div>

                <button type="button" 
                    onClick={handleAddSheet}
                    className="px-4 py-2 border border-violet-500 hover:border-violet-600 rounded-md bg-violet-500 hover:bg-violet-600 text-gray-50">
                    Add Sheet
                </button>
            </div>

            <div className="mb-3">
                <SheetTableMemo sheets={sheets} 
                    refreshSheets={refreshSheets}
                    isLoadingSheet= {isLoadingSheet}
                    sourcesLookup={sourcesLookup}
                    isLoadingSource={isLoadingSourceLookup}
                    levelsLookup={levels}
                    isLoadingLevel={isLoadingLevel}
                    genresLookup={genres}
                    isLoadingGenre={isLoadingGenre} 
                />
            </div>

            <Pagination currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate} 
            />
        </>
    )
}