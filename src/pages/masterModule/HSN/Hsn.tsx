import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";

import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import { transformOptionData } from "@/helper/transform";
import { Filter, Plus } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Form, Space } from "antd";
import { searchingHsn } from "@/features/client/clientSlice";
import { toast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import { fetchHSN, mapHSN } from "@/components/shared/Api/masterApi";

import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { CommonModal } from "@/config/agGrid/registerModule/CommonModal";
import { useDispatch, useSelector } from "react-redux";
import { RowData } from "@/data";
import { AppDispatch, RootState } from "@/store";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
const FormSchema = z.object({
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  soWise: z.string().optional(),
  compCode: z.string().optional(),
});

const Hsn = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [callreset, setCallReset] = useState(false);
  const [search, setSearch] = useState("");
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formValues, setFormValues] = useState({ compCode: "" });
  const dispatch = useDispatch<AppDispatch>();
  //   const { upda, currency } = useSelector(
  //     (state: RootState) => state.createSalesOrder
  //   );
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
  console.log("isValue", isValue);

  const gridRef = useRef<AgGridReact<RowData>>(null);
  const typeOption = [
    {
      label: "Component",
      value: "Component",
    },
    {
      text: "Other",
      value: "Other",
    },
  ];
  const smtOption = [
    {
      label: "Yes",
      value: "yes",
    },
    {
      label: "No",
      value: "no",
    },
  ];

  console.log("here in api", rowData);
  const getTheListHSN = async (value) => {
    const response = await execFun(() => fetchHSN(value), "fetch");
    const { data } = response;
    console.log("here in api", response);
    if (data.code == 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          //   ...r,
          gstRate: r.hsntax,
          hsnSearch: { text: r.hsnlabel, value: r.hsncode },
          isNew: true,
        };
      });
      console.log("arr", arr);
      setRowData(arr);
    }
  };
  const handleSearch = (searchKey: string, type: any) => {
    console.log("searchKey", searchKey);
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
    }
  }, [isValue]);

  const handleSubmit = async () => {
    const value = form.getFieldsValue();

    let payload = {
      component: value.partName.value,
      hsn: rowData.map((r) => r.hsnSearch.value),
      tax: rowData.map((r) => r.gstRate),
    };

    const response = await execFun(() => mapHSN(payload), "fetch");

    let { data } = response;
    if (response.data.code == 200) {
      console.log("response,", response.data.message);

      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });
      form.resetFields();
      setRowData([]);
      setShowConfirmation(false);
    } else {
      toast({
        title: data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const columnDefs: ColDef<rowData>[] = [
    // {
    // {
    //   headerName: "ID",
    //   field: "id",
    //   filter: "agNumberColumnFilter",
    //   width: 90,
    // },
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

    // {
    //   field: "action",
    //   headerName: "",
    //   flex: 1,
    //   cellRenderer: (e) => {
    //     return (
    //       <div className="flex gap-[5px] items-center justify-center h-full">
    //         <Button className=" bg-red-700 hover:bg-red-600 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-red-600">
    //           <Trash2
    //             className="h-[15px] w-[15px] text-white"
    //             onClick={() => setSheetOpenEdit(e?.data?.product_key)}
    //           />
    //         </Button>{" "}
    //       </div>
    //     );
    //   },
    // },
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
              <Form.Item name="partName" label="Part Name">
                <ReusableAsyncSelect
                  placeholder="Part Name"
                  endpoint="/backend/getComponentByNameAndNo"
                  transform={transformOptionData}
                  // onChange={(e) => log}
                  // value={selectedCustomer}
                  fetchOptionWith="payload"
                />
              </Form.Item>
            </div>{" "}
          </div>
          {/* <Button
            type="submit"
            className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
          >
            Submit
          </Button> */}
          {/* </form> */}
        </Form>{" "}
      </div>{" "}
      {/* <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        {" "}
        {loading1("fetch") && <FullPageLoading />}
      
      </div> */}
      {callreset == true && (
        <CommonModal
          isDialogVisible={callreset}
          handleOk={handleReset}
          handleCancel={() => setCallReset(false)}
          title="Reset Details"
          description={"Are you sure you want to remove this entry?"}
        />
      )}
      <div className="h-[calc(100vh-80px)] bg-white ">
        <div className="flex items-center w-full gap-[20px] h-[50px] px-[10px] justify-between">
          <Button
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
            suppressCellFocus={false}
            suppressRowClickSelection={false}
            rowSelection="multiple"
            checkboxSelection={true}
          />
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={() => setCallReset(true)}
            >
              Reset
            </Button>
            <Button
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
              //   onClick={() => setTab("create")}
            >
              Back
            </Button>
            <Button
              className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={() => setShowConfirmation(true)}
              disabled={rowData.length === 0}
            >
              Submit
            </Button>
          </div>
        </div>{" "}
      </div>{" "}
      <ConfirmationModal
        open={showConfirmation}
        onClose={setShowConfirmation}
        onOkay={handleSubmit}
        title="Confirm Submit!"
        description="Are you sure to submit the entry?"
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
