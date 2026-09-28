import { useUI } from '../../../contexts/uiContext';
import { useAuth } from '../../../contexts/authContext';
import { useGetGenres, useDeleteGenre } from '../hooks/genreHooks';
import { type Genre } from '../types/genre.type';
import Button from '../../../shared/components/Button';
import Loading from '../../../shared/components/Loading';
import Modal from '../../../shared/components/Modal';
import GenreForm from './GenreForm';

// TODO: Turn delete confirmation into reusable component
function DeleteConfirmation({
	id,
	name,
	refreshData,
}: {
	id: string;
	name: string;
	refreshData: () => void;
}) {
	const { token } = useAuth();
	const { addToast, closeModal } = useUI();
	const { deleteGenre, isLoading } = useDeleteGenre();

	const handleDelete = async (id: string) => {
		if (!token) {
			addToast('Failed to delete - Invalid token', 'error');
			return;
		}

		const result = await deleteGenre(id, token);

		if (result.success) {
			refreshData();
			closeModal();
			addToast(result.message);
		} else {
			addToast(result.message, 'error');
		}
	};

	return (
		<>
			<p>
				Are you sure want to delete <strong>{name}</strong>?
			</p>

			<div className="mt-4 flex flex-nowrap gap-3">
				<Button
					fullWidth={true}
					type="button"
					loading={isLoading}
					onClick={() => handleDelete(id)}>
					{isLoading ? "Deleting..." : "Yes"}
				</Button>

				<Button
					fullWidth={true}
					type="button"
					variant="secondary"
					onClick={closeModal}>
					No
				</Button>
			</div>
		</>
	);
}

export default function GenreList() {
	const { showModal } = useUI();
	const { genres, refreshGenres, isLoading } = useGetGenres();

	const handleAddGenre = () => {
		showModal(
			<Modal title={'Add Genre'}>
				<GenreForm refreshData={refreshGenres} />
			</Modal>,
		);
	};

	const showEditForm = (genre: Genre) => {
		showModal(
			<Modal title={'Edit Genre'}>
				<GenreForm genre={genre} refreshData={refreshGenres} />
			</Modal>,
		);
	};

	const showDeleteConfirmation = (id: string, name: string) => {
		showModal(
			<Modal title={'Confirmation'}>
				<DeleteConfirmation id={id} name={name} refreshData={refreshGenres} />
			</Modal>,
		);
	};

	return (
		<>
			<div className="flex justify-between gap-4 mb-4">
				<Button
					type="button"
					onClick={handleAddGenre}>
					Add Genre
				</Button>
			</div>

			<table
				role="table"
				className="block w-full overflow-hidden border rounded-md border-gray-300 md:table md:overflow-visible"
			>
				<caption className="sr-only">
					<h2>Genre List</h2>
				</caption>
				<thead role="rowgroup" className="hidden invisible md:table-header-group md:visible">
					<tr role="row" className="bg-gray-200">
						<th
							role="columnheader"
							scope="col"
							className="px-3 py-2 border-r border-b border-gray-300 text-left"
						>
							Name
						</th>
						<th
							role="columnheader"
							scope="col"
							className="px-3 py-2 border-b border-gray-300 text-left"
						></th>
					</tr>
				</thead>
				<tbody role="rowgroup" className="block md:table-row-group">
					{isLoading ? (
						<tr role="row" className="block bg-gray-50 md:table-row">
							<td role="cell" colSpan={2} className="block px-3 py-4 md:table-cell md:py-2">
								<div className="flex justify-center">
									<Loading />
								</div>
							</td>
						</tr>
					) : genres.length < 1 ? (
						<tr role="row" className="block bg-gray-50 md:table-row">
							<td role="cell" colSpan={2} className="block px-3 py-4 md:table-cell md:py-2">
								There is currently no data yet.
							</td>
						</tr>
					) : (
						genres.map((genre) => (
							<tr
								key={genre.id}
								role="row"
								className="block odd:bg-gray-50 even:bg-gray-100 md:table-row"
							>
								<td
									role="cell"
									className="block px-3 pt-4 pb-1 text-xl font-bold md:table-cell md:pt-2 md:pb-2 md:text-base md:font-normal"
								>
									{genre.name}
								</td>
								<td role="cell" className="block px-3 pt-2 pb-4 md:table-cell md:pt-2 md:pb-2">
									<div className="flex flex-nowrap gap-3">
										<Button
											type="button"
											size="small"
											onClick={() => showEditForm(genre)}>
											Edit
										</Button>
										<Button
											type="button"
											size="small"
											onClick={() => showDeleteConfirmation(genre.id, genre.name)}>
											Delete
										</Button>
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</>
	);
}
