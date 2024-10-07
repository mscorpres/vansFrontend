import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import selectReducer from "../features/reactSelect/RectSelectSlice";
import gridReducer from "../features/agGrid/aggridSlice";
import createSalesOrderReducer from "../features/salesmodule/createSalesOrderSlice";
import productSlice from "@/features/product/productSlice";
import billingAdressSlice from "@/features/billingAddress/billingAdressSlice";
import shippingAdressSlice from "@/features/shippingAddress/shippingAdressSlice";
import clientSlice from "@/features/client/clientSlice";
import branchSlice from "@/features/client/branchSlice";
import SalesSlice from "@/features/salesmodule/SalesSlice";
import salesTransactionSlice from "@/features/salesmodule/salesTransactionSlice";
import salesShipmentSlice from "@/features/salesmodule/salesShipmentSlice";
import salesInvoiceSlice from "@/features/salesmodule/salesInvoiceSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    select: selectReducer,
    aggrid:gridReducer,
    createSalesOrder:createSalesOrderReducer,
    prod:productSlice,
    billing:billingAdressSlice,
    shipping:shippingAdressSlice,
    client:clientSlice,
    branch:branchSlice,
    sellRequest:SalesSlice,
    sellShipment:salesShipmentSlice,
    sellInvoice:salesInvoiceSlice,
    invoice:salesTransactionSlice,
    
    
    
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
