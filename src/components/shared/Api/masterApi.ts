import { spigenAxios } from "@/axiosIntercepter";
export const createUomEntry = async (wise: any, data: any) => {
  const response = await spigenAxios.post("/uom/insert", {
    wise,
    data,
  });

  return response;
};
export const createNewUomEntry = async (payload: any) => {
  const response = await spigenAxios.post("/uom/insert", payload);

  return response;
};
export const createNewSUomEntry = async (payload: any) => {
  const response = await spigenAxios.post("/suom/insert", payload);

  return response;
};
export const listOfUom = async () => {
  const response = await spigenAxios.get("/uom");

  return response;
};
export const listOfsUom = async () => {
  const response = await spigenAxios.get("/suom");
  return response;
};
export const componentList = async () => {
  const response = await spigenAxios.get("/component", {
    params: { _: 1717993845490 },
  });

  return response;
};
export const addComponentInMaterial = async (payload: any) => {
  const response = await spigenAxios.post("/component/addComponent", payload);

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
  const response = await spigenAxios.put(
    "/component/updateServiceComponent",
    payload
  );

  return response;
};
export const hsnList = async (search: any) => {
  const response = await spigenAxios.get(`backend/searchHsn/${search}`);
  return response;
};
export const insertProduct = async (payload: any) => {
  const response = await spigenAxios.post("/products/insertProduct", payload);
  return response;
};
export const servicesaddition = async (payload: any) => {
  const response = await spigenAxios.post("/component/addServices", payload);
  return response;
};
export const componentMapList = async () => {
  const response = await spigenAxios.get("/component/fetchVendorMapComponents");
  return response;
};
export const componentMapListCustomers = async () => {
  const response = await spigenAxios.get(
    "/component/fetchCustomerMapComponents"
  );
  return response;
};
export const saveMapCustomer = async (payload: any) => {
  const response = await spigenAxios.post(
    "/component/saveMapCustomer",
    payload
  );
  return response;
};
export const getComponentsByNameAndNo = async (search: any) => {
  const response = await spigenAxios.get(
    `/backend/getComponentByNameAndNo/${search}`
  );
  return response;
};
export const getProductsByNameAndNo = async (search: any) => {
  const response = await spigenAxios.post(
    `/backend/getProductByNameAndNo?search=${search}`
  );
  return response;
};
export const getComponentsList = async (search: any) => {
  const response = await spigenAxios.post("/rate/getcomponents", {
    search: search,
  });
  return response;
};

export const getProductList = async () => {
  const response = await spigenAxios.get("/products");
  return response;
};
// export const getProductDetails = async (val: any) => {
//   const response = await spigenAxios.post("/products/getProductForUpdate", {
//     product_key: val,
//   });
//   return response;
// };
// export const updateProductDetails = async (val: any) => {
//   const response = await spigenAxios.post("/products/updateProduct", val);
//   return response;
// };
export const getCustomerList = async (val: any) => {
  const response = await spigenAxios.get(
    `others/customerList?search=${val}`
    //   {
    //   search: val,
    // }
  );
  return response;
};
export const getGroupList = async () => {
  const response = await spigenAxios.get("/groups/allGroups");
  return response;
};
export const createNewGroup = async (values: any) => {
  const response = await spigenAxios.post("/groups/insert", {
    group_name: values.group,
  });
  return response;
};
export const fetchLocationList = async () => {
  const response = await spigenAxios.post("/location/fetchLocationTree");
  return response;
};
export const fetchStateList = async (val: any) => {
  const response = await spigenAxios.get(
    `backend/stateList/${val}`
    //   {
    //   search: val,
    // }
  );
  return response;
};
export const fetchBillingAddess = async () => {
  const response = await spigenAxios.get("/billingAddress/getAll", {
    params: { _: "1718169626779" },
  });
  return response;
};
export const uplaodPriceList = async (formData) => {
  const response = await spigenAxios.post("/price/upload", formData);
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
  const response = await spigenAxios.get(
    `/bom/fetchBOMtypeWise/${wise}`
    //   , {
    //   wise: wise,
    // }
  );
  return response;
};
export const fetchPartCodeDetails = async (thepartCode: any) => {
  const response = await spigenAxios.get(
    `/bom/fetchMapComponent/${thepartCode}`
  );
  return response;
};
export const insertBom = async (payload: any) => {
  const response = await spigenAxios.post("bom/insert", payload);
  return response;
};
export const fetchProductBySku = async (wise: any) => {
  const response = await spigenAxios.get(`/products/bySku?sku=${wise}`);
  return response;
};

