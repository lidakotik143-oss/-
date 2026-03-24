import { createContext, useContext } from 'react';

/**
 * AppContext — глобальный контекст приложения Cookify.
 * Содержит тему, язык, данные пользователя и общие хелперы.
 * Используй хук useApp() в любом компоненте вместо пропсов.
 */
export const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);
