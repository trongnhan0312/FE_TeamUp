export const timeToTimeSpan = (hours, minutes = 0) => {
  const totalTicks = (hours * 60 + minutes) * 60 * 10000000
  return { ticks: totalTicks }
}

export const timeSpanToTime = (timeSpan) => {
  if (!timeSpan || !timeSpan.ticks) return { hours: 0, minutes: 0 }
  const totalMinutes = timeSpan.ticks / (60 * 10000000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return { hours, minutes }
}

export const formatTimeDisplay = (hours, minutes = 0) => {
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`
}

export const formatDateForAPI = (date) => {
  if (!date) return null
  return date.toISOString().split("T")[0]
}

export const formatDateTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};