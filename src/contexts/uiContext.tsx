import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { NotificationType } from '../shared/types/common.type';

type UIContextType = {
	addToast: (message: string, type?: NotificationType) => void;
	removeToast: (id: string) => void;
	showModal: (content: ReactNode) => void;
	closeModal: () => void;
};

export const UIContext = createContext<UIContextType>({
	addToast: () => {},
	removeToast: () => {},
	showModal: () => {},
	closeModal: () => {},
});

export function useUI(): UIContextType {
	const context = useContext(UIContext);

	if (!context) throw new Error('useUI() must be used within a UIProvider');

	return context;
}
