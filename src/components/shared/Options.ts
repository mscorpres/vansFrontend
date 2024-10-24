export const taxType = [
  {
    label: "Local",
    value: "L",
  },
  {
    label: "InterState",
    value: "I",
  },
];
export const isEnabledOptions = [
  {
    label: "Yes",
    value: "yes",
  },
  {
    label: "No",
    value: "no",
  },
];

export const gstRateList = [
  {
    value: "0",
    label: "0 %",
  },
  {
    value: "5",
    label: "5 %",
  },
  {
    value: "12",
    label: "12 %",
  },
  {
    value: "18",
    label: "18 %",
  },
  {
    value: "28",
    label: "28 %",
  },
];
export const exportDateRange = (dateRange) => {
  console.log("dateRange", dateRange);

  const startDate = dateRange[0]
    .toLocaleDateString("en-GB")
    .split("/")
    .reverse()
    .join("-");
  const endDate = dateRange[1]
    .toLocaleDateString("en-GB")
    .split("/")
    .reverse()
    .join("-");
  let dataString = `${startDate}-${endDate}`;
  console.log("dateString", dataString);
  return dataString;
};
export const exportDateRangespace = (dateRange) => {
  console.log("dateRange", dateRange);

  const formatDate = (date) => {
    // Format the date to dd mm yyyy
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
    const year = date.getFullYear(); // Get full year

    return `${day}-${month}-${year}`; // Return formatted date
  };

  const startDate = formatDate(dateRange[0]);
  const endDate = formatDate(dateRange[1]);
  let dataString = `${startDate} - ${endDate}`;
  console.log("dateString", dataString);
  return dataString;
};
