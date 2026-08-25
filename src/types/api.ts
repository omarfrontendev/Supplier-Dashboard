export interface ApiResponse<T> {
    data: {
        data: {
            data: T;
        };
    };
}

export interface ApiError {
  message: string;
}

export interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}