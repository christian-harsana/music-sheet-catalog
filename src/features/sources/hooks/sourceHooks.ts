import { useCallback, useEffect, useState } from 'react';
import * as sourceService from '../services/sourceService';
import type { Source, SourceLookup, SourceFormData } from '../types/source.type';
import { useAuth } from '../../../contexts/authContext';
import { useError } from '../../../contexts/errorContext';
import type { PaginationData } from '../../../shared/types/common.type';
import { useUI } from '../../../contexts/uiContext';

export const useGetSourcesLookup = () => {
	const [sourcesLookup, setSourcesLookup] = useState<SourceLookup[]>([]);
	const [refresh, setRefresh] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { token, logout } = useAuth();
	const { addToast } = useUI();
	const { handleError } = useError();

	useEffect(() => {
		const fetchSourcesLookup = async () => {
			if (!token) return;

			setIsLoading(true);

			try {
				const result = await sourceService.getSourcesLookup(token);

				setSourcesLookup(result.data);
			} catch (error: unknown) {
				handleError(error, {
					onUnauthorised: logout,
					onError: (message) => addToast(message, 'error'),
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchSourcesLookup();
	}, [token, refresh]);

	const refreshSourcesLookup = useCallback(() => {
		setRefresh((prev) => prev + 1);
	}, []);

	return {
		sourcesLookup,
		refreshSourcesLookup,
		isLoading,
	};
};

export const useGetSources = () => {
	const [sources, setSources] = useState<Source[]>([]);
	const [refresh, setRefresh] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const { token, logout } = useAuth();
	const { addToast } = useUI();
	const { handleError } = useError();
	const limit = 10;
	const totalPages = paginationData?.totalPages;

	const paginate = (pageNumber: number): void => {
		setCurrentPage(pageNumber);
	};

	useEffect(() => {
		const fetchSources = async () => {
			if (!token) return;

			setIsLoading(true);

			try {
				const result = await sourceService.getSources(token, currentPage, limit);

				setSources(result.data);
				setPaginationData(result.pagination);
			} catch (error: unknown) {
				handleError(error, {
					onUnauthorised: logout,
					onError: (message) => addToast(message, 'error'),
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchSources();
	}, [token, refresh, currentPage]);

	const refreshSources = useCallback(() => {
		setRefresh((prev) => prev + 1);
	}, []);

	return {
		sources,
		refreshSources,
		isLoading,
		currentPage,
		paginate,
		totalPages,
	};
};

export const useCreateSource = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { logout } = useAuth();
	const { addToast } = useUI();
	const { handleError } = useError();

	const createSource = async (sourceData: SourceFormData, token: string) => {
		try {
			setIsLoading(true);
			const result = await sourceService.createSource(sourceData, token);
			return result;
		} catch (error: unknown) {
			handleError(error, {
				onUnauthorised: logout,
				onError: (message) => addToast(message, 'error'),
			});
		} finally {
			setIsLoading(false);
		}
	};

	return { createSource, isLoading };
};

export const useUpdateSource = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { logout } = useAuth();
	const { addToast } = useUI();
	const { handleError } = useError();

	const updateSource = async (id: string, sourceData: SourceFormData, token: string) => {
		try {
			setIsLoading(true);
			const result = await sourceService.updateSource(id, sourceData, token);
			return result;
		} catch (error: unknown) {
			handleError(error, {
				onUnauthorised: logout,
				onError: (message) => addToast(message, 'error'),
			});
		} finally {
			setIsLoading(false);
		}
	};

	return { updateSource, isLoading };
};

export const useDeleteSource = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { logout } = useAuth();
	const { addToast } = useUI();
	const { handleError } = useError();

	const deleteSource = async (id: string, token: string) => {
		try {
			setIsLoading(true);
			const result = await sourceService.deleteSource(id, token);
			return result;
		} catch (error: unknown) {
			handleError(error, {
				onUnauthorised: logout,
				onError: (message) => addToast(message, 'error'),
			});
		} finally {
			setIsLoading(false);
		}
	};

	return { deleteSource, isLoading };
};
