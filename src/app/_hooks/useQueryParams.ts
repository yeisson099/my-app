import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export const useQueryParams = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentQueryParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

    const setQueryParam = useCallback(
        (key: string, value: string | number | boolean | null | undefined) => {
            const newParams = new URLSearchParams(currentQueryParams.toString());

            if (value === null || value === undefined || value === '') {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }

            const newUrl = `${pathname}?${newParams.toString()}`;
            router.push(newUrl, { scroll: false });
        },
        [currentQueryParams, pathname, router]
    );

    const setQueryParams = useCallback(
        (updates: Record<string, string | number | boolean | null | undefined>) => {
            const newParams = new URLSearchParams(currentQueryParams.toString());

            for (const key in updates) {
                if (Object.prototype.hasOwnProperty.call(updates, key)) {
                    const value = updates[key];
                    if (value === null || value === undefined || value === '') {
                        newParams.delete(key);
                    } else {
                        newParams.set(key, String(value));
                    }
                }
            }

            const newUrl = `${pathname}?${newParams.toString()}`;
            router.push(newUrl, { scroll: false });
        },
        [currentQueryParams, pathname, router]
    );

    return {
        queryParams: currentQueryParams,
        setQueryParam,
        setQueryParams,
    };
};