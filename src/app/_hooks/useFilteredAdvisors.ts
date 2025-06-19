import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Advisor } from "@types";

const ITEMS_PER_PAGE = 10;

export const useFilteredAdvisors = (
    advisors: Advisor[],
    currentPage: number,
    searchQuery: string,
    sortBy: 'name' | 'income' | '',
    sortOrder: 'asc' | 'desc' | ''
) => {
    const searchParams = useSearchParams();
    const incomeParam = parseInt(searchParams.get('income') || '0');

    const debouncedSearchQuery = searchQuery.toLowerCase();

    const filteredAdvisors = useMemo(() => {
        let currentAdvisors = [...advisors];

        // Filter by search query
        if (debouncedSearchQuery) {
            currentAdvisors = currentAdvisors.filter(
                (advisor) =>
                    advisor.name.toLowerCase().includes(debouncedSearchQuery) ||
                    advisor.email.toLowerCase().includes(debouncedSearchQuery) ||
                    advisor.address.toLowerCase().includes(debouncedSearchQuery) ||
                    advisor.phone.toLowerCase().includes(debouncedSearchQuery)
            );
        }

        if (!isNaN(incomeParam) && incomeParam > 0) {
            currentAdvisors = currentAdvisors.filter(advisor =>
                advisor.income >= incomeParam - 10000 &&
                advisor.income <= incomeParam + 10000
            );
        }

        if (sortBy && sortOrder) {
            currentAdvisors.sort((a, b) => {
                let valA: string | number = '';
                let valB: string | number = '';

                if (sortBy === 'name') {
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                } else if (sortBy === 'income') {
                    valA = a.income;
                    valB = b.income;
                }

                if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return currentAdvisors;
    }, [advisors, debouncedSearchQuery, incomeParam, sortBy, sortOrder]);

    const totalPages = Math.ceil(filteredAdvisors.length / ITEMS_PER_PAGE);

    const paginatedAdvisors = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredAdvisors.slice(startIndex, endIndex);
    }, [filteredAdvisors, currentPage]);

    return {
        paginatedAdvisors,
        totalPages,
        totalItems: filteredAdvisors.length,
    };
};
