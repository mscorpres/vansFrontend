import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { StatusPanelDef, ColDef, ColGroupDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
// import { fetchComponentDetail } from "@/features/salesmodule/createSalesOrderSlice";
import SalesOrderTextInputCellRenderer from "@/config/agGrid/SalesOrderTextInputCellRenderer";
import {
  createSalesOrderRequest,
  fetchComponentDetail,
  updateSalesOrderRequest,
} from "@/features/salesmodule/createSalesOrderSlice";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { toast } from "@/components/ui/use-toast";

const AddSalesOrder = ({
  setTab,
  derivedType,
  form,
  setRowData,
  rowData,
  setBackCreate,
  getCostCenter,
}: {
  setTab: React.Dispatch<React.SetStateAction<string>>;
  payloadData: any;
  derivedType: string;
  form: any;
  rowData: any;
  setRowData: any;
  setBackCreate: any;
}) => {
  const [excelModel, setExcelModel] = useState<boolean>(false);
  const [backModel, setBackModel] = useState<boolean>(false);
  const [resetModel, setResetModel] = useState<boolean>(false);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);
  const [igstTotal, setIgstTotal] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [search] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
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
  console.log("derivedType", derivedType);

  const addNewRow = () => {
    const newRow: RowData = {
      material: "",
      asinNumber: "",
      orderQty: 1,
      // rate: 50,
      currency: "364907247",
      gstRate: 0,
      gstType: derivedType,
      localValue: 0,
      foreignValue: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      dueDate: "",
      hsnCode: "",
      fcValue: 0,
      lcValue: 0,
      isNew: true,
    };
    setRowData((prevData: any) => [...prevData, newRow]);
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
  const handleSearch = (searchKey: string) => {
    if (searchKey) {
      // Ensure there's a search key before dispatching
      dispatch(fetchComponentDetail({ search: searchKey }));
    }
  };

  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <SalesOrderTextInputCellRenderer
          {...props}
          componentDetails={[]}
          setSearch={handleSearch}
          search={search}
          onSearch={handleSearch}
          currency={"currency"}
          setRowData={setRowData}
          exRate={form.getValues("currency")}
          derivedType={derivedType}
          getCostCenter={getCostCenter}
        />
      ),
      datePickerCellRenderer: DatePickerCellRenderer,
      statusCellRenderer: StatusCellRenderer,
    }),
    []
  );

  // const onBtExport = useCallback(() => {
  //   gridRef.current!.api.exportDataAsExcel();
  // }, []);

  useEffect(() => {
    rowData?.length === 0 && addNewRow();
  }, []);

  console.log(rowData);
  const materials = {
    item: rowData?.map((component: RowData) =>
      typeof component.material === "object" && component.material !== null
        ? (component.material as any).code ||
          (component.material as any).value ||
          ""
        : component.material || ""
    ),
    qty: rowData?.map((component: RowData) =>
      component?.orderQty === undefined
        ? null
        : +Number(+Number(component.orderQty)?.toFixed(2))
    ),
    rate: rowData?.map((component: RowData) => Number(component.rate) || 0),
    gst_rate: rowData?.map(
      (component: RowData) => Number(component.gstRate) || 0
    ),
    hsn_code: rowData?.map((component: RowData) => component.hsnCode || ""),
    gst_type: rowData?.map((component: RowData) => component.gstType || ""),
    comp_remark: rowData?.map((component: RowData) => component.remark || ""),
    cgst_rate: rowData?.map((component: RowData) => component.cgst || 0),
    sgst_rate: rowData?.map((component: RowData) => component.sgst || 0),
    igst_rate: rowData?.map((component: RowData) => component.igst || 0),
    updaterow: rowData?.map((component: RowData) => component.updateid || 0),
  };
  const soId = (params.id as string)?.replace(/_/g, "/");

  const handleSubmit = () => {
    // if (confirmed) {
    // Proceed with the submission
    const payloadData2: any = {
      header: { ...form.getValues(), so_id: soId },
      itemDetails: materials,
    };
    if (window.location.pathname.includes("update")) {
      dispatch(updateSalesOrderRequest(payloadData2)).then((response: any) => {
        if (response.payload.success) {
          toast({
            className: "bg-green-600 text-white items-center",
            description:
              response.payload.message || "Sales Order created successfully",
          });
          form.reset(); // Reset the form
          setRowData([]);
          navigate("/sales/order/register");
        }
      });
    } else {
      dispatch(createSalesOrderRequest(payloadData2)).then((response: any) => {
        if (response.payload.success || response.payload.code == "200") {
          toast({
            className: "bg-green-600 text-white items-center",
            description:
              response.payload.message || "Sales Order updated successfully",
          });
          form.reset(); // Reset the form
          setRowData([]);
          navigate("/sales/order/register");
        }
      });
    }
    // }
    setShowConfirmation(false); // Close the modal
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

  const totalSum = rowData?.reduce((sum: number, item: any) => {
    // Convert rate and orderQty to numbers
    const rate = parseFloat(item.rate);
    const orderQty = item.orderQty;

    // Ensure rate and orderQty are valid numbers before multiplying
    if (!isNaN(rate) && !isNaN(orderQty)) {
      if (!isNaN(rate) && !isNaN(orderQty)) {
        // Calculate the total for the current item
        const itemTotal = rate * orderQty;
        return sum + itemTotal;
      }
    }
    return sum;
  }, 0);

  // Round the total sum to 2 decimal places
  const roundedTotalSum = Number(totalSum?.toFixed(2));

  return (
    <Wrapper>
      <AddPOPopovers uiState={uiState} derivedState={derivedType} />
      <div className="h-[calc(100vh-150px)] grid grid-cols-[400px_1fr]">
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-[10px] p-[10px]">
          <Card className="rounded-sm shadow-sm shadow-slate-500">
            <CardHeader className="flex flex-row items-center justify-between p-[10px] bg-[#e0f2f1]">
              <CardTitle className="font-[550] text-slate-600">
                Customer Detail
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-[20px] flex flex-col gap-[10px] text-slate-600">
              <h3 className="font-[500]">Name</h3>
              <p className="text-[14px]">{form.getValues("customer_name")}</p>
              <h3 className="font-[500]">Address</h3>
              <p className="text-[14px]">
                {form.getValues("billTo.address1") +
                  ", " +
                  form.getValues("billTo.address2")}
              </p>
              <h3 className="font-[500]">GSTIN</h3>
              <p className="text-[14px]">{form.getValues("billTo.gst")}</p>
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
              rowData={rowData}
              columnDefs={columnDefs as (ColDef | ColGroupDef)[]}
              defaultColDef={defaultColDef}
              statusBar={statusBar}
              components={components}
              animateRows={true}
              gridOptions={commonAgGridConfig}
              suppressCellFocus={false}
              suppressRowClickSelection={false}
            />
          </div>
        </div>
      </div>
      <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
        <Button
          className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
          onClick={() => {
            setTab("create");
            setBackCreate(true);
          }}
        >
          Back
        </Button>
        <Button
          className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
          onClick={() => setShowConfirmation(true)}
        >
          Submit
        </Button>
      </div>
      <ConfirmationModal
        open={showConfirmation}
        onClose={setShowConfirmation}
        onOkay={() => handleSubmit()}
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
