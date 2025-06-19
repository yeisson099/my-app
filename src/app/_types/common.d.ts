export type ApiResponse<T> = T[];

export type SingleAdvisorResponse = {
    advisor: Advisor;
};
  
export type AlertMessage = {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
};

export type PaginationState = {
    currentPage: number;
    itemsPerPage: number;
};
  

export type SortState = {
    sortBy: 'name' | 'income' | '';
    sortOrder: 'asc' | 'desc' | '';
};