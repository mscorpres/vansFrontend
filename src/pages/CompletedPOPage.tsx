import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { DatePicker, Divider, Dropdown, Form, Menu, Space } from "antd";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { AppDispatch, RootState } from "@/store";
import { fetchCompletedPo, printPO } from "@/features/client/clientSlice";
import { exportDateRangespace } from "@/components/shared/Options";
import { MoreOutlined } from "@ant-design/icons";
import ViewCompoents from "./ProcurementModule/ManagePO/ViewCompoents";
import POCancel from "./ProcurementModule/ManagePO/POCancel";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import MINPO from "./ProcurementModule/ManagePO/MINPO";
import { downloadFunction } from "@/components/shared/PrintFunctions";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { transformOptionData2 } from "@/helper/transform";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { toast } from "@/components/ui/use-toast";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { rangePresets } from "@/General";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { Button } from "@mui/material";
import { Search } from "@/components/shared/Buttons";

const ActionMenu: React.FC<ActionMenuProps> = ({
  setView,
  row,
  printTheSelectedPo,
}) => {
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

const { RangePicker } = DatePicker;
// const dateFormat = "DD/MM/YYYY";
const CompletedPOPage: React.FC = () => {
  const { loading } = useSelector((state: RootState) => state.client);

  const [form] = Form.useForm();
  const [rowData, setRowData] = useState([]);
  const [view, setView] = useState(false);
  const [viewMinPo, setViewMinPo] = useState(false);
  const [remarkDescription, setRemarkDescription] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const selectedwise = Form.useWatch("wise", form);

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
      headerName: "Cost Center",
      flex: 1,
      cellRenderer: CopyCellRenderer,
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
      headerName: "PO Reg. Date",
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

  const printTheSelectedPo = async (row: any) => {
    dispatch(
      printPO({ poid: row?.po_transaction ?? row?.po_transaction_code })
    ).then((res: any) => {
      if (res.payload.success) {
        let { data } = res.payload;
        downloadFunction(data.buffer.data, data.filename);
      }
    });
  };
  const dispatch = useDispatch<AppDispatch>();

  const fetchManageList = async () => {
    const values = await form.validateFields();
    let datas;
    setRowData([]);
    if (values.wise.value === "datewise") {
      datas = exportDateRangespace(values.data);
    } else if (values.wise.value === "vendorwise") {
      datas = values.data.value;
    } else {
      datas = values.data;
    }

    let payload = { data: datas, wise: values.wise.value };
    //setLoading(true);
    dispatch(fetchCompletedPo(payload)).then((res: any) => {
      if (res.payload.success) {
        let arr = res.payload.data;

        let list = arr.data.map((r: any) => {
          return { ...r };
        });
        setRowData(list);
      } else {
        toast({
          title: res.payload.message,
          className: "bg-red-700 text-white",
        });
      }
      //setLoading(false);
    });
    //setLoading(false);

    // if (managePoList) {
    //   setRowData(managePoList);
    // }
  };

  useEffect(() => {
    form.setFieldValue("data", "");
  }, [selectedwise]);

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
          className="space-y-6 overflow-hidden p-[10px] h-[470px]"
        >
          {/* <form
            onSubmit={form.handleSubmit(fetchManageList)}
            className="space-y-6 overflow-hidden p-[10px] h-[370px]"
          > */}
          <Form.Item
            className="w-full"
            name="wise"
            rules={[{ required: true }]}
          >
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
            <Form.Item
              className="w-full"
              name="data"
              rules={[{ required: true }]}
            >
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
                  presets={rangePresets}
                />
              </Space>
            </Form.Item>
          ) : selectedwise?.value === "vendorwise" ? (
            <Form.Item
              className="w-full"
              name="data"
              rules={[{ required: true }]}
            >
              <ReusableAsyncSelect
                placeholder="Vendor Name"
                endpoint="/backend/vendorList"
                transform={transformOptionData2}
                // onChange={(e) => form.setFieldValue("vendorName", e)}
                // value={selectedCustomer}
                fetchOptionWith="query2"
              />
            </Form.Item>
          ) : (
            <Form.Item
              className="w-full"
              name="data"
              rules={[{ required: true }]}
            >
              <Input placeholder="PO number" />
            </Form.Item>
          )}
          <div className="w-full flex justify-end">
            
            <Search onClick={fetchManageList} />
          </div>
         
        </Form>
        <Divider />
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        {loading && <FullPageLoading />}
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs as (ColDef | ColGroupDef)[]}
          defaultColDef={{ filter: true, sortable: true }}
          // rowSelection="multiple"
          // suppressRowClickSelection={false}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
        />
      </div>
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
      />
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
