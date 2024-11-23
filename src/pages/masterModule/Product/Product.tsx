import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { transformOptionData } from "@/helper/transform";
import { InputStyle } from "@/constants/themeContants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import { Form, Row } from "antd";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { AppDispatch, RootState } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import {
  getProductList,
  insertProduct,
  listOfUom,
} from "@/components/shared/Api/masterApi";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import EditProduct from "./EditProduct";
import { listOfUoms } from "@/features/client/clientSlice";
import { RowData } from "@/data";
import { ColDef } from "ag-grid-community";
import FullPageLoading from "@/components/shared/FullPageLoading";
const FormSchema = z.object({
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  soWise: z.string().optional(),
});

const Product = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [resetModel, setResetModel] = useState(false);

  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const fetchProductList = async () => {
    const response = await execFun(() => getProductList(), "fetch");
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data.map((r: any, index: any) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
    } else {
    }
  };
  const listUom = async () => {
    const response = await execFun(() => listOfUom(), "fetch");
    const { data } = response;

    if (response.status == 200) {
      let arr = data.data.map((r: any) => {
        return {
          label: r.units_name,
          value: r.units_id,
        };
      });
      setAsyncOptions(arr);
    }
  };
  const onsubmit = async () => {
    const value = await form.validateFields();
    let payload = {
      p_sku: value.sku,
      p_name: value.product,
      units_id: value.uom.value,
      customer: value.customerName.value,
    };
    // return;
    const response = await execFun(() => insertProduct(payload), "fetch");

    const { data } = response;
    if (response.data.code == 200) {
      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });
      form.resetFields();
    } else {
      toast({
        title: data.message.msg || "Failed to Product",
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  useEffect(() => {
    fetchProductList();
    listUom();
    dispatch(listOfUoms());
  }, []);

  const columnDefs: ColDef<RowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Product Name",
      field: "p_name",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "SKU",
      field: "p_sku",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "UOM",
      field: "units_name",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Customer Code",
      field: "p_customer",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Customer Name",
      field: "cname",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      cellRenderer: (e: any) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            {/* <Button className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600"> */}
            <Edit2
              className="h-[20px] w-[20px] text-cyan-700 "
              onClick={() => setSheetOpenEdit(e?.data?.product_key)}
            />
            {/* </Button> */}
          </div>
        );
      },
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-50px)] grid grid-cols-[350px_1fr] overflow-hidden">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <Form form={form} layout="vertical">
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px] h-[1000px]"
          >
            <div className="grid grid-cols-2 gap-[40px] ">
              <Form.Item
                name="sku"
                label="SKU"
                rules={[
                  {
                    required: true,
                    message: "Please enter SKU!",
                  },
                ]}
              >
                <Input
                  className={InputStyle}
                  placeholder="Enter SKU"
                  // {...field}
                />
              </Form.Item>

              <Form.Item
                name="uom"
                label="UOM"
                rules={[
                  {
                    required: true,
                    message: "Please enter UOM!",
                  },
                ]}
              >
                <Select
                  styles={customStyles}
                  components={{ DropdownIndicator }}
                  placeholder=" Enter UOM"
                  className="border-0 basic-single"
                  classNamePrefix="select border-0"
                  isDisabled={false}
                  isClearable={true}
                  isSearchable={true}
                  options={asyncOptions}
                  //   onChange={(e) => console.log(e)}
                  //   value={
                  //     data.clientDetails
                  //       ? {
                  //           label: data.clientDetails.city.name,
                  //           value: data.clientDetails.city.name,
                  //         }
                  //       : null
                  //   }
                />
              </Form.Item>
            </div>
            <Form.Item
              name="product"
              label="Product"
              rules={[
                {
                  required: true,
                  message: "Please enter Product!",
                },
              ]}
            >
              <Input
                className={InputStyle}
                placeholder="Enter Product"
                // {...field}
              />
            </Form.Item>
            <div className="">
              <Form.Item
                name="customerName"
                label="  Customer Name/Code"
                rules={[
                  {
                    required: true,
                    message: "Please enter Customer Name/Code!",
                  },
                ]}
              >
                <ReusableAsyncSelect
                  placeholder="Customer Name"
                  endpoint="/others/customerList"
                  transform={transformOptionData}
                  onChange={(e) => form.setValue("customerName", e)}
                  // value={selectedCustomer}
                  fetchOptionWith="payload"
                />
              </Form.Item>
            </div>{" "}
            <Row justify="space-between">
              {" "}
              <Button
                type="reset"
                className="shadow bg-red-700 hover:bg-red-600 shadow-slate-500"
                onClick={() => setResetModel(true)}
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                onClick={(e: any) => {
                  e.preventDefault();
                  onsubmit();
                }}
              >
                Submit
              </Button>
            </Row>
          </form>
        </Form>{" "}
        {sheetOpenEdit?.length > 0 && (
          <EditProduct
            sheetOpenEdit={sheetOpenEdit}
            setSheetOpenEdit={setSheetOpenEdit}
          />
        )}
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-50px)]">
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          //   loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          suppressCellFocus={true}
        />
      </div>
      <AlertDialog open={resetModel} onOpenChange={setResetModel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-600">
              Are you absolutely sure you want to reset the form?
            </AlertDialogTitle>
            {/* <AlertDialogDescription>Are you sure want to logout.</AlertDialogDescription> */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-700 shadow hover:bg-red-600 shadow-slate-500"
              onClick={() => form.resetFields()}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Wrapper>
  );
};

export default Product;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
