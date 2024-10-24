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
  fetchCompletedPo,
  fetchManagePOList,
  printPO,
} from "@/features/client/clientSlice";
import {
  exportDateRange,
  exportDateRangespace,
} from "@/components/shared/Options";
import { MoreOutlined } from "@ant-design/icons";
import ViewCompoents from "./ProcurementModule/ManagePO/ViewCompoents";
import POCancel from "./ProcurementModule/ManagePO/POCancel";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import MINPO from "./ProcurementModule/ManagePO/MINPO";
import { useNavigate } from "react-router-dom";
import { downloadFunction } from "@/lib/PrintFunctions";
import FullPageLoading from "@/components/shared/FullPageLoading";
const ActionMenu: React.FC<ActionMenuProps> = ({
  setViewMinPo,
  setCancel,
  setView,
  row,
  printTheSelectedPo,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const menu = (
    <Menu>
      <Menu.Item
        key=" Components"
        onClick={() => setView(row)} // disabled={isDisabled}
      >
        View Components
      </Menu.Item>

      <Menu.Item
        key=" Print"
        onClick={() => printTheSelectedPo(row)} // disabled={isDisabled}
      >
        Print
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
// const dateFormat = "DD/MM/YYYY";
const CompletedPOPage: React.FC = () => {
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
  const [loading, setLoading] = useState([]);
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
          printTheSelectedPo={printTheSelectedPo}
        />
      ),
    },
    {
      field: "po_transaction_code",
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
      headerName: "Cost Center",
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
      headerName: "Vendor",
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
      headerName: "Po Reg. Date",
      flex: 1,
      filter: "agDateColumnFilter",
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO Reg. Date...",
        },
      },
    },
    // {
    //   field: "po_approval_status",
    //   headerName: "APPROVED STATUS",
    //   flex: 1,
    // },
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
  console.log("view", view);

  const printTheSelectedPo = async (row: any) => {
    console.log("row", row);
    setLoading(true);
    let payload = {
      poid: row?.po_transaction ?? row?.po_transaction_code,
    };
    console.log("payload", payload);

    dispatch(
      printPO({ poid: row?.po_transaction ?? row?.po_transaction_code })
    ).then((res: any) => {
      console.log("res", res);
      if (res.payload.code == 200) {
        let { data } = res.payload;
        downloadFunction(data.buffer, data.filename);
      }
      setLoading(false);
    });
    setLoading(false);
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
    let date = exportDateRangespace(values.data);
    console.log("date", date);

    let payload = { data: date, wise: values.wise.value };
    console.log("payload", payload);
    setLoading(true);
    dispatch(fetchCompletedPo(payload)).then((res: any) => {
      console.log("res", res);
      if (res.payload.code == 200) {
        let arr = res.payload.data;

        let list = arr.data.map((r) => {
          return { ...r };
        });
        console.log("arr,ar", list);
        setRowData(list);
      }
      setLoading(false);
    });
    setLoading(false);

    // if (managePoList) {
    //   setRowData(managePoList);
    // }
  };
  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
    };
  }, []);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      {loading == true && <FullPageLoading />}
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
                  format="DD/MM/YYYY"
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

export default CompletedPOPage;
