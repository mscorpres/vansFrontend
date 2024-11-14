import moment from "moment";

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

export const vendorTypeOptions = [
  {
    value: "Vendor",
    label: "Vendor",
  },
  {
    value: "JWI",
    label: "j01",
  },
  {
    value: "Customer Return",
    label: "Customer Return",
  },
];
export const exportDateRange = (dateRange: any) => {
  console.log("dateRange", dateRange);

  // const startDate = dateRange[0]
  //   .toLocaleDateString("en-GB")
  //   .split("/")
  //   .reverse()
  //   .join("-");
  const startDate = moment(dateRange[0]).format("DD-MM-YYYY");
  const endDate = moment(dateRange[1]).format("DD-MM-YYYY");
  // const endDate = dateRange[1]
  //   .toLocaleDateString("en-GB")
  //   .split("/")
  //   .reverse()
  //   .join("-");
  let dataString = `${startDate}-${endDate}`;
  console.log("dateString", dataString);
  return dataString;
};
export const exportDateRangespace = (dateRange: any) => {
  const formatDate = (date: any) => {
    // Format the date to dd mm yyyy
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
    const year = date.getFullYear(); // Get full year

    return `${day}-${month}-${year}`; // Return formatted date
  };

  const startDate = moment(dateRange[0]).format("DD-MM-YYYY");
  const endDate = moment(dateRange[1]).format("DD-MM-YYYY");
  let dataString = `${startDate} - ${endDate}`;
  return dataString;
};
export const exportDatepace = (dateRange: any) => {
  // Log the dateRange value

  // Function to format the date into dd-mm-yyyy

  // Format the date to dd-mm-yyyy
  const day = String(dateRange.getDate()).padStart(2, "0"); // Get day and pad with zero if needed
  const month = String(dateRange.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
  const year = dateRange.getFullYear(); // Get full year

  return `${day}-${month}-${year}`; // Return formatted date
};
