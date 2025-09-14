export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    // Pagination fields
    totalElements?: number;
    totalPages?: number;
    currentPage?: number;
    pageSize?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
}
