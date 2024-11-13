import { spigenAxios } from "@/axiosIntercepter";
export const createUomEntry = async (wise: any, data: any) => {
  const response = await spigenAxios.post("/uom/insert", {
    wise,
    data,
  });

  return response;
};
export const listOfUom = async () => {
  const response = await spigenAxios.get("/uom");
  //console.log("here in api");

  return response;
};
export const componentList = async () => {
  const response = await spigenAxios.get("/component", {
    params: { _: 1717993845490 },
  });

  return response;
};
export const serviceList = async () => {
  const response = await spigenAxios.get("/component/service", {
    params: { _: 1718005226978 },
  });

  return response;
};
export const saveService = async (payload: any) => {
  const response = await spigenAxios.post("/component/addServices", payload);

  return response;
};
export const saveEditedService = async (payload: any) => {
  const response = await spigenAxios.post(
    "/component/updateServiceComponent",
    payload
  );

  return response;
};
export const hsnList = async (search: any) => {
  const response = await spigenAxios.post("backend/searchHsn", {
    searchTerm: search,
  });
  //console.log("here in api", response);
  return response;
};
export const insertProduct = async (payload: any) => {
  const response = await spigenAxios.post("/products/insertProduct", payload);
  //console.log("here in api", response);
  return response;
};
export const servicesaddition = async (payload: any) => {
  const response = await spigenAxios.post("/component/addServices", payload);
  //console.log("here in api", response);
  return response;
};
export const componentMapList = async () => {
  const response = await spigenAxios.get("/component/fetchVendorMapComponents");
  //console.log("here in api", response);
  return response;
};
export const componentMapListCustomers = async () => {
  const response = await spigenAxios.get(
    "/component/fetchCustomerMapComponents"
  );
  //console.log("here in api", response);
  return response;
};
export const saveMapCustomer = async (payload: any) => {
  const response = await spigenAxios.post(
    "/component/saveMapCustomer",
    payload
  );
  //console.log("here in api", response);
  return response;
};
export const getComponentsByNameAndNo = async (search: any) => {
  const response = await spigenAxios.post("/backend/getComponentByNameAndNo", {
    search: search,
  });
  //console.log("here in api", response);
  return response;
};
export const getProductsByNameAndNo = async (search: any) => {
  const response = await spigenAxios.post("/backend/getProductByNameAndNo", {
    search: search,
  });
  //console.log("here in api", response);
  return response;
};
export const getComponentsList = async (search: any) => {
  const response = await spigenAxios.post("/rate/getcomponents", {
    search: search,
  });
  //console.log("here in api", response);
  return response;
};

export const getProductList = async () => {
  const response = await spigenAxios.get("/products");
  //console.log("here in api", response);
  return response;
};
export const getProductDetails = async (val: any) => {
  const response = await spigenAxios.post("/products/getProductForUpdate", {
    product_key: val,
  });
  //console.log("here in api", response);
  return response;
};
export const updateProductDetails = async (val: any) => {
  const response = await spigenAxios.post("/products/updateProduct", val);
  //console.log("here in api", response);
  return response;
};
export const getCustomerList = async (val: any) => {
  const response = await spigenAxios.post("/others/customerList", {
    search: val,
  });
  //console.log("here in api", response);
  return response;
};
export const getGroupList = async () => {
  const response = await spigenAxios.get("/groups/allGroups");
  //console.log("here in api", response);
  return response;
};
export const createNewGroup = async (values: any) => {
  const response = await spigenAxios.post("/groups/insert", {
    group_name: values.group,
  });
  //console.log("here in api", response);
  return response;
};
export const fetchLocationList = async () => {
  const response = await spigenAxios.post("/location/fetchLocationTree");
  //console.log("here in api", response);
  return response;
};
export const fetchStateList = async (val: any) => {
  const response = await spigenAxios.post("backend/stateList", {
    search: val,
  });
  //console.log("here in api", response);
  return response;
};
export const fetchBillingAddess = async () => {
  const response = await spigenAxios.get("/billingAddress/getAll", {
    params: { _: "1718169626779" },
  });
  //console.log("here in api", response);
  return response;
};

export const fetchShippingAddress = async () => {
  const response = await spigenAxios.get("/shippingAddress/getAll", {
    params: {
      _: "1718170508727",
    },
  });
  return response;
};
export const fetchBomTypeWise = async (wise: any) => {
  const response = await spigenAxios.post("/bom/fetchBOMtypeWise", {
    wise: wise,
  });
  //console.log("here in api", response);
  //console.log("here in api", response);
  //console.log("here in aupdateComponentpi", response);
  return response;
};

