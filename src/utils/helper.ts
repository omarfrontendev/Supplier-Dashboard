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