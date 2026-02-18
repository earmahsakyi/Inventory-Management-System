// format a date string to readable format
export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GH", {
    day: "numeric", month: "short", year: "numeric"
  });

// relative time e.g. "2 days ago"
export const getRelativeDate = (dateStr: string) => {
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

export const formatGHS = (amount: number) =>
  amount.toLocaleString("en-GH", { style: "currency", currency: "GHS" });