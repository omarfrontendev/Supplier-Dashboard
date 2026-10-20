export const formatTime = (
  time?: string,
  language: "en" | "ar" = "en",
) => {
  if (!time) return "-";

  const [hours, minutes] = time.split(":").map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return "-";
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-EG" : "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  ).format(date);
};