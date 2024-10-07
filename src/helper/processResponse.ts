export const processResponse = (response: any) => {
    if (response.success) {
      return response;
    } else {
      console.error("Failed to fetch data");
      return [];
    }
  };
  