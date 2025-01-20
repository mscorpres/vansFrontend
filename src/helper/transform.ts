// src/utils/transform.ts

export const transformCustomerData = (data: any[]) => {
  return data?.map((item) => ({
    label: item.name,
    value: item.code,
  }));
};

export const transformOptionData = (data: any[]) => {
  if (data?.length) {
    return data?.map((item) => ({
      label: item.text,
      value: item.id,
    }));
  }
};
export const transformOptionDatahsn = (data: any[]) => {
  if (data?.length) {
    return data?.map((item) => ({
      label: item.id,
      value: item.id,
    }));
  }
};
export const transformOptionData2 = (data: any[]) => {
  let newData: any[] = data?.data;
  if (newData?.length) {
    return newData?.map((item) => ({
      label: item.text,
      value: item.id,
    }));
  }
};
export const transformOptionDataphy = (data: any[]) => {
  if (data?.length) {
    return data?.map((item) => ({
      label: item.part_no,
      value: item.part_no,
    }));
  }
};
export const transformOptionBomData = (data: any[]) => {
  if (data?.length) {
    return data?.map((item) => ({
      label: item.bomname,
      value: item.bomid,
    }));
  }
};
export const transformCurrencyData = (data: any[]) => {
  if (data?.length) {
    return data?.map((item) => ({
      label: item.currency_symbol,
      value: item.currency_id,
    }));
  }
};
export const transformPlaceData = (data: any[]) => {
  return data?.map((item) => ({
    label: item.name,
    value: item.code.toString(),
  }));
};

export const transformClientTds = (data: any[]) => {
  return data?.map((item) => ({
    label: item.tds_name,
    value: item.tds_key,
  }));
};

export const transformStateOptions = (data: any[]) => {
  return data?.map((item) => ({
    label: item.name, // Changed from 'stateName' to 'name'
    value: item.code, // Changed from 'stateCode' to 'code'
  }));
};

export const transformOptions = (
  data: any[]
): { label: string; value: string }[] => {
  // Ensure the function always returns an array

  if (data?.length) {
    return data.map((item) => ({
      label: item.text,
      value: item.id,
    }));
  }

  // Return an empty array if data is empty or undefined
  return [];
};

export const transformOptionsData = (
  data: any[]
): { label: string; value: string }[] => {
  // Ensure the function always returns an array

  if (data?.data?.length) {
    return data?.data.map((item: any) => ({
      label: item.text,
      value: item.id,
    }));
  }

  // Return an empty array if data is empty or undefined
  return [];
};
