export interface ShiftBody {
    id: number
    day: string;
    days: string[];
    startTime: string;
    endTime: string;
    name: string;
};

export interface CreateShiftResponse {
    success: boolean;
    data: {
        id: string;
        day: string;
        days: string[];
        startTime: string;
        endTime: string;
    };
};