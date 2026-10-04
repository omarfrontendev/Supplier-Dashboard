type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong'
): string => {
  const apiError = error as ApiErrorResponse;
  const message = apiError.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return message || fallback;
};