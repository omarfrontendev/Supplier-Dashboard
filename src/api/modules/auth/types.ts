export type LoginPayload = {
    email: string;
    password: string;
};

export type LoginResponse = {
    data: {
        accessToken: string;
    };
    message: string;
};