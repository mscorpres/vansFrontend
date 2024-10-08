import { spigenAxios } from "@/axiosIntercepter";
export const createUomEntry = async (wise, data) => {
  const response = await spigenAxios.post("/uom/insert", {
    wise,
    data,
  });

  return response;
};
export const listOfUom = async () => {
  const response = await spigenAxios.get("/uom");
  console.log("here in api");

  return response;
};
export const componentList = async () => {
  const response = await spigenAxios.get("/component", {
    _: 1717993845490,
  });

  return response;
};
export const serviceList = async () => {
  const response = await spigenAxios.get("/component/service", {
    _: 1718005226978,
  });

  return response;
};
export const hsnList = async (search) => {
  const response = await spigenAxios.post("backend/searchHsn", {
    searchTerm: search,
  });
  console.log("here in api", response);
  return response;
};
export const servicesaddition = async (payload) => {
  const response = await spigenAxios.post("/component/addServices", payload);
  console.log("here in api", response);
  return response;
};
export const componentMapList = async () => {
  const response = await spigenAxios.get("/component/fetchVendorMapComponents");
  console.log("here in api", response);
  return response;
};
export const getComponentsByNameAndNo = async (search) => {
  const response = await spigenAxios.post("/backend/getComponentByNameAndNo", {
    search: search,
  });
  console.log("here in api", response);
  return response;
};
export const getProductsByNameAndNo = async (search) => {
  const response = await spigenAxios.post("/backend/getProductByNameAndNo", {
    search: search,
  });
  console.log("here in api", response);
  return response;
};
export const getComponentsList = async (search) => {
  const response = await spigenAxios.post("/rate/getcomponents", {
    search: search,
  });
  console.log("here in api", response);
  return response;
};

export const getProductList = async () => {
  const response = await spigenAxios.get("/products");
  console.log("here in api", response);
  return response;
};
export const getProductDetails = async (val) => {
  const response = await spigenAxios.post("/products/getProductForUpdate", {
    product_key: val,
  });
  console.log("here in api", response);
  return response;
};
export const updateProductDetails = async (val) => {
  const response = await spigenAxios.post("/products/updateProduct", val);
  console.log("here in api", response);
  return response;
};
export const getCustomerList = async (val) => {
  const response = await spigenAxios.post("/others/customerList", {
    search: val,
  });
  console.log("here in api", response);
  return response;
};
export const getGroupList = async () => {
  const response = await spigenAxios.get("/groups/allGroups");
  console.log("here in api", response);
  return response;
};
export const createNewGroup = async (values) => {
  const response = await spigenAxios.post("/groups/insert", {
    group_name: values.group,
  });
  console.log("here in api", response);
  return response;
};
export const fetchLocationList = async () => {
  const response = await spigenAxios.post("/location/fetchLocationTree");
  console.log("here in api", response);
  return response;
};
export const fetchStateList = async (val) => {
  const response = await spigenAxios.post("backend/stateList", {
    search: val,
  });
  console.log("here in api", response);
  return response;
};
export const fetchBillingAddess = async () => {
  const response = await spigenAxios.get("/billingAddress/getAll", {
    _: "1718169626779",
  });
  console.log("here in api", response);
  return response;
};

export const fetchShippingAddess = async () => {
  const response = await spigenAxios.get("shippingAddress/getAll", {
    _: "1718170508727",
  });
  console.log("here in api", response);
  return response;
};
export const fetchBomTypeWise = async (wise) => {
  const response = await spigenAxios.post("/bom/fetchBOMtypeWise", {
    wise: wise,
  });
  console.log("here in api", response);
  return response;
};
export const fetchMapComponent = async (search) => {
  const response = await spigenAxios.get(`bom/fetchMapComponent/${search}`);
  console.log("here in api", response);
  return response;
};
export const fetchProductInBom = async (search) => {
  const response = await spigenAxios.post(`/bom/fetchProductInBom`, {
    subject_id: search,
  });
  console.log("here in api", response);
  return response;
};
export const fetchCountryList = async (search) => {
  const response = await spigenAxios.get("/others/countries");
  console.log("here in api", response);
  return response;
};
export const fetchState = async (search) => {
  const response = await spigenAxios.get("/others/states");
  console.log("here in api", response);
  return response;
};
export const createNewClientEntry = async (obj) => {
  const response = await spigenAxios.post("/client/createclient", obj);
  console.log("here in api", response);
  return response;
};
export const viewListClientEntry = async (obj) => {
  const response = await spigenAxios.get("client/viewclients", obj);
  console.log("here in api", response);
  return response;
};
export const getParentLocationOptions = async (search) => {
  const response = await spigenAxios.post("/location/fetchLocation", {
    searchTerm: search,
  });
  return response;
};
export const fetchAllVendorList = async (search) => {
  const response = await spigenAxios.get("/vendor/getAll", {
    searchTerm: search,
  });
  return response;
};
export const fetchAllBranchList = async (code) => {
  const response = await spigenAxios.post("vendor/getAllBranchList", {
    vendor_id: code,
  });
  return response;
};
export const fetchAllBranchDetails = async (code) => {
  const response = await spigenAxios.post("/vendor/getBranchDetails", {
    addresscode: code,
  });
  return response;
};
export const fetchAllDetailsOfVendor = async (code) => {
  const response = await spigenAxios.post("/vendor/getVendor", {
    vendor_id: code,
  });
  return response;
};
export const fetchAllListOfVendor = async (code) => {
  const response = await spigenAxios.get("/vendor/getAll", {
    _: 1725514863391,
  });
  return response;
};
export const fetchListOfVendor = async (search) => {
  const response = await spigenAxios.get("/backend/vendorList", {
    search: search,
  });
  return response;
};
export const fetchListOfPendingFg = async (search) => {
  const response = await spigenAxios.post("/fgIN/pending");
  return response;
};
export const fetchListOfCompletedFg = async (wise, dataString) => {
  const response = await spigenAxios.post("/fgIN/fgInCompleted", {
    searchBy: wise,
    searchValue: dataString,
  });
  return response;
};
export const fetchListOfCompletedFgOut = async (dataString) => {
  const response = await spigenAxios.post("/fgout/fetchFgOutRpt", {
    date: dataString,
    method: "O",
  });
  return response;
};
export const fetchListOfProjectId = async (search) => {
  const response = await spigenAxios.post("/backend/poProjectName", {
    search: search,
  });
  return response;
};
//////////////////////query

