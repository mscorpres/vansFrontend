import { Props } from "@/types/salesmodule/salesShipmentTypes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaFileExcel } from "react-icons/fa";
import { Plus, Trash2, Upload } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  cardHeaderBg,
  InputStyle,
  LableStyle,
  modelFixFooterStyle,
  modelFixHeaderStyle,
  primartButtonStyle,
} from "@/constants/themeContants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import columnDefs, {
  dummyRowData,
} from "@/config/agGrid/salesmodule/shipmentUpdateTable";
import { AgGridReact } from "ag-grid-react";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import SalesShipmentUpadetTextCellrender from "@/config/agGrid/cellRenders.tsx/SalesShipmentUpadetTextCellrender";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataPOforMIN,
  fetchManagePOVeiwComponentList,
} from "@/features/client/clientSlice";
import { fetchViewComponentsOfManage } from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
const MINPO: React.FC<Props> = ({ viewMinPo, setViewMinPo }) => {
  console.log("view", viewMinPo);
  const [rowData, setRowData] = useState([]);
  const [search, setSearch] = useState("");
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [taxDetails, setTaxDetails] = useState([]);
  const [vendorDetails, setVendorDetails] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const { managePoViewComponentList, poMinList } = useSelector(
    (state: RootState) => state.client
  );
  const { execFun, loading: loading1 } = useApi();
  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          {...props}
          setRowData={setRowData}
          rowData={rowData}
          //   setSearch={handleSearch}
          search={search}
          //   onSearch={handleSearch}
          //   vendorCode={selectedVendor}
          // componentDetails={hsnlist}
        />
      ),
      //   datePickerCellRenderer: DatePickerCellRenderer,
      //   statusCellRenderer: StatusCellRenderer,
    }),
    []
  );
  const columnDefs = [
    {
      headerName: "",
      valueGetter: "node.rowIndex + 1",
      cellRenderer: "textInputCellRenderer",
      maxWidth: 50,
      field: "delete",
    },
    { headerName: "Index", valueGetter: "node.rowIndex + 1", maxWidth: 80 },

    {
      headerName: "Component/Part",
      field: "component_fullname",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Order Qty",
      field: "orderQty",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Rate",
      field: "rate",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    // {
    //   headerName: "Currency",
    //   field: "currency",
    //   editable: false,
    //   flex: 1,
    //   cellRenderer: "textInputCellRenderer",
    //   minWidth: 250,
    // },
    {
      headerName: "GST Rate",
      field: "gstRate",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "GST Type",
      field: "gstType",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Value",
      field: "value",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Local Value",
      field: "localValue",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    // {
    //   headerName: "Foreign Value",
    //   field: "foreignValue",
    //   editable: false,
    //   flex: 1,
    //   cellRenderer: "textInputCellRenderer",
    //   minWidth: 200,
    // },
    {
      headerName: "CGST",
      field: "cgst",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "SGST",
      field: "sgst",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "IGST",
      field: "igst",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Due Date",
      field: "dueDate",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "HSN Code",
      field: "hsnCode",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "ITEM DESCRIPTION",
      field: "materialDescription",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
  ];
  useEffect(() => {
    let singleArr = rowData;
    const values = singleArr?.reduce(
      (partialSum, a) => partialSum + +Number(a?.localValue).toFixed(2),
      0
    );
    const value = +Number(values).toFixed(2);
    // const freights = mainArrs?.reduce(
    //   (partialSum, a) => partialSum + +Number(a?.freightAmount),
    //   0
    // );
    // const freight = +Number(freights).toFixed(2);
    const cgsts = singleArr?.reduce(
      (partialSum, a) => partialSum + +Number(a?.cgst).toFixed(2),
      0
    );
    const cgst = +Number(cgsts).toFixed(2);
    const sgsts = singleArr?.reduce(
      (partialSum, a) => partialSum + +Number(a?.sgst).toFixed(2),
      0
    );
    const sgst = +Number(sgsts).toFixed(2);
    // console.log("sgst", sgst);
    const igsts = singleArr?.reduce(
      (partialSum, a) => partialSum + +Number(a?.igst).toFixed(2),
      0
    );

    const igst = +Number(igsts).toFixed(2);
    // console.log("mainArrVenAm", mainArrVenAm);
    // setmainArrs(mainArrs);
    // console.log("mainArrs", mainArrs);
    // let vendorAmounts;
    // vendorAmounts = mainArrs?.reduce(
    //   (partialSum, a) => partialSum + (a?.venAmmount || 0),
    //   0
    // );
    // // console.log("vendorAmount", vendorAmounts);
    // var vendorAmount = vendorAmounts;
    // setMAVenAmValue(vendorAmount);

    // const tds = singleArr?.reduce(
    //   (a, b) => a + +Number(b?.tdsAmount ?? 0).toFixed(2),
    //   0
    // );

    // if (roundOffSign === "+") {
    //   vendorAmounts = vendorAmount + +Number(roundOffValue).toFixed(2);
    //   vendorAmount = +Number(vendorAmounts).toFixed(2);
    // }
    // if (roundOffSign === "-") {
    //   vendorAmounts -= +Number(roundOffValue).toFixed(2);
    //   vendorAmount = +Number(vendorAmounts).toFixed(2);
    // }

    // console.log("my single arr", singleArr);
    // setmainArrs(singleArr);

    const arr = [
      {
        title: "Value",
        description: value,
      },
      // {
      //   title: "Freight",
      //   description: freight,
      // },
      {
        title: "CGST",
        description: cgst,
      },
      {
        title: "SGST",
        description: sgst,
      },
      {
        title: "IGST",
        description: igst,
      },
      // { title: "TDS", description: tds },
      // {
      //   title: "Round Off",
      //   description:
      //     roundOffSign.toString() + [Number(roundOffValue).toFixed(2)],
      // },
      // {
      //   title: "Vendor Amount",
      //   description: vendorAmount,
      // },
    ];
    setTaxDetails(arr);
  }, [rowData]);
  const calltheApi = async () => {
    dispatch(fetchDataPOforMIN({ poid: viewMinPo.po_transaction })).then(
      (response: any) => {

        if (response.payload.status == "success") {
          let data = response?.payload?.data;
          let arr = data?.materials?.map((r, id) => {
            return {
              id: id + 1,
              isNew: true,
              component_fullname: r.c_partno + " -" + r.component_fullname,
              orderQty: r.orderqty,
              rate: r.orderrate,
              gstRate: r.gstrate,
              gstType: r.gsttype,
              localValue: r.usdValue,
              value: r.totalValue,
              materialDescription: r.description,
              hsnCode: r.hsncode,
              dueDate: r.orderduedate,
              ...r,
            };
          });
          setRowData(arr);
          let arr2 = data?.vendor_type;
          let obj = {
            name: arr2?.vendorname,
            vendorcode: arr2?.vendorcode,
            vendortype: arr2?.vendortype,
            gstin: arr2?.gstin,
            vendoraddress: arr2?.vendoraddress,
          };
          setVendorDetails(obj);
        }
      }
    );
    // if (managePoViewComponentList) {
    //   setRowData(managePoViewComponentList);
    // }
    // let response = await execFun(
    //   () => fetchViewComponentsOfManage(viewMinPo.po_transaction),
    //   "fetch"
    // );
    // console.log("response", response);
    // let { data } = response;
    // if (data.code == 200) {
    //   let arr = data?.data.data.map((r, id) => {
    //     return { id: id + 1, ...r };
    //   });
    //   setRowData(arr);
    // }
  };
  useEffect(() => {
    if (viewMinPo) {
      calltheApi();
    }
  }, [viewMinPo?.po_transaction]);
  //   useEffect(() => {
  //     if (managePoViewComponentList) {
  //       setRowData(managePoViewComponentList);
  //     }
  //   }, [managePoViewComponentList]);
  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      floatingFilter: false,
      editable: false,
    };
  }, []);

  const statusBar = useMemo<{
    statusPanels: StatusPanelDef[];
  }>(() => {
    return {
      statusPanels: [
        { statusPanel: "agFilteredRowCountComponent", align: "right" },
        { statusPanel: "agSelectedRowCountComponent", align: "right" },
        { statusPanel: "agAggregationComponent", align: "right" },
      ],
    };
  }, []);
  return (
    <Sheet open={viewMinPo.po_transaction} onOpenChange={setViewMinPo}>
      <SheetContent className="min-w-[100%] p-0 ">
        <SheetHeader className={modelFixHeaderStyle}>
          <SheetTitle className="text-slate-600">
            MIN {viewMinPo.po_transaction}
          </SheetTitle>
        </SheetHeader>{" "}
        <div className="h-[calc(100vh-50px)] grid grid-cols-[400px_1fr]">
          <div className="max-h-[calc(100vh-50px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-[10px] p-[10px]">
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-[10px] bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Vendor Detail
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-[20px] flex flex-col gap-[10px] text-slate-600">
                {/* //detais of client */}
                <h3 className="font-[500]">Name</h3>
                <p className="text-[14px]">
                  {vendorDetails?.name + "(" + vendorDetails?.vendorcode + ")"}
                </p>
                <h3 className="font-[500]">Address</h3>
                <p className="text-[14px]">{vendorDetails?.vendoraddress}</p>
                <h3 className="font-[500]">GSTIN</h3>
                <p className="text-[14px]">{vendorDetails?.gstin}</p>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-[10px] bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Tax Detail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  <ul>
                    <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                      <div>
                        <h3 className="font-[500]">
                          Sub-Total value before Taxes :
                        </h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          {taxDetails[0]?.description}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                      <div>
                        <h3 className="font-[500]">CGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          {" "}
                          {taxDetails[1]?.description}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                      <div>
                        <h3 className="font-[500]">SGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          {taxDetails[2]?.description}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                      <div>
                        <h3 className="font-[500]">ISGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          {taxDetails[3]?.description}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                      <div>
                        <h3 className="font-[600] text-cyan-600">
                          Sub-Total values after Taxes :
                        </h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          {taxDetails.reduce((a, b) => a + b.description, 0)}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="max-h-[calc(100vh-50px)] overflow-y-auto bg-white">
            <div className="flex flex-row items-center justify-between p-[10px]">
              <div className="flex items-center gap-[20px]">
                <Button
                  onClick={() => setExcelModel(true)}
                  className="bg-[#217346] text-white hover:bg-[#2fa062] hover:text-white flex items-center gap-[10px] text-[15px] shadow shadow-slate-600 rounded-md"
                >
                  <Upload className="text-white w-[20px] h-[20px]" /> Upload
                  Excel Here
                </Button>
              </div>
            </div>
            <div className="ag-theme-quartz h-[calc(100vh-120px)] w-full">
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                statusBar={statusBar}
                components={components}
                pagination={true}
                paginationPageSize={10}
                animateRows={true}
                gridOptions={commonAgGridConfig}
                suppressCellFocus={false}
                suppressRowClickSelection={false}
              />
            </div>
          </div>
        </div>
        {/* <div className="ag-theme-quartz h-[calc(100vh-100px)]">
          <AgGridReact
            //   loadingCellRenderer={loadingCellRenderer}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{ filter: true, sortable: true }}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
          />
        </div> */}
      </SheetContent>
    </Sheet>
  );
};

export default MINPO;
