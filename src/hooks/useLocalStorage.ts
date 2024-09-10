import { useCallback, useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T | undefined>(() => {
        const jsonValue = window.localStorage.getItem(key);
        if (jsonValue != null) return JSON.parse(jsonValue);

        if (typeof defaultValue === 'function') {
            return defaultValue();
        } else {
            return defaultValue;
        }
    });

    useEffect(() => {
        if (value === undefined) return window.localStorage.removeItem(key);
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    const remove = useCallback(() => setValue(undefined), []);

    return [value, setValue, remove] as const;
}
