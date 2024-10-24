import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Badge, Edit2, EyeIcon, Filter, Trash } from "lucide-react";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { DatePicker, Divider, Dropdown, Form, Menu, Space } from "antd";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { AppDispatch, RootState } from "@/store";
import useApi from "@/hooks/useApi";
import { fetchListOfVendor } from "@/components/shared/Api/masterApi";
import {
  cancelPO,
  fetchManagePOList,
  printPO,
} from "@/features/client/clientSlice";
import { exportDateRange } from "@/components/shared/Options";
import { MoreOutlined } from "@ant-design/icons";
import ViewCompoents from "./ViewCompoents";
import POCancel from "./POCancel";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import MINPO from "./MINPO";
import { useNavigate } from "react-router-dom";
import { downloadFunction } from "@/components/shared/PrintFunctions";
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
const ManagePoPage: React.FC = () => {
  const { managePoList } = useSelector((state: RootState) => state.client);
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  // const rowdata = podetail;
  const [wise, setWise] = useState("");
  const [rowData, setRowData] = useState([]);
  const [date, setDate] = useState("");
  const [asyncOptions, setAsyncOptions] = useState("");
  const [view, setView] = useState(false);
  const [viewMinPo, setViewMinPo] = useState(false);
  const [remarkDescription, setRemarkDescription] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const selectedwise = Form.useWatch("wise", form);
  const dateFormat = "YYYY/MM/DD";

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
      headerName: "PO ID",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO ID...",
        },
      },
    },
    {
      field: "cost_center",
      headerName: "COST CENTER",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Cost Center...",
        },
      },
    },
    {
      field: "po_comment",
      headerName: "VENDER & NARRATION",
      flex: 2,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Vendor & Narration...",
        },
      },
    },
    {
      field: "po_reg_date",
      headerName: "PO REG. DATE",
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
      headerName: "APPROVED STATUS",
      flex: 1,
    },
  ]);
  const type = [
    {
      label: "Date Wise ",
      value: "datewise",
    },
    {
      label: "PO Wise",
      value: "powise",
    },
    {
      label: "Vendor Wise",
      value: "vendorwise",
    },
  ];
  const cancelTheSelectedPo = async (row: any) => {
    console.log("row", row);
    let payload = {
      poId: row?.po_transaction,
    };
    console.log("payload", payload);

    dispatch(printPO({ poid: row?.po_transaction })).then((res: any) => {
      console.log("res", res);
      if (res.payload.code == 200) {
        let { data } = res.payload;
        downloadFunction(data.buffer, data.filename);
      }
    });
    // setLoading(false);
  };
  const dispatch = useDispatch<AppDispatch>();
  const getVendorList = async () => {
    // return;

    const response = await execFun(() => fetchListOfVendor(), "fetch");
    // return;
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data.map((r, index) => {
        return {
          label: r.name,
          value: r.code,
        };
      });
      setAsyncOptions(arr);
    }
  };
  const fetchManageList = async () => {
    const values = await form.validateFields();
    let date = exportDateRange(values.data);
    let payload = { data: date, wise: values.wise.value };
    let arr = dispatch(fetchManagePOList(payload));

    if (managePoList) {
      setRowData(managePoList);
    }
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
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px] p-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form
          form={form}
          className="space-y-6 overflow-hidden p-[10px] h-[370px]"
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
          {selectedwise?.value === "datewise" ? (
            <Form.Item className="w-full" name="data">
              <Space direction="vertical" size={12} className="w-full">
                <RangePicker
                  className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                  // onChange={(e: any) => form.setFieldValue("data", e?.value)}
                  onChange={(value) =>
                    form.setFieldValue(
                      "data",
                      value ? value.map((date) => date!.toDate()) : []
                    )
                  }
                  format={dateFormat}
                />
              </Space>
            </Form.Item>
          ) : selectedwise?.value === "vendorwise" ? (
            <Form.Item className="w-full" name="data">
              <Input placeholder="vendor number" />
            </Form.Item>
          ) : (
            <Form.Item className="w-full" name="data">
              <Input placeholder="PO number" />
            </Form.Item>
          )}
          <Button
            type="submit"
            className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
            onClick={fetchManageList}
          >
            Search
          </Button>{" "}
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
          {/* </form>{" "} */}
        </Form>
        <Divider />
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-120px)]">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          // rowSelection="multiple"
          // suppressRowClickSelection={false}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>{" "}
      <ViewCompoents
        view={view}
        setView={setView}
        setShowConfirmation={setShowConfirmation}
        showConfirmation={showConfirmation}
      />
      <POCancel
        cancel={cancel}
        setCancel={setCancel}
        // handleCancelPO={handleCancelPO}
        remarkDescription={remarkDescription}
        setRemarkDescription={setRemarkDescription}
      />{" "}
      <MINPO viewMinPo={viewMinPo} setViewMinPo={setViewMinPo} />
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

export default ManagePoPage;