export const fetchMapComponent = async (search: any) => {
  const response = await spigenAxios.get(`bom/fetchMapComponent/${search}`);
  return response;
};
export const fetchProductInBom = async (search: any) => {
  const response = await spigenAxios.get(`/bom/fetchProductInBom/${search}`);
  return response;
};
export const updateselectedBomComponent = async (payload: any) => {
  const response = await spigenAxios.put(`/bom/updateBomComponent`, payload);
  return response;
};
export const fetchBomDocsFiles = async (payload: any) => {
  const response = await spigenAxios.post(`/bom/fetchBomDocsFiles`, payload);
  return response;
};
export const fetchMaterialDocsFiles = async (payload: any) => {
  const response = await spigenAxios.get(
    `/component/fetchImageComponent/${payload.component}`
    // payload
  );
  return response;
};
export const fetchImageProduct = async (payload: any) => {
  const response = await spigenAxios.get(
    `/products/fetchImageProduct/${payload?.product}`
    // payload
  );
  return response;
};
export const uploadCompImg = async (formData: any) => {
  const response = await spigenAxios.post(
    "/component/upload_comp_img",
    formData
  );
  return response;
};
export const uploadProductImg = async (formData: any) => {
  const response = await spigenAxios.post(
    "/products/upload_product_img",
    formData
  );
  return response;
};
export const fetchCountryList = async () => {
  const response = await spigenAxios.get("/others/countries");
  return response;
};
export const fetchCountryListByCode = async (search?: string) => {
  const response = await spigenAxios.get(`/backend/countrieswithcode`, {
    params: { search: search || undefined },
  });
  return response;
};

