import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";

import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import { transformOptionData } from "@/helper/transform";
import { Filter, Plus } from "lucide-react";
import styled from "styled-components";
import { Form } from "antd";
import { searchingHsn } from "@/features/client/clientSlice";
import { toast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import { fetchHSN, mapHSN } from "@/components/shared/Api/masterApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { useDispatch, useSelector } from "react-redux";
import { RowData } from "@/data";
import { AppDispatch, RootState } from "@/store";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { Button } from "@mui/material";
import { Refresh, Save, Send } from "@mui/icons-material";
import ResetModal from "@/components/ui/ResetModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

const Hsn = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [callreset, setCallReset] = useState(false);
  const [search, setSearch] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { hsnlist } = useSelector((state: RootState) => state.client);

  const { execFun, loading: loading1 } = useApi();
  const addNewRow = () => {
    const newRow = {
      asinNumber: "B01N1SE4EP",

      gstRate: 18,

      hsnSearch: "",
      isNew: true,
    };
    setRowData((prevData) => [...prevData, newRow]);
  };

  const [form] = Form.useForm();
  const isValue = Form.useWatch("partName", form);

  const gridRef = useRef<AgGridReact<RowData>>(null);

  const getTheListHSN = async (value: any) => {
    const response = await execFun(() => fetchHSN(value), "fetch");
    const { data } = response;
    if (data.success) {
      let arr = data.data.map((r: any, index: any) => {
        return {
          id: index + 1,
          //   ...r,
          gstRate: r.hsntax,
          hsnSearch: { text: r.hsnlabel, value: r.hsncode },
          isNew: true,
        };
      });
      setRowData(arr);
    }
  };
  const handleSearch = (searchKey: string, type: any) => {
    if (searchKey) {
      let p = { searchTerm: searchKey };
      dispatch(searchingHsn(p));
    }
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
          componentDetails={hsnlist}
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
    if (isValue?.value) {
      getTheListHSN(isValue?.value);
      setRowData([]);
    }
  }, [isValue]);

  const handleSubmit = async () => {
    setShowConfirmation(false);
    const value = form.getFieldsValue();
    let payload = {
      component: value.partName.value,
      hsn_code: rowData.map((r: any) => r.hsnSearch.value ?? r.hsnSearch),
      tax: rowData.map((r: any) => r.gstRate),
    };

    const response = await execFun(() => mapHSN(payload), "fetch");

    let { data } = response;
    if (data.success) {
      setRowData([]);
      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });
      form.resetFields();

      setShowConfirmation(false);
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "",
      valueGetter: "node.rowIndex + 1",
      cellRenderer: "textInputCellRenderer",
      maxWidth: 100,
      field: "delete",
    },
    {
      headerName: "HSN/SAC Code",
      field: "hsnSearch",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Tax (%) Percentage",
      field: "gstRate",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
  ];
  const handleReset = () => {
    form.resetFields();
    setRowData([]);
    setCallReset(false);
  };

  return (
    <Wrapper className="h-[calc(100vh-50px)] grid grid-cols-[450px_1fr] overflow-hidden">
      <div className="bg-[#fff]">
        {loading1("fetch") && <FullPageLoading />}{" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form
          form={form}
          layout="vertical"
          className="space-y-6 overflow-hidden p-[10px] h-[400px]"
        >
          <div className="grid grid-cols-3 gap-[40px] ">
            <div className="col-span-3 ">
              <Form.Item name="partName">
                <ReusableAsyncSelect
                  placeholder="Part Name"
                  endpoint="/backend/getComponentByNameAndNo"
                  transform={transformOptionData}
                  // onChange={(e) => log}
                  // value={selectedCustomer}
                  fetchOptionWith="query2"
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>

      <div className="h-[calc(100vh-80px)] bg-white ">
        <div className="flex items-center w-full gap-[20px] h-[50px] px-[10px] justify-between">
          <Button
            variant="contained"
            onClick={() => {
              addNewRow();
            }}
            className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
          >
            <Plus className="font-[600]" /> Add Item
          </Button>{" "}
        </div>
        <div className="ag-theme-quartz h-[calc(100vh-150px)] w-full">
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
            rowSelection="multiple"
            checkboxSelection={true}
            suppressCellFocus={true}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
          />
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              startIcon={<Refresh />}
              className="rounded-md shadow  max-w-max px-[30px]"
              onClick={() => setCallReset(true)}
            >
              Reset
            </Button>
            {/* <Button
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
              //   onClick={() => setTab("create")}
            >
              Back
            </Button> */}
            <Button
              startIcon={<Send />}
              variant="contained"
              className="rounded-md  max-w-max px-[30px]"
              onClick={() => setShowConfirmation(true)}
              disabled={rowData.length === 0}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      <ResetModal
        open={callreset}
        setOpen={setCallReset}
        form={form}
        message={"row"}
        reset={handleReset}
      />
      <ConfirmModal
        open={showConfirmation}
        setOpen={setShowConfirmation}
        form={form}
        submit={handleSubmit}
      />
    </Wrapper>
  );
};
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;

export default Hsn;
