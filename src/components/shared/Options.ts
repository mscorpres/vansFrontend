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
