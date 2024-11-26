import React, { useMemo } from "react";
import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { transformOptionData } from "@/helper/transform";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import {
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import styled from "styled-components";
import {  Form, Typography } from "antd";
import { RootState } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import {
  insertProduct
} from "@/components/shared/Api/masterApi";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import EditProduct from "../masterModule/Product/EditProduct";
import {
  getComponentsFromTransaction,
  getMarkupID,
  saveSettle,
} from "@/features/client/storeSlice";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
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

const BoxMarkup = () => {
  const [rowData, setRowData] = useState<RowData[]>([
    {
      orderQty: "",
      c_specification: "",
      part_code: "",
      part_name: "",
      moveQty: "",
      isNew: true,
    },
  ]);
  const [rowDataBoxes, setRowDataBoxes] = useState<RowData[]>([
    {
      isNew: true,
      box: "",
      items: "",
      markup: "",
    },
  ]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [markupID, setMarkupID] = useState([]);
  const [minNum, setMinNum] = useState([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState([]);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { uomlist } = useSelector((state: RootState) => state.client);

  const { loading } = useSelector((state: RootState) => state.store);
  const gridRef = useRef<AgGridReact<RowData>>(null);
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });
  const [form] = Form.useForm();
  const selMin = Form.useWatch("minTxn", form);

  const { execFun, loading: loading1 } = useApi();

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

    // if (response.status == 200) {
    //   let arr = data.data.map((r, index) => {
    //     return {
    //       label: r.units_name,
    //       value: r.units_id,
    //     };
    //   });
    //   setAsyncOptions(arr);
    // }
  };
  const handleSearch = (searchKey: string) => {
    if (searchKey) {
      dispatch(fetchComponentDetail({ search: searchKey }));
    }
    dispatch(fetchAvailableStockBoxes({ search: searchKey }));
  };
  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          {...props}
          setRowData={setRowData}
          setSearch={handleSearch}
          search={search}
          onSearch={handleSearch}
          form={form}
          // setSheetOpen={setSheetOpen}
        />
      ),
    }),
    []
  );
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

  useEffect(() => {
    if (selMin?.value) {
      dispatch(
        getComponentsFromTransaction({ transaction: selMin?.value })
      ).then((res) => {
        if (res.payload.code == 200) {
          let arr = res.payload.data.map((r, index) => {
            return {
              ...r,
              index: index + 1,
              moveQty: r.qty,
              isNew: true,
            };
          });
          setRowData(arr);
        }
      });
    }
  }, [selMin]);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "index",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Part Code",
      field: "part_code",
      filter: "agTextColumnFilter",
      width: 120,
    },
    {
      headerName: "Part Name",
      field: "part_name",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Part Description",
      field: "c_specification",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Qty",
      field: "moveQty",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Box Qty",
      cellRenderer: "textInputCellRenderer",
      field: "orderQty",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      cellRenderer: (e) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            {/* <Button className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600"> */}

            <Button
              // className="h-[20px] w-[20px] bg-white text-cyan-700 "
              onClick={() => setSheetOpen(e)}
            >
              Settle
            </Button>
            {/* </Button> */}
          </div>
        );
      },
    },
  ];
  const columnBoxesDefs: ColDef<rowData>[] = [
    {
      headerName: "BOX(es)",
      field: "box",
      editable: false,
      flex: 1,
      // cellRenderer: "textInputCellRenderer",
      width: 200,
    },

    {
      headerName: "Item(s) In Each/Box",
      field: "items",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      width: 200,
    },
    {
      headerName: "Markup ID",
      field: "markup",
      editable: false,
      flex: 1,
      width: 200,
    },
  ];
  useEffect(() => {
    if (sheetOpen) {
      let markup;
      dispatch(getMarkupID()).then((res) => {
        if (res.payload.code == 200) {
          setMarkupID(res.payload.data.markupCode);
        }
      });
      // let boxes
      const moveQty = sheetOpen?.data?.moveQty;
      // Total products
      const orderQty = sheetOpen?.data?.orderQty;

      // Step 1: Calculate the base number of products each box will get
      const baseQtyPerBox = Math.floor(moveQty / orderQty); // 120 / 23 = 5 (integer division)

      // Step 2: Calculate the remainder (extra products)
      const remainder = moveQty % orderQty; // 120 % 23 = 5

      // Step 3: Create an array of boxes
      const boxes = Array.from({ length: orderQty }, (_, index) => {
        // Give all boxes the baseQtyPerBox number of products
        // Make the last box get the remainder products
        if (index === orderQty - 1) {
          return {
            box: index + 1,
            items: baseQtyPerBox + remainder, // Add the remainder to the last box
          };
        } else {
          return {
            box: index + 1,
            items: baseQtyPerBox, // All other boxes get the base quantity
          };
        }
      });

      // Show the boxes and their product count
      let arr = boxes.map((r, index) => {
        return {
          id: index + 1,
          box: "BOX" + r.box,
          items: r.items,
          markup: "BOX" + Number(markupID + index + 1),
          isNew: true,
        };
      });
      // return;
      setRowDataBoxes(arr);
    }
  }, [sheetOpen]);
  const submitMarkedBoxes = async () => {
    let payload = {
      min_no: sheetOpen?.data?.min_no,
      min_qty: sheetOpen?.data?.qty,
      part_id: sheetOpen?.data?.part_id,
      box_no: rowDataBoxes.map((rowData) => rowData.markup),
      item_qty: rowDataBoxes.map((rowData) => rowData.items),
    };
    dispatch(saveSettle(payload)).then((res) => {
      if (res.payload.code == 200) {
        toast({
          title: res.payload.message,
          className: "bg-green-600 text-white items-center",
        });
        setSheetOpen(false);
      } else {
        toast({
          title: res.payload.message.msg,

          className: "bg-red-600 text-white items-center",
        });
      }
      setShowConfirmation(false);
    });
  };

  return (
    <Wrapper className="h-[calc(100vh-50px)] grid grid-cols-[250px_1fr] overflow-hidden">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        {loading && <FullPageLoading />}
        <Form form={form} layout="vertical">
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px] h-[1000px]"
          >
            <div className="grid grid-cols-1 gap-[40px] ">
              <Form.Item name="minTxn" label="MIN Txn ID">
                {/* <Select
                  styles={customStyles}
                  components={{ DropdownIndicator }}
                  placeholder="MIN Txn ID"
                  className="border-0 basic-single"
                  classNamePrefix="select border-0"
                  isDisabled={false}
                  isClearable={true}
                  isSearchable={true}
                /> */}
                <ReusableAsyncSelect
                  placeholder="Part Name"
                  endpoint="/backend/getMinsTransaction4Markup"
                  transform={transformOptionData}
                  // onChange={(e) => handleChange(e.value)}
                  // value={selectedCustomer}
                  fetchOptionWith="payloadSearchTerm"
                />
              </Form.Item>
            </div>

            {/* <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              onClick={(e: any) => {
                e.preventDefault();
                onsubmit();
              }}
            >
              Submit
            </Button> */}
          </form>
        </Form>{" "}
        {sheetOpenEdit?.length > 0 && (
          <EditProduct
            sheetOpenEdit={sheetOpenEdit}
            setSheetOpenEdit={setSheetOpenEdit}
          />
        )}
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-150px)] w-full ml-[10px]">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs as (ColDef | ColGroupDef)[]}
          defaultColDef={defaultColDef}
          statusBar={statusBar}
          components={components}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
          gridOptions={commonAgGridConfig}
          suppressRowClickSelection={false}
          rowSelection="multiple"
          checkboxSelection={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
        />
      </div>{" "}
      <Sheet
        open={sheetOpen && selMin && sheetOpen.data}
        onOpenChange={setSheetOpen}
      >
        <SheetContent
          className="min-w-[70%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">
              {sheetOpen?.data?.part_code}
            </SheetTitle>
          </SheetHeader>{" "}
          <div className="ag-theme-quartz h-[calc(100vh-100px)] w-full">
            {" "}
            {loading && <FullPageLoading />}
            <AgGridReact
              ref={gridRef}
              rowData={rowDataBoxes}
              columnDefs={columnBoxesDefs as (ColDef | ColGroupDef)[]}
              defaultColDef={defaultColDef}
              statusBar={statusBar}
              components={components}
              pagination={true}
              paginationPageSize={10}
              animateRows={true}
              suppressCellFocus={true}
              gridOptions={commonAgGridConfig}

              // onSelectionChanged={onSelectionChanged}
            />
          </div>{" "}
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Typography.Text>
              {/* Total:{selectedRows.reduce((a, b) => a + Number(b?.qty), 0)} */}
            </Typography.Text>
            <Button
              className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={() => setShowConfirmation(true)}
            >
              Markup
            </Button>
          </div>
          <div></div>
        </SheetContent>
      </Sheet>{" "}
      <ConfirmationModal
        open={showConfirmation}
        onOkay={submitMarkedBoxes}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Submit!"
        description="Are you sure you want to initiate the Outward ?
"
      />
    </Wrapper>
  );
};

export default BoxMarkup;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
