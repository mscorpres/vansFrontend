import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";

import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import { Plus } from "lucide-react";
import styled from "styled-components";
import { Form } from "antd";
import { toast } from "@/components/ui/use-toast";

import useApi from "@/hooks/useApi";
import { fetchHSN } from "@/components/shared/Api/masterApi";

import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { CommonModal } from "@/config/agGrid/registerModule/CommonModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllBox, insertPhysical } from "@/features/client/storeSlice";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";

const CreatePhysicalStock = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [callreset, setCallReset] = useState(false);
  const [search, setSearch] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { boxData, loading } = useSelector((state: RootState) => state.store);

  const { execFun, loading: loading1 } = useApi();
  const addNewRow = () => {
    const newRow = {
      asinNumber: "B01N1SE4EP",
      boxName: "",
      boxPartName: "",
      orderQty: "",
      phyqty: "",
      location: "",

      isNew: true,
    };
    setRowData((prevData) => [...prevData, newRow]);
  };

  const [form] = Form.useForm();
  const isValue = Form.useWatch("partName", form);

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

  const getTheListHSN = async (value) => {
    const response = await execFun(() => fetchHSN(value), "fetch");
    const { data } = response;
    if (data.code == 200 || data.success) {
      let arr = data.data.map((r, index) => {
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
  const handleSearch = (searchKey: string, type: any, name: string) => {
    if (searchKey) {
      let p = { search: searchKey };

      dispatch(getAllBox(p));
    }
  };

  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          {...props}
          setRowData={setRowData}
          setSearch={handleSearch}
          //   setBoxSearch={handleMoveToBoxSearch}
          search={search}
          onSearch={handleSearch}
          //   onMoveToSearch={handleMoveToBoxSearch}
          //   componentDetails={boxData}
          //   boxData={boxData}
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
    // return;
    let payload = {
      boxname: rowData.map((r) => r.boxName),
      componentname: rowData.map((r) => r.boxPartName),
      c_qty: rowData.map((r) => String(r.orderQty)),
      update_physicalStock: rowData.map((r) => String(r.phyqty)),
      remark: rowData.map((r) => r.remark),
    };

    dispatch(insertPhysical(payload)).then((res: any) => {
      if (res.payload.success) {
        toast({
          title: res.payload.message,
          className: "bg-green-600 text-white items-center",
        });
        setRowData([]);
      } else {
        toast({
          title: res.payload.message,
          className: "bg-red-600 text-white items-center",
        });
      }
    });
    setShowConfirmation(false);
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
      headerName: " Box Name",
      field: "boxName",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Part Name",
      field: "boxPartName",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Box Qty",
      field: "orderQty",
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Physical Qty",
      field: "phyqty",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Location",
      field: "remark",
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
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[0px_1fr] overflow-hidden">
      <div className="bg-[#fff]">
        {loading1("fetch") && <FullPageLoading />}{" "}
        <div className="p-[10px]"></div>
        <Form
          form={form}
          layout="vertical"
          className="space-y-6 overflow-hidden p-[10px] h-[400px]"
        ></Form>{" "}
      </div>{" "}
      {callreset == true && (
        <CommonModal
          isDialogVisible={callreset}
          handleOk={handleReset}
          handleCancel={() => setCallReset(false)}
          title="Reset Details"
          description={"Are you sure you want to remove this entry?"}
        />
      )}
      <div className="h-[calc(100vh-80px)]  ">
        <div className="flex items-center w-full gap-[20px] h-[50px] px-[10px] justify-between bg-white">
          <Button
            onClick={() => {
              addNewRow();
            }}
            className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
          >
            <Plus className="font-[600]" /> Add Item
          </Button>{" "}
        </div>
        <div className="ag-theme-quartz h-[calc(100vh-200px)] w-full">
          {loading && <FullPageLoading />}
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
            suppressCellFocus={true}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
          />
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={() => setCallReset(true)}
              disabled={rowData.length == 0}
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
              className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={() => setShowConfirmation(true)}
              disabled={rowData.length == 0}
            >
              Submit
            </Button>
          </div>
        </div>{" "}
      </div>{" "}
      <ConfirmationModal
        open={showConfirmation}
        onOkay={handleSubmit}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Submit!"
        description="Are you sure you want to process the request ?"
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

export default CreatePhysicalStock;
