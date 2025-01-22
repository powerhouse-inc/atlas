import { formatInTimeZone } from "date-fns-tz/formatInTimeZone";
export function getTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatDateForDisplay(
  date: Date | string,
  displayTime = true,
  isUTC = false,
) {
  const formatString = displayTime ? "HH:mm dd/MM/yy" : "dd/MM/yy";
  const timeZone = isUTC ? "UTC" : getTimeZone();
  return formatInTimeZone(date, timeZone, formatString);
}
