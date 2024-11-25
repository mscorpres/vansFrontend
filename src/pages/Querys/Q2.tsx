import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";

import { MoreOutlined } from "@ant-design/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Filter } from "lucide-react";
import styled from "styled-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker, Divider, Dropdown, Menu } from "antd";
import { transformOptionData } from "@/helper/transform";
import { toast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import { modelFixHeaderStyle } from "@/constants/themeContants";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import {
  fetchCustomerComponentsByPart,
  fetchListOfQ1,
  fetchListOfQ2,
  getComponentsByNameAndNo,
  itemQueryL,
} from "@/components/shared/Api/masterApi";
import { IoMdDownload } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
const FormSchema = z.object({
  date: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  part: z.string().optional(),
});

const Q2 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [boxData, setBoxData] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [openView, setSheetOpenView] = useState([]);
  const [openViewBox, setSheetOpenViewBox] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  //   const { addToast } = useToastContainer()
  const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
    const menu = (
      <Menu>
        <Menu.Item
          key="downlaod"
          disabled={rowData.length === 0}
          onClick={(e: any) => {
            // e.preventDefault();
            handleDownloadExcel();
          }}
        >
          Download
        </Menu.Item>
        <Menu.Item
          disabled={rowData.length === 0}
          key="View Component"
          onClick={() => {
            setSheetOpenView(true);
          }}
        >
          View Component
        </Menu.Item>
        <Menu.Item
          disabled={rowData.length === 0}
          key=" Box Data"
          onClick={() => {
            setSheetOpenViewBox(true);
          }}
        >
          Box Data
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        <Dropdown overlay={menu} trigger={["click"]}>
          {/* <Button icon={<Badge />} /> */}
          <MoreOutlined />
        </Dropdown>
      </>
    );
  };
  const fetchComponentList = async (e: any) => {
    setSelectedCustomer(e);

    const response = await execFun(() => getComponentsByNameAndNo(e), "fetch");
  };
  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    let payload = {
      data: selectedCustomer?.value,
      wise: "C",
      range: formData.date,
    };
    const response = await execFun(() => fetchListOfQ2(payload), "fetch");
    let { data } = response;
    if (data.code == 200) {
      let arr = data.response.data2;
      let a = arr.map((r: any, index: any) => {
        return {
          id: index + 1,
          ...r,
        };
      });

      setRowData(a);
      setStockInfo(data.response.data1);
    } else {
      //   addToast(data.message.msg, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
    }
  };
  const openDrawer = async () => {
    let payload = {
      component: selectedCustomer?.value,
    };
    const response = await execFun(
      () => fetchCustomerComponentsByPart(payload),
      "fetch"
    );
    if (response.data.code == 200) {
      let { data } = response;
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });

      setViewData(arr);
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-700 text-center text-white",
        autoDismiss: true,
      });
    }
  };
  const openDrawerBox = async () => {
    let payload = {
      component: selectedCustomer?.value,
    };
    const response = await execFun(() => itemQueryL(payload), "fetch");
    if (response.data.code == 200) {
      let { data } = response;
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setBoxData(arr);
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-700 text-center text-white",
        autoDismiss: true,
      });
    }
  };
  useEffect(() => {
    if (openView == true) {
      openDrawer();
    }
  }, [openView]);
  useEffect(() => {
    if (openViewBox == true) {
      openDrawerBox();
    }
  }, [openViewBox]);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Date",
      field: "date",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Transaction Type",
      field: "transaction_type",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Qty In",
      field: "qty_in",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Qty Out",
      field: "qty_out",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Method",
      field: "transaction_type",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Cost Center",
      field: "cost_center",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "cost_center",
      field: "cost_center",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Vendor Name",
      field: "vendorname",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Doc Type",
      field: "doneby",
      filter: "agTextColumnFilter",
      width: 190,
    },
  ];
  const componentCol: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Customer",
      field: "name",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Component Name",
      field: "cust_name",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Part Number",
      field: "part_no",
      filter: "agTextColumnFilter",
      width: 190,
    },
  ];
  const boxCol: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Cost Center",
      field: "cost_center_name",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Box Number",
      field: "LOCATION",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Part Number",
      field: "PART",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: " Part Name",
      field: "NAME",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Description",
      field: "SPECIFICATION",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Unit",
      field: "UNIT",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Rate",
      field: "in_rate",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Amount (FXC)",
      field: "AMOUNT_FC",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Amount (LC)",
      field: "AMOUNT_LC",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Min No.",
      field: "MIN_NO",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Closing Qty",
      field: "CLOSING_QUANTITY",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Physical Stock",
      field: "PHYSICAL_STOCK",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "Remark",
      field: "REMARK",
      filter: "agTextColumnFilter",
      width: 190,
    },
  ];
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "Q2 Register");
  };
  const handleDownloadExcelBox = () => {
    downloadCSV(boxData, boxCol, "Box Data");
  };
  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(fetchQueryResults)}
            className="space-y-6 overflow-hidden p-[10px] h-[500px]"
          >
            <FormField
              control={form.control}
              name="part"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <ReusableAsyncSelect
                      placeholder="Part Name"
                      endpoint="/backend/getComponentByNameAndNo"
                      transform={transformOptionData}
                      onChange={fetchComponentList}
                      value={selectedCustomer}
                      fetchOptionWith="payload"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* )} */}{" "}
            <div className="flex gap-[10px] justify-end  px-[5px]">
              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                //   onClick={() => {
                //     fetchBOMList();
                //   }}
              >
                Search
              </Button>

              <ActionMenu />
            </div>
            <Divider />
            {/* <div className="h-[calc(100vh-10px)] grid grid-cols-[350px_1fr] flex "> */}
            {/* <div className="bg-[#fff] "> */}
            {/* <div className="p-[10px]"> */}
            {rowData.length > 0 && (
              <div className="max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-[10px] p-[10px]">
                <Card className="rounded-sm shadow-sm shadow-slate-500">
                  <CardHeader className="flex flex-row items-center justify-between p-[10px] bg-[#e0f2f1]">
                    <CardTitle className="font-[550] text-slate-600">
                      Other Detail
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-[20px] flex flex-col gap-[10px] text-slate-600">
                    {/* //detais of client */}
                    <h3 className="font-[500]">CL Qty</h3>
                    <p className="text-[14px]">{stockInfo?.closingqty}</p>
                    <h3 className="font-[500]">Last In (Date / Type): </h3>
                    <p className="text-[14px]">{stockInfo?.lasttIN}</p>
                    <h3 className="font-[500]">Last Rate: </h3>
                    <p className="text-[14px]">{stockInfo?.lastRate}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </form>
        </Form>{" "}
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
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
      <Sheet open={openView == true} onOpenChange={setSheetOpenView}>
        <SheetTrigger></SheetTrigger>
        <SheetContent
          className="min-w-[50%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">View Component</SheetTitle>
          </SheetHeader>{" "}
          <div className="ag-theme-quartz h-[calc(100vh-100px)]">
            {" "}
            {loading1("fetch") && <FullPageLoading />}
            <AgGridReact
              //   loadingCellRenderer={loadingCellRenderer}
              rowData={viewData}
              columnDefs={componentCol}
              defaultColDef={{ filter: true, sortable: true }}
              pagination={true}
              paginationPageSize={10}
              paginationAutoPageSize={true}
              suppressCellFocus={true}
            />
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={openViewBox == true} onOpenChange={setSheetOpenViewBox}>
        <SheetTrigger></SheetTrigger>
        <SheetContent
          className="min-w-[100%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Box Data</SheetTitle>
          </SheetHeader>{" "}
          <div className="flex gap-[10px] justify-end  px-[5px] h-[50px]">
            {" "}
            <Button
              // type="submit"
              className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey mt-[8px]"
              // onClick={() => {}}
              disabled={rowData.length === 0}
              onClick={(e: any) => {
                e.preventDefault();
                handleDownloadExcelBox();
              }}
            >
              <IoMdDownload size={20} />
            </Button>
          </div>
          <div className="ag-theme-quartz h-[calc(100vh-100px)]">
            {" "}
            {loading1("fetch") && <FullPageLoading />}
            <AgGridReact
              //   loadingCellRenderer={loadingCellRenderer}
              rowData={boxData}
              columnDefs={boxCol}
              defaultColDef={{ filter: true, sortable: true }}
              pagination={true}
              paginationPageSize={10}
              paginationAutoPageSize={true}
              suppressCellFocus={true}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Wrapper>
  );
};

export default Q2;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
