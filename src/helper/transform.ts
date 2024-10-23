// src/utils/transform.ts

export const transformCustomerData = (data: any[]) => {
  console.log("data", data);

  return data?.map((item) => ({
    label: item.name,
    value: item.code,
  }));
};

export const transformOptionData = (data: any[]) => {
  // console.log("data", data);
  if (data?.length) {
    return data?.map((item) => ({
      label: item.text,
      value: item.id,
    }));
  }
};
export const transformPlaceData = (data: any[]) => {
  console.log("data", data);
  return data?.map((item) => ({
    label: item.name,
    value: item.code.toString(),
  }));
};

export const transformClientTds = (data: any[]) => {
  console.log("data", data);
  return data?.map((item) => ({
    label: item.tds_name,
    value: item.tds_key,
  }));
};