export const fetchListOfQ1 = async (payload) => {
  const response = await spigenAxios.post("/itemQueryA/fetchRM_logs", payload);
  return response;
};
export const fetchListOfQ2 = async (payload) => {
  const response = await spigenAxios.post(
    "/itemQueryL/fetchItemquery",
    payload
  );
  return response;
};
export const fetchListOfQ3 = async (payload) => {
  const response = await spigenAxios.post("/skuQueryA/fetchSKU_logs", payload);
  return response;
};
///////////////////
export const fetchListOfMINRegister = async (payload) => {
  const response = await spigenAxios.post(
    "/transaction/transactionIn",
    payload
  );
  return response;
};
export const fetchListOfMINRegisterOut = async (payload) => {
  const response = await spigenAxios.post(
    "/transaction/transactionOut",
    payload
  );
  return response;
};
export const fetchR2 = async (payload) => {
  const response = await spigenAxios.post("/report2", payload);
  return response;
};
export const fetchR3 = async (payload) => {
  const response = await spigenAxios.post("/report3", payload);
  return response;
};
export const fetchR4 = async (payload) => {
  const response = await spigenAxios.get(
    "/report4/allItemClosingStock",
    payload
  );
  return response;
};
export const fetchR6 = async (payload) => {
  const response = await spigenAxios.get("/rate/componentRate", payload);
  return response;
};
export const getComponentDetailsForServices = async (payload) => {
  const response = await spigenAxios.post("/component/fetchUpdateComponent", {
    componentKey: payload,
  });
  return response;
};
export const getProductDetailsForEdit = async (payload) => {
  const response = await spigenAxios.post("/products/getProductForUpdate", {
    product_key: payload,
  });
  return response;
};
export const getListOFViewCustomers = async (payload) => {
  const response = await spigenAxios.get("/client/viewclients", {
    componentKey: payload,
  });
  return response;
};
export const getListFgIn = async (payload) => {
  const response = await spigenAxios.post("/fgIN/getFGs", payload);
  return response;
};
export const getListOfProductSKU = async (payload) => {
  const response = await spigenAxios.post("/backend/fetchProduct", payload);
  return response;
};
export const getdetailsOfUpdateComponent = async (payload) => {
  const response = await spigenAxios.post(
    "/component/fetchUpdateComponent",
    payload
  );
  return response;
};
export const updateComponentofMaterial = async (payload) => {
  const response = await spigenAxios.post(
    "/component/updateComponent",
    payload
  );
  return response;
};
export const saveComponentMap = async (payload) => {
  const response = await spigenAxios.post("/component/saveMapVen", payload);
  return response;
};
export const saveProductDetails = async (payload) => {
  const response = await spigenAxios.post("/products/updateProduct", payload);
  return response;
};
export const saveGroups = async (payload) => {
  const response = await spigenAxios.post("/groups/insert", payload);
  return response;
};
export const vendorGetAllBranchList = async (payload) => {
  const response = await spigenAxios.post("/vendor/getAllBranchList", {
    vendor_id: payload,
  });
  return response;
};
export const vendorGetAllDetailsFromSelectedBranch = async (payload) => {
  const response = await spigenAxios.post("/vendor/getBranchDetails", {
    addresscode: payload,
  });
  return response;
};
export const vendorUpdateSelectedBranch = async (payload) => {
  const response = await spigenAxios.post(
    "/vendor/updateBranchDetails",
    payload
  );
  return response;
};
export const vendorUpdatedetails = async (payload) => {
  const response = await spigenAxios.post("/vendor/getVendor", {
    vendor_id: payload,
  });
  return response;
};
export const vendorUpdateSave = async (payload) => {
  const response = await spigenAxios.post("/vendor/updateVendor", payload);
  return response;
};
export const vendoradd = async (payload) => {
  const response = await spigenAxios.post("/vendor/addVendor", payload);
  return response;
};
export const addClient = async (payload) => {
  const response = await spigenAxios.post("/client/createclient", payload);
  return response;
};
export const addbranchToClient = async (payload) => {
  const response = await spigenAxios.post("/client/addBranch", payload);
  return response;
};