export const fetchMapComponent = async (search: any) => {
  const response = await spigenAxios.get(`bom/fetchMapComponent/${search}`);
  //console.log("here in api", response);
  return response;
};
export const fetchProductInBom = async (search: any) => {
  const response = await spigenAxios.post(`/bom/fetchProductInBom`, {
    subject_id: search,
  });
  //console.log("here in api", response);
  return response;
};
export const fetchCountryList = async () => {
  const response = await spigenAxios.get("/others/countries");
  //console.log("here in api", response);
  return response;
};
export const fetchState = async () => {
  const response = await spigenAxios.get("/others/states");
  //console.log("here in api", response);
  return response;
};
export const createNewClientEntry = async (obj: any) => {
  const response = await spigenAxios.post("/client/createclient", obj);
  //console.log("here in api", response);
  return response;
};
export const viewListClientEntry = async (obj: any) => {
  const response = await spigenAxios.get("client/viewclients", obj);
  //console.log("here in api", response);
  return response;
};
export const getParentLocationOptions = async (search: any) => {
  const response = await spigenAxios.post("/location/fetchLocation", {
    searchTerm: search,
  });
  return response;
};
export const insertLoations = async (payload: any) => {
  const response = await spigenAxios.post("/location/insertLocation", payload);
  return response;
};
export const fetchAllVendorList = async (search: any) => {
  const response = await spigenAxios.get("/vendor/getAll", {
    params: { searchTerm: search },
  });
  return response;
};
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Fetches a list of all branches associated with a specific vendor.
 *
 * @param code - The vendor ID for which to retrieve branch information.
 * @returns A promise that resolves to the response containing the list of branches.
 */
/******  9df202e2-e37a-4b4d-ac0a-d7d2aa08869f  *******/ export const fetchAllBranchList =
  async (code: any) => {
    const response = await spigenAxios.post("vendor/getAllBranchList", {
      vendor_id: code,
    });
    return response;
  };
export const fetchAllBranchDetails = async (code: any) => {
  const response = await spigenAxios.post("/vendor/getBranchDetails", {
    addresscode: code,
  });
  return response;
};
export const fetchAllDetailsOfVendor = async (code: any) => {
  const response = await spigenAxios.post("/vendor/getVendor", {
    vendor_id: code,
  });
  return response;
};
export const fetchAllListOfVendor = async () => {
  const response = await spigenAxios.get("/vendor/getAll", {
    params: { _: 1725514863391 },
  });
  return response;
};
export const fetchListOfVendor = async (search: any) => {
  const response = await spigenAxios.get("/backend/vendorList", {
    params: { search: search },
  });
  return response;
};
export const fetchListOfPendingFg = async () => {
  const response = await spigenAxios.post("/fgIN/pending");
  return response;
};
export const fetchListOfCompletedFg = async (wise: any, dataString: any) => {
  const response = await spigenAxios.post("/fgIN/fgInCompleted", {
    searchBy: wise,
    searchValue: dataString,
  });
  return response;
};
export const fetchListOfCompletedFgOut = async (payload: any) => {
  const response = await spigenAxios.post("/fgout/fetchFgOutRpt", payload);
  return response;
};
export const fetchListOfProjectId = async (search: any) => {
  const response = await spigenAxios.post("/backend/poProjectName", {
    search: search,
  });
  return response;
};
//////////////////////query

export const fetchListOfQ1 = async (payload: any) => {
  const response = await spigenAxios.post("/itemQueryA/fetchRM_logs", payload);
  return response;
};
export const fetchListOfQ2 = async (payload: any) => {
  const response = await spigenAxios.post(
    "/itemQueryL/fetchItemquery",
    payload
  );
  return response;
};
export const itemQueryL = async (payload: any) => {
  const response = await spigenAxios.post("/itemQueryL", payload);
  return response;
};
export const fetchCustomerComponentsByPart = async (payload: any) => {
  const response = await spigenAxios.post(
    "/component/fetchCustomerComponentsByPart",
    payload
  );
  return response;
};
export const fetchListOfQ3 = async (payload: any) => {
  const response = await spigenAxios.post("/skuQueryA/fetchSKU_logs", payload);
  return response;
};
///////////////////
export const fetchListOfMINRegister = async (payload: any) => {
  const response = await spigenAxios.post(
    "/transaction/transactionIn",
    payload
  );
  return response;
};
export const fetchListOfMINRegisterOut = async (payload: any) => {
  const response = await spigenAxios.post(
    "/transaction/transactionOut",
    payload
  );
  return response;
};
export const fetchR2 = async (payload: any) => {
  const response = await spigenAxios.post("/report2", payload);
  return response;
};
export const fetchR3 = async (payload: any) => {
  const response = await spigenAxios.post("/report3", payload);
  return response;
};
export const fetchR4 = async (payload: any) => {
  const response = await spigenAxios.get(
    "/report4/allItemClosingStock",
    payload
  );
  return response;
};
export const fetchR6 = async (payload: any) => {
  const response = await spigenAxios.post("/rate/componentRate", payload);
  return response;
};
export const getComponentDetailsForServices = async (payload: any) => {
  const response = await spigenAxios.post("/component/fetchUpdateComponent", {
    componentKey: payload,
  });
  return response;
};
export const getProductDetailsForEdit = async (payload: any) => {
  const response = await spigenAxios.post("/products/getProductForUpdate", {
    product_key: payload,
  });
  return response;
};
export const getListOFViewCustomers = async (payload: any) => {
  const response = await spigenAxios.get("/client/viewclients", {
    params: { componentKey: payload },
  });
  return response;
};