export const fetchState = async () => {
  const response = await spigenAxios.get("/others/states");
  return response;
};
export const createNewClientEntry = async (obj: any) => {
  const response = await spigenAxios.post("/client/createclient", obj);
  return response;
};
export const viewListClientEntry = async (obj: any) => {
  const response = await spigenAxios.get("client/viewclients", obj);
  return response;
};
export const getParentLocationOptions = async (search: any) => {
  const response = await spigenAxios.get("/location/fetchLocation");
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
export const fetchAllBranchList = async (code: any) => {
  const response = await spigenAxios.get(`vendor/getAllBranchList/${code}`);
  return response;
};
export const fetchAllBranchDetails = async (code: any) => {
  const response = await spigenAxios.get(`/vendor/getBranchDetails/${code}`);
  return response;
};
export const fetchAllDetailsOfVendor = async (code: any) => {
  const response = await spigenAxios.get(`/vendor/getVendor/${code}`);
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
export const uploadAttachmentPurchaseOrder = async (formData: any) => {
  const response = await spigenAxios.get(
    "/purchaseOrder/uploadAttachment",
    formData
  );
  return response;
};
export const fetchListOfPendingFg = async () => {
  const response = await spigenAxios.get("/fgIN/pending");
  return response;
};
export const fetchListOfCompletedFg = async (wise: any, dataString: any) => {
  const response = await spigenAxios.get(
    `fgIN/fgInCompleted?searchBy=${wise}&searchValue=${dataString}`
    // {
    //   searchBy: wise,
    //   searchValue: dataString,
    // }
  );
  return response;
};
export const fetchListOfCompletedFgOut = async (payload: any) => {
  const response = await spigenAxios.get(
    `fgout/fetchFgOutRpt?date=${payload.date}&method=${payload.method}`,
    payload
  );
  return response;
};
export const fetchListOfProjectId = async (search: any) => {
  const response = await spigenAxios.post("/backend/poProjectName", {
    search: search,
  });
  return response;
};
export const uploadAttachmentForPO = async (formData: any) => {
  const response = await spigenAxios.post(
    "/purchaseOrder/uploadAttachment",
    formData
  );
  return response;
};
//////////////////////query

export const fetchListOfQ1 = async (payload: any) => {
  const response = await spigenAxios.get(
    `/itemQueryA/fetchRM_logs?data=${payload.data}&range=${payload.range}&wise=${payload.wise}`
  );
  return response;
};
export const fetchListOfQ2 = async (payload: any) => {
  const response = await spigenAxios.get(
    `/itemQueryL/fetchItemquery?data=${payload.data}&wise=${payload.wise}`
  );
  return response;
};
export const itemQueryL = async (payload: any) => {
  const response = await spigenAxios.get(
    `/itemQueryL?component=${payload.component}`,
    payload
  );
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
  const response = await spigenAxios.get(
    `/skuQueryA/fetchSKU_logs?sku_code=${payload.sku_code}`
    // payload
  );
  return response;
};
///////////////////
export const fetchListOfMINRegister = async (payload: any) => {
  const response = await spigenAxios.get(
    `/transaction/transactionIn?min_types=${payload.min_types}&data=${payload.data}`
  );
  return response;
};
export const fetchListOfMINRegisterOut = async (payload: any) => {
  const response = await spigenAxios.get(
    `/transaction/transactionOut?min_types=${payload.min_types}&data=${payload.data}`,
    payload
  );
  return response;
};
export const fetchR2 = async (payload: any) => {
  const response = await spigenAxios.get(
    `/report2?data=${payload.data}&wise=${payload.wise}`,
    payload
  );
  return response;
};
export const fetchR3 = async (payload: any) => {
  const response = await spigenAxios.get(
    `report3?date=${payload.date}&product=${payload.product}&subject=${payload.subject}`
    // payload
  );
  return response;
};
export const fetchR4 = async (payload: any) => {
  const response = await spigenAxios.get(
    "/report4/allItemClosingStock",
    payload
  );
  return response;
};

//report 7 for sales order
export const fetchR7 = async (payload: any) => {
  const response= await spigenAxios.get(
    `/report7?wise=${payload.wise}&data=${payload.data}`
  );
  return response;
}
export const fetchR4refreshed = async (payload: any) => {
  const response = await spigenAxios.get("/report/fetchCloseStockAll", payload);
  return response;
};
export const fetchCloseStock = async (payload: any) => {
  const response = await spigenAxios.post(`report/fetchCloseStock`, {
    component_key: payload,
  });
  return response;
};
export const fetchR6 = async (payload: any) => {
  const response = await spigenAxios.get(
    `rate/componentRate?searchData=${payload.searchData}&searchValues=${payload.searchValues}`,
    payload
  );
  return response;
};
export const getComponentDetailsForServices = async (payload: any) => {
  const response = await spigenAxios.get(
    `/component/fetchUpdateComponent/${payload}`
    // {
    //   componentKey: payload,
    // }
  );
  return response;
};
export const getProductDetailsForEdit = async (payload: any) => {

  const response = await spigenAxios.get(
    `/products/getProductForUpdate/${payload}`
    // {
    //   product_key: payload,
    // }
  );
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
    `/client/branchDetails?addressID=${payload}`
    // {
    //   componentKey: payload,
    // }
  );
  return response;
};
export const approveVendorPrice = async (payload: any) => {
  const response = await spigenAxios.post("/price/approveVendorPrice", {
    ids: payload,
  });
  return response;
};
export const updateBranchOfCustomer = async (payload: any) => {
  const response = await spigenAxios.put(
    `/client/updateBranch
`,
    payload
  );
  return response;
};
export const createVendorPrice = async (payload: any) => {
  const response = await spigenAxios.post("/price/createVendorPrice", payload);
  return response;
};
export const getVendorPrice = async (payload: any) => {
  const response = await spigenAxios.get(
    `/price/getVendorPrice?type=${payload.type}&data=${payload.data}`
    // payload
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
  const response = await spigenAxios.post(
    `/backend/fetchProduct${payload}`,
    payload
  );
  return response;
};
export const getdetailsOfUpdateComponent = async (payload: any) => {
  const response = await spigenAxios.get(
    `/component/fetchUpdateComponent/${payload.componentKey}`
    // payloadd
  );
  return response;
};
export const updateComponentofMaterial = async (payload: any) => {
  const response = await spigenAxios.put("/component/updateComponent", payload);
  return response;
};
export const updateProductMaterial = async (payload: any) => {
  const response = await spigenAxios.put("products/updateProduct", payload);
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
  const response = await spigenAxios.get(`vendor/getAllBranchList/${payload}`);
  return response;
};
export const vendorGetAllDetailsFromSelectedBranch = async (payload: any) => {
  const response = await spigenAxios.get(`/vendor/getBranchDetails/${payload}`);
  return response;
};
export const vendorUpdateSelectedBranch = async (payload: any) => {
  const response = await spigenAxios.put(
    "/vendor/updateBranchDetails",
    payload
  );
  return response;
};
export const vendorUpdatedetails = async (payload: any) => {
  const response = await spigenAxios.get(`/vendor/getVendor/${payload}`);

  return response;
};
export const vendorUpdateSave = async (payload: any) => {
  const response = await spigenAxios.put("/vendor/updateVendor", payload);
  return response;
};
export const addVendorBranch = async (payload: any) => {
  const response = await spigenAxios.post("/vendor/addVendorBranch", payload);
  return response;
};
export const costCenterCreate = async (payload: any) => {
  const response = await spigenAxios.post(
    "purchaseOrder/createCostCenter",
    payload
  );
  return response;
};
export const vendoradd = async (payload: any) => {
  try {
    const response = await spigenAxios.post("/vendor/addVendor", payload);
    return response;
  } catch (error) {
    return error;
  }
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
  const response = await spigenAxios.get(
    `/backend/fetchHsn/${payload}`
    //    {
    //   component: payload,
    // }
  );
  return response;
};
export const mapHSN = async (payload: any) => {
  const response = await spigenAxios.post("/backend/mapHsn", payload);
  return response;
};
export const fetchEdditBomStage2 = async (payload: any) => {
  const response = await spigenAxios.get(
    `/bom/fetchComponentsInBomForUpdate/${payload}`
  );
  return response;
};

export const removeAltComponent = async (payload: any) => {
  const response = await spigenAxios.delete(
    // "/bom/removeAltComponent"
    `bom/removeAltComponent?child_component=${payload.child_component}&parent_component=${payload.parent_component}&product=${payload.product}&subject=${payload.subject}&refid=${payload.refid}`
    // payload
  );
  return response;
};
export const addNewAltComponent = async (payload: any) => {
  const response = await spigenAxios.post("bom/addNewAltComponent", payload);
  return response;
};
export const getAllAlternativeComponents = async (payload: any) => {
  const response = await spigenAxios.get(
    `bom/getAllAlternativeComponents?parent_component=${payload.parent_component}&product_id=${payload.product_id}&subject_id=${payload.subjectid}`
  );
  return response;
};
export const getAlternativeComponents = async (payload: any) => {
  const response = await spigenAxios.get(
    `bom/getAlternativeComponents?subject=${payload.subject}&current_component=${payload.current_component}`
  );
  return response;
};

export const fetchbomComponents = async (payload: any) => {
  const response = await spigenAxios.get(
    `/bom/bomComponents/${payload}`
    //    {
    //   subject_id: payload,
    // }
  );
  return response;
};
export const fetchViewComponentsOfManage = async (payload: any) => {
  const response = await spigenAxios.get(
    `/purchaseOrder/fetchComponentList4PO?poid=${payload}`
  );
  return response;
};
// /purchaseOrder/fetchComponentList4PO
export const fetchBomForProduct = async (payload: any) => {
  const response = await spigenAxios.get(
    `/backend/fetchBomForProduct?search=${payload}`
    //    {
    //   search: payload,
    // }
  );
  return response;
};
export const getallItemClosingStock = async (payload: any) => {
  const response = await spigenAxios.get(
    `/customer/allItemClosingStock`
    //    {
    //   search: payload,
    // }
  );
  return response;
};
export const getCustomerStock = async (payload: any) => {
  const response = await spigenAxios.get(
    `/customer/cust_stock`
    //    {
    //   search: payload,
    // }
  );
  return response;
};
export const getAllCustomerEnquiry = async (payload: any) => {
  const response = await spigenAxios.get(
    "/customer/getAllCustomerEnquiry"
    //    {
    //   search: payload,
    // }
  );
  return response;
};
export const saveCustStockremark = async (payload: any) => {
  const response = await spigenAxios.post(
    `/customer/saveCustStockremark`,
    payload
    //    {
    //   search: payload,
    // }
  );
  return response;
};
export const refreshStock = async (payload: any) => {
  const response = await spigenAxios.get(
    "/report/fetchCloseStockAll"

    //    {
    //   search: payload,
    // }
  );
  return response;
};

// /purchaseOrder/fetchComponentList4PO
