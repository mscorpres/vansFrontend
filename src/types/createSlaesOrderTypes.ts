// clientSlice.types.ts

export interface City {
    id: string;
    name: string;
  }
  
  export interface State {
    code: string;
    name: string;
  }
  
  export interface Country {
    code: string;
    name: string;
  }
  
  export interface Client {
    clientCode: string;
    addressID: string;
    address: string;
    city: City;
    pinCode: string;
    phoneNo: string;
    email: string;
    gst: string;
    status: string;
    state: State;
    country: Country;
  }
  
  export interface ClientResponse {
    code: number;
    status: string;
    data: Client[];
  }
  
  export interface BillingAddress {
    statecode: string;
    company: string;
    address: string;
    gstin: string;
    cin: string;
    pan: string;
  }
  
  export interface BillingAddressResponse {
    code: number;
    message: string;
    data: BillingAddress;
  }
  


  export interface ProjectDescription {
    description: string;
  }
  
  export interface ProjectDescriptionResponse {
    code: number;
    data: ProjectDescription;
    status: string;
  }


  export interface Country2 {
    code: number;
    name: string;
  }
  
  export interface CountryResponse {
    data: Country2[];
  }


  // clientSlice.types.ts

export interface State2 {
    code: number;
    name: string;
  }
  
  export interface StateResponse {
    data: State2[];
  }
  export interface BillingAddressListItem {
    id: string;
    text: string;
  }
  
  export type BillingAddressListResponse = BillingAddressListItem[];


  // clientSlice.types.ts

export interface ClientAddressDetail {
    clientCode: string;
    name: string;
    panNo: string;
    phoneNo: string;
    state: {
      code: string;
      name: string;
    };
    country: {
      code: string;
      name: string;
    };
    city: string;
    address: string;
    gst: string;
    pinCode: string;
    tcs: string[];
    tcsOption: string[];
    tds: string[];
    tdsOption: string[];
  }
  
  export type ClientAddressDetailResponse = ClientAddressDetail[];
  
  export interface ComponentDetail {
    id: string;
    text: string;
    part_code: string;
    uID: string;
    newPart: string;
    piaStatus: string;
  }
  
  export interface ComponentDetailResponse {
    success: boolean;
    message: string | null;
    data: ComponentDetail[];
  }
  export interface ClientState {
    clientDetails: Client | null;
    billingAddress: BillingAddress | null;
    projectDescription:ProjectDescription | null ;
    billingAddressList: BillingAddressListItem[] | null;
    clientAddressDetail: ClientAddressDetail | null;
    componentDetails:ComponentDetail[]| null,
    loading: boolean;
    error: string | null;
    countries: Country2[] | null;
    states:State2[] | null
  }
  