export const getListOFbranchDetails = async (payload: any) => {
  const response = await spigenAxios.get(
    `/client/branchDetails?addressID=${payload}`,
    {
      componentKey: payload,
    }
  );
  return response;
};

export const getListOFViewCustomersOfSelected = async (payload: any) => {
  const response = await spigenAxios.get(
    `/client/viewBranch?client=${payload}`
  );
  return response;
};
export const getListFgIn = async (payload: any) => {
  const response = await spigenAxios.post("/fgIN/getFGs", payload);
  return response;
};
export const getListOfProductSKU = async (payload: any) => {
  const response = await spigenAxios.post("/backend/fetchProduct", payload);
  return response;
};
export const getdetailsOfUpdateComponent = async (payload: any) => {
  const response = await spigenAxios.post(
    "/component/fetchUpdateComponent",
    payload
  );
  return response;
};
export const updateComponentofMaterial = async (payload: any) => {
  const response = await spigenAxios.post(
    "/component/updateComponent",
    payload
  );
  return response;
};
export const updateProductMaterial = async (payload: any) => {
  const response = await spigenAxios.post("products/updateProduct", payload);
  return response;
};
export const saveComponentMap = async (payload: any) => {
  const response = await spigenAxios.post("/component/saveMapVen", payload);
  return response;
};
export const saveProductDetails = async (payload: any) => {
  const response = await spigenAxios.post("/products/updateProduct", payload);
  return response;
};
export const saveGroups = async (payload: any) => {
  const response = await spigenAxios.post("/groups/insert", payload);
  return response;
};
export const vendorGetAllBranchList = async (payload: any) => {
  const response = await spigenAxios.post("/vendor/getAllBranchList", {
    vendor_id: payload,
  });
  return response;
};
export const vendorGetAllDetailsFromSelectedBranch = async (payload: any) => {
  const response = await spigenAxios.post("/vendor/getBranchDetails", {
    addresscode: payload,
  });
  return response;
};
export const vendorUpdateSelectedBranch = async (payload: any) => {
  const response = await spigenAxios.post(
    "/vendor/updateBranchDetails",
    payload
  );
  return response;
};
export const vendorUpdatedetails = async (payload: any) => {
  const response = await spigenAxios.post("/vendor/getVendor", {
    vendor_id: payload,
  });
  return response;
};
export const vendorUpdateSave = async (payload: any) => {
  const response = await spigenAxios.post("/vendor/updateVendor", payload);
  return response;
};
export const vendoradd = async (payload: any) => {
  const response = await spigenAxios.post("/vendor/addVendor", payload);
  return response;
};
export const addClient = async (payload: any) => {
  const response = await spigenAxios.post("/client/createclient", payload);
  return response;
};
export const addbranchToClient = async (payload: any) => {
  const response = await spigenAxios.post("/client/addBranch", payload);
  return response;
};
export const fetchHSN = async (payload: any) => {
  const response = await spigenAxios.post("/backend/fetchHsn", {
    component: payload,
  });
  return response;
};
export const mapHSN = async (payload: any) => {
  const response = await spigenAxios.post("/backend/mapHsn", payload);
  return response;
};
export const fetchEdditBomStage2 = async (payload: any) => {
  const response = await spigenAxios.post(
    "/bom/fetchComponentsInBomForUpdate",
    {
      subject_id: payload,
    }
  );
  return response;
};

export const fetchbomComponents = async (payload: any) => {
  const response = await spigenAxios.post("/bom/bomComponents", {
    subject_id: payload,
  });
  return response;
};
export const fetchViewComponentsOfManage = async (payload: any) => {
  const response = await spigenAxios.post(
    "/purchaseOrder/fetchComponentList4PO",
    {
      poid: payload,
    }
  );
  return response;
};
// /purchaseOrder/fetchComponentList4PO
export const fetchBomForProduct = async (payload: any) => {
  const response = await spigenAxios.post("/backend/fetchBomForProduct", {
    search: payload,
  });
  return response;
};
// /purchaseOrder/fetchComponentList4PO
