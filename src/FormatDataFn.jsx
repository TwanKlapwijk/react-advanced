export function formatDate(timestampStr) {
  const timestamp = new Date(timestampStr);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  return new Intl.DateTimeFormat("nl-NL", options).format(timestamp);
}
