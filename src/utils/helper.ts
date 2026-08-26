export const resetFields = (fields: string[], form: any) => {
    fields.forEach(field => {
        form.setValue(field, null);
        form.clearErrors(field);
    });
};

export const mapToOptions = (data: any[], labelKey: string) => {
    return data.map((item) => ({
        label: item[labelKey] || "Unknown",
        value: item.id,
    }));
};

export const getApiErrorMessage = (
    error: any,
    fallback = 'Something went wrong'
) => {
    const message = error?.response?.data?.message;

    return Array.isArray(message)
        ? message.join(', ')
        : message || fallback;
};