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

type ApiErrorList = {
  response?: {
    data?: {
      message?: string | string[];
      data?: { errors?: string[] } | null;
    };
  };
};

export const getApiErrorList = (error: unknown, fallback = "Something went wrong"): string[] => {
  const errors = (error as ApiErrorList).response?.data?.data?.errors;
  if (Array.isArray(errors) && errors.length > 0) return errors;
  return [getApiErrorMessage(error, fallback)];
};