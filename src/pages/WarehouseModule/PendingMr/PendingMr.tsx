import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Filter } from "lucide-react";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { DatePicker, Divider, Dropdown, Form, Menu, Space } from "antd";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { AppDispatch, RootState } from "@/store";
import useApi from "@/hooks/useApi";
import { printPO } from "@/features/client/clientSlice";
import { MoreOutlined } from "@ant-design/icons";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { downloadFunction } from "@/components/shared/PrintFunctions";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { fetchTransactionForApproval } from "@/features/client/storeSlice";
import { toast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { Button } from "@mui/material";
const ActionMenu: React.FC<ActionMenuProps> = ({
  setViewMinPo,
  setCancel,
  setView,
  row,
  cancelTheSelectedPo,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const menu = (
    <Menu>
      <Menu.Item
        key="min"
        onClick={() => setViewMinPo(row)}
        // disabled={isDisabled}
      >
        Material In
      </Menu.Item>
      <Menu.Item
        key=" Components"
        onClick={() => setView(row)} // disabled={isDisabled}
      >
        View Components
      </Menu.Item>
      <Menu.Item
        key=" Edit"
        onClick={() =>
          navigate(
            `/create-po/edit/${row?.po_transaction?.replaceAll("/", "_")}`
          )
        } // disabled={isDisabled}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key=" Cancel"
        onClick={() => setCancel(row)} // disabled={isDisabled}
      >
        Cancel
      </Menu.Item>
      <Menu.Item
        key=" Print"
        onClick={() => cancelTheSelectedPo(row)} // disabled={isDisabled}
      >
        Print
      </Menu.Item>
      <Menu.Item
        key=" Attachment"
        // onClick={() => setViewBranch(row)} // disabled={isDisabled}
      >
        Add Attachment
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
const FormSchema = z.object({
  wise: z.string().optional(),
  data: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
});
const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const PendingMr: React.FC = () => {
  const { managePoList } = useSelector((state: RootState) => state.client);
  const { loading } = useSelector((state: RootState) => state.store);
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const [rowData, setRowData] = useState([]);
  const [date, setDate] = useState("");
  const [asyncOptions, setAsyncOptions] = useState("");
  const [view, setView] = useState(false);
  const [viewMinPo, setViewMinPo] = useState(false);
  const [remarkDescription, setRemarkDescription] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const selectedwise = Form.useWatch("wise", form);
  const dateFormat = "DD/MM/YYYY";

  const [columnDefs] = useState<ColDef[]>([
    {
      field: "action",
      headerName: "",
      width: 40,

      cellRenderer: (params: any) => (
        <ActionMenu
          setViewMinPo={setViewMinPo}
          setView={setView}
          setCancel={setCancel}
          row={params.data}
          cancelTheSelectedPo={cancelTheSelectedPo}
        />
      ),
    },
    {
      field: "po_transaction",
      headerName: "Id ",
      flex: 1,
      cellRenderer: CopyCellRenderer,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO ID...",
        },
      },
    },
    {
      field: "cost_center",
      headerName: "Request From Name",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Cost Center...",
        },
      },
    },
    {
      field: "vendor_name",
      headerName: "Request Reference Id",
      cellRenderer: CopyCellRenderer,
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Vendor & Narration...",
        },
      },
    },
    {
      field: "po_reg_date",
      headerName: "Request Date/Time",
      flex: 1,
      filter: "agDateColumnFilter",
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO Reg. Date...",
        },
      },
    },
    {
      field: "po_approval_status",
      headerName: "Action",
      flex: 1,
    },
  ]);
  const type = [
    {
      label: "Pending",
      value: "P",
    },
  ];
  const cancelTheSelectedPo = async (row: any) => {
    let payload = {
      poId: row?.po_transaction,
    };

    dispatch(printPO({ poid: row?.po_transaction })).then((res: any) => {
      if (res.payload.success) {
        let { data } = res.payload;
        downloadFunction(data.buffer, data.filename);
      }
    });
    // setLoading(false);
  };
  const dispatch = useDispatch<AppDispatch>();

  const fetchManageList = async () => {
    // setLoading(true);
    const values = await form.validateFields();
    // let date = exportDateRange(values.data);
    let payload = { status: values.wise.value };
    dispatch(fetchTransactionForApproval(payload)).then((res: any) => {
      if (res?.payload?.success) {
      } else {
        toast({
          title: res.payload?.message,
          className: "text-white bg-red-700",
        });
      }
    });

    if (managePoList) {
      setRowData(managePoList);
      // setLoading(false);
    } else {
    }
    // setLoading(false);
  };
  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
    };
  }, []);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      <div className="bg-[#fff]">
         
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px] p-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form
          form={form}
          className="space-y-6 overflow-hidden p-[10px] h-[370px]  "
        >
          {/* <form
            onSubmit={form.handleSubmit(fetchManageList)}
            className="space-y-6 overflow-hidden p-[10px] h-[370px]"
          > */}
          <Form.Item className="w-full" name="wise">
            <Select
              styles={customStyles}
              components={{ DropdownIndicator }}
              placeholder="Select Type"
              className="border-0 basic-single"
              classNamePrefix="select border-0"
              isDisabled={false}
              isClearable={true}
              isSearchable={true}
              options={type}
            />
          </Form.Item>
          <div className="w-full flex justify-end">
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500  flex justify-right items-right w-20"
              onClick={fetchManageList}
              variant="contained"
            >
              Search
            </Button>
          </div>
          {/* <CustomTooltip
              message="Add Address"
              side="top"
              className="bg-yellow-700"
            >
              <Button
                onClick={() => {
                  setSheetOpen(true);
                }}
                className="bg-cyan-700 hover:bg-cyan-600 p-0 h-[30px] w-[30px] flex justify-center items-center shadow-slate-500"
              >
                <Plus className="h-[20px] w-[20px]" />
              </Button>
            </CustomTooltip> */}
          {/* </form>  */}
        </Form>
        <Divider />
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)] relative">
         
        {loading && <FullPageLoading />}
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          // rowSelection="multiple"
          // suppressRowClickSelection={false}
          pagination={true}
          paginationPageSize={10}
          suppressCellFocus={true}
          paginationPageSizeSelector={[10, 25, 50]}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
        />
      </div> 
      {/* <ViewCompoents
        view={view}
        setView={setView}
        setShowConfirmation={setShowConfirmation}
        showConfirmation={showConfirmation}
        loading={loading}
      />
      <POCancel
        cancel={cancel}
        setCancel={setCancel}
        // handleCancelPO={handleCancelPO}
        remarkDescription={remarkDescription}
        setRemarkDescription={setRemarkDescription}
      /> 
      <MINPO viewMinPo={viewMinPo} setViewMinPo={setViewMinPo} /> */}
      <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        // onOkay={handleCancelPO}
        title="Confirm Submit!"
        description="Are you sure to submit details of all components of this Purchase Order?"
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

export default PendingMr;
