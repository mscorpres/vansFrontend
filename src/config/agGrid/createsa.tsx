import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { StatusPanelDef, ColDef, ColGroupDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useEffect, useMemo, useRef, useState } from "react";
import TextInputCellRenderer from "@/config/agGrid/TextInputCellRenderer";
import DatePickerCellRenderer from "@/config/agGrid/DatePickerCellRenderer";
import StatusCellRenderer from "@/config/agGrid/StatusCellRenderer";
import styled from "styled-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddPoUIStateType } from "@/types/AddPOTypes";
import columnDefs, {
  RowData,
} from "@/config/agGrid/SalseOrderCreateTableColumns";
import AddPOPopovers from "@/components/shared/AddPOPopovers";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

import { fetchComponentDetail } from "@/features/salesmodule/createSalesOrderSlice";
import {
  createSellRequest,
  updateSellRequest,
} from "@/features/salesmodule/SalesSlice";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import FullPageLoading from "@/components/shared/FullPageLoading";

const AddSalesOrder = ({
  setTab,
  form,
  rowData,
  setRowData,
  derivedType,
}: {
  setTab: React.Dispatch<React.SetStateAction<string>>;
  payloadData: any;
  form: any;
  rowData: any;
  setRowData: any;
  derivedType: string;
}) => {
  const [excelModel, setExcelModel] = useState<boolean>(false);
  const [backModel, setBackModel] = useState<boolean>(false);
  const [resetModel, setResetModel] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);
  const [igstTotal, setIgstTotal] = useState(0);
  const [search] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { componentDetails, currency } = useSelector(
    (state: RootState) => state.createSalesOrder
  );

  const { loading } = useSelector((state: RootState) => state.sellRequest);

  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const uiState: AddPoUIStateType = {
    excelModel,
    setExcelModel,
    setRowData,
    backModel,
    setBackModel,
    resetModel,
    setResetModel,
  };

  useEffect(() => {
    rowData?.length === 0 && addNewRow();
  }, []);

  const addNewRow = () => {
    const newRow: RowData = {
      type: "product",
      material: "",
      materialDescription: "",
      // asinNumber: "B01N1SE4EP",
      orderQty: 1,
      // rate: 0,
      currency: "364907247",
      // gstRate: 18,
      gstType: derivedType,
      localValue: 0.0,
      foreignValue: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      dueDate: "",
      isNew: true,
    };
    setRowData((prevData: any) => [...prevData, newRow]);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (rowData && rowData?.length > 0) {
        const cgstSum = rowData?.reduce(
          (sum: number, item: any) => sum + (parseFloat(item.cgst) || 0),
          0
        );
        const sgstSum = rowData?.reduce(
          (sum: number, item: any) => sum + (parseFloat(item.sgst) || 0),
          0
        );
        const igstSum = rowData?.reduce(
          (sum: number, item: any) => sum + (parseFloat(item.igst) || 0),
          0
        );

        setCgstTotal(cgstSum);
        setSgstTotal(sgstSum);
        setIgstTotal(igstSum);
      }
    }, 5000);

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [rowData]);

  const handleSearch = (searchKey: string, type: any) => {
    if (searchKey) {
      // Ensure there's a search key before dispatching
      dispatch(fetchComponentDetail({ search: searchKey, type }));
    }
  };

  const handleSubmit = () => {
    setShowConfirmation(true); // Open the confirmation modal
  };

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

  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          {...props}
          componentDetails={componentDetails}
          setSearch={handleSearch}
          search={search}
          onSearch={handleSearch}
          currency={currency}
          setRowData={setRowData}
        />
      ),
      datePickerCellRenderer: DatePickerCellRenderer,
      statusCellRenderer: StatusCellRenderer,
    }),
    []
  );

  // const onBtExport = useCallback(() => {
  //   const link = document.createElement('a');
  //   link.href = 'https://spigen.mscapi.live/files/excel/Sales%20Order%20Sample.xlsx';
  //   link.setAttribute('download', 'Sales_Order_Sample.xlsx'); // Specify the download name
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }, []);

  const materials = {
    so_type: rowData?.map((component: RowData) => component.type || ""),
    items: rowData?.map((component: RowData) =>
      typeof component.material === "object" && component.material !== null
        ? (component.material as any).id ||
          (component.material as any).value ||
          ""
        : component.material || ""
    ),
    qty: rowData?.map((component: RowData) =>
      component?.orderQty === undefined
        ? null
        : +Number(+Number(component.orderQty)?.toFixed(2))
    ),
    hsn: rowData?.map((component: RowData) => component.hsnCode || ""),
    price: rowData?.map((component: RowData) => Number(component.rate) || 0),
    gst_rate: rowData?.map(
      (component: RowData) => Number(component.gstRate) || 0
    ),
    gst_type: rowData?.map((component: RowData) => component.gstType || ""),
    currency: rowData?.map((component: RowData) => component.currency || ""),
    exchange_rate: rowData?.map(
      (component: RowData) => Number(component.exchangeRate) || 1
    ),
    due_date: rowData?.map((component: RowData) => component.dueDate || ""),
    remark: rowData?.map((component: RowData) => component.remark || ""),
    cgst: rowData?.map((component: RowData) => component.cgst || 0),
    sgst: rowData?.map((component: RowData) => component.sgst || 0),
    igst: rowData?.map((component: RowData) => component.igst || 0),
    updaterow: rowData?.map((component: RowData) => component.updateid || 0),
  };
  const soId = (params.id as string)?.replace(/_/g, "/");

  const confirmSubmit = (confirmed: boolean) => {
    if (confirmed) {
      // Proceed with the submission
      const payloadData2 = {
        headers: { ...form.getValues(), so_id: soId },
        materials,
      };
      if (window.location.pathname.includes("update")) {
        dispatch(updateSellRequest(payloadData2)).then((response: any) => {
          if (response.payload.success) {
            form.reset(); // Reset the form
            setRowData([]);
            navigate("/sales/order/register");
          }
        });
      } else {
        dispatch(createSellRequest(payloadData2)).then((response: any) => {
          if (response.payload.success) {
            form.reset(); // Reset the form
            setRowData([]);
            navigate("/sales/order/register");
          }
        });
      }
    }
    setShowConfirmation(false); // Close the modal
  };

  const totalSum = rowData?.reduce((sum: number, item: any) => {
    // Convert rate and orderQty to numbers
    const rate = parseFloat(item.rate);
    const orderQty = item.orderQty;

    // Ensure rate and orderQty are valid numbers before multiplying
    if (!isNaN(rate) && !isNaN(orderQty)) {
      return sum + rate * orderQty;
    }
    return sum;
  }, 0);

  // Round the total sum to 2 decimal places
  const roundedTotalSum = Number(totalSum?.toFixed(2));

  return (
    <Wrapper>
      {loading && <FullPageLoading />}
      <AddPOPopovers uiState={uiState} derivedState={derivedType} />
      <div className="h-[calc(100vh-150px)] grid grid-cols-[400px_1fr]">
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-[10px] p-[10px]">
          <Card className="rounded-sm shadow-sm shadow-slate-500">
            <CardHeader className="flex flex-row items-center justify-between p-[10px] bg-[#e0f2f1]">
              <CardTitle className="font-[550] text-slate-600">
                Client Detail
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-[20px] flex flex-col gap-[10px] text-slate-600">
              <h3 className="font-[600]">Name</h3>
              <p className="text-[14px]">{form.getValues("bill_name")}</p>
              <h3 className="font-[600]">Address</h3>
              <p className="text-[14px]">
                {form.getValues("customer_address1")}
                {form.getValues("customer_address2")}
              </p>
              <h3 className="font-[600]">GSTIN</h3>
              <p className="text-[14px]">{form.getValues("customer_gstin")}</p>
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
                      <h3 className="font-[600]">
                        Sub-Total value before Taxes :
                        <span className="font-normal">{`(+) ${
                          roundedTotalSum ?? 0.0
                        }`}</span>
                      </h3>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                    <div>
                      <h3 className="font-[600]">
                        CGST :{" "}
                        <span className="font-normal">{`(+) ${cgstTotal?.toFixed(
                          2
                        )}`}</span>
                      </h3>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                    <div>
                      <h3 className="font-[600]">
                        SGST :{" "}
                        <span className="font-normal">{`(+) ${sgstTotal?.toFixed(
                          2
                        )}`}</span>
                      </h3>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                    <div>
                      <h3 className="font-[600]">
                        ISGST :{" "}
                        <span className="font-normal">{`(+) ${igstTotal?.toFixed(
                          2
                        )}`}</span>
                      </h3>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                    <div>
                      <h3 className="font-[600] text-cyan-600">
                        Sub-Total values after Taxes :
                        <span className="font-normal text-cyan-950">{`(+) ${(
                          roundedTotalSum +
                          cgstTotal +
                          sgstTotal +
                          igstTotal
                        ).toFixed(2)}`}</span>
                      </h3>
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto bg-white">
          <div className="flex items-center w-full gap-[20px] h-[60px] px-[10px] justify-between">
            <Button
              onClick={addNewRow}
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
            >
              <Plus className="font-[600]" /> Add Item
            </Button>
            <div className="flex items-center gap-[20px]">
              {/* <Button
                onClick={onBtExport}
                className="bg-[#217346] text-white hover:bg-[#2fa062] hover:text-white flex items-center gap-[10px] text-[15px] shadow shadow-slate-600 rounded-md"
              >
                <FaFileExcel className="text-white w-[20px] h-[20px]" /> Export
                to Excel
              </Button> */}
              <Button
                onClick={() => setExcelModel(true)}
                className="bg-[#217346] text-white hover:bg-[#2fa062] hover:text-white flex items-center gap-[10px] text-[15px] shadow shadow-slate-600 rounded-md"
              >
                <Upload className="text-white w-[20px] h-[20px]" /> Upload Excel
              </Button>
            </div>
          </div>
          <div className="ag-theme-quartz h-[calc(100vh-210px)] w-full">
            <AgGridReact
              ref={gridRef}
              rowData={rowData || []}
              columnDefs={columnDefs as (ColDef | ColGroupDef)[]}
              defaultColDef={defaultColDef}
              statusBar={statusBar}
              components={components}
              pagination={false}
              paginationPageSize={100}
              animateRows={true}
              gridOptions={commonAgGridConfig}
              suppressCellFocus={false}
              suppressRowClickSelection={false}
            />
          </div>
        </div>
      </div>
      <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
        {/* <Button className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]">
          Reset
        </Button> */}
        <Button
          className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
          onClick={() => setTab("create")}
        >
          Back
        </Button>
        <Button
          className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
      <ConfirmationModal
        open={showConfirmation}
        onClose={confirmSubmit}
        title="Confirm Submit!"
        description="Are you sure to submit details of all components of this Sales Order?"
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-radius: 0;
    border: 0;
  }
  .ag-theme-quartz .ag-cell {
    justify-content: center;
  }
`;

export default AddSalesOrder;
