import { useState, useContext, useEffect } from 'react';
import { useAuth } from '../../../contexts/authContext';
import { UIContext } from '../../../contexts/UIContext';
import { api } from '../../../shared/utils/api';
import { useErrorHandler } from '../../../shared/hooks/utilHooks';

type SheetByLevel = {
	levelId: string | null;
	levelName: string | null;
	count: number;
};

type SheetByGenre = {
	genreId: string | null;
	genreName: string | null;
	count: number;
};

export const useGetDashboardSummary = () => {
	const { token, logout } = useAuth();
	const [sheetsByLevel, setSheetsByLevel] = useState<SheetByLevel[]>([]);
	const [sheetsByGenre, setSheetsByGenre] = useState<SheetByGenre[]>([]);
	const [incompleteSheetCount, setIncompleteSheetCount] = useState<number>(0);
	const [totalSheetCount, setTotalSheetCount] = useState<number>(0);
	const [totalSourceCount, setTotalSourceCount] = useState<number>(0);
	const [totalLevelCount, setTotalLevelCount] = useState<number>(0);
	const [totalGenreCount, setTotalGenreCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { handleError } = useErrorHandler();
	const { addToast } = useContext(UIContext);

	useEffect(() => {
		const fetchSummary = async () => {
			if (!token) return;

			setIsLoading(true);

			try {
				const response = await api.get(`stats`, token);
				const result = await response.json();

				setSheetsByLevel(result.data[0]);
				setSheetsByGenre(result.data[1]);
				setIncompleteSheetCount(result.data[2][0].count);
				setTotalSheetCount(result.data[3][0].count);
				setTotalSourceCount(result.data[4][0].count);
				setTotalLevelCount(result.data[5][0].count);
				setTotalGenreCount(result.data[6][0].count);
			} catch (error: unknown) {
				handleError(error, {
					onUnauthorised: logout,
					onError: (message) => addToast(message, 'error'),
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchSummary();
	}, [token]);

	return {
		sheetsByLevel,
		sheetsByGenre,
		incompleteSheetCount,
		totalSheetCount,
		totalSourceCount,
		totalLevelCount,
		totalGenreCount,
		isLoading,
	};
};
