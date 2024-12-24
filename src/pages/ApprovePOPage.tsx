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
import { fetchneededApprovalPO, printPO } from "@/features/client/clientSlice";
import { exportDateRangespace } from "@/components/shared/Options";
import { MoreOutlined } from "@ant-design/icons";
import ViewCompoents from "./ProcurementModule/ManagePO/ViewCompoents";
import POCancel from "./ProcurementModule/ManagePO/POCancel";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import MINPO from "./ProcurementModule/ManagePO/MINPO";
import { useNavigate } from "react-router-dom";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { transformOptionData, transformOptionData2 } from "@/helper/transform";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { rangePresets } from "@/General";
import { ColGroupDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { Button } from "@mui/material";
import { Search } from "@/components/shared/Buttons";
const ActionMenu: React.FC<ActionMenuProp> = ({ row }) => {
  const navigate = useNavigate();

  const menu = (
    <Menu>
      <Menu.Item
        key=" Components"
        onClick={() =>
          navigate(
            `/create-po/approve/${row?.po_transaction?.replaceAll("/", "_")}`
          )
        } // disabled={isDisabled}
      >
        View Components
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
const ApprovePOPage: React.FC = () => {
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
      field: "po_costcenter",
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
    {
      label: "Project Wise",
      value: "projectwise",
    },
  ];
  const cancelTheSelectedPo = async (row: any) => {
    let payload: any = {
      poId: row?.po_transaction,
    };
    dispatch(printPO(payload)).then((res: any) => {});
  };
  const dispatch = useDispatch<AppDispatch>();

  const fetchManageList = async () => {
    setRowData([]);
    const values = await form.validateFields();
    let data;
    if (values.wise.value === "datewise") {
      data = exportDateRangespace(values.data);
    } else if (values.wise.value === "vendorwise") {
      data = values.data.value;
    } else {
      data = values.data;
    }

    let payload = { data: data, wise: values.wise.value };

    dispatch(fetchneededApprovalPO(payload)).then((res: any) => {
      if (res.payload.success) {
        let arr = res.payload.data;

        arr.map((r: any) => {
          return { ...r };
        });
        setRowData(arr);
      } else {
        toast({
          title: res.payload.message,
          className: "bg-red-700 text-white",
        });
      }
    });

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
                  format={"DD/MM/YYYY"}
                  presets={rangePresets}
                />
              </Space>
            </Form.Item>
          ) : selectedwise?.value === "vendorwise" ? (
            <Form.Item className="w-full" name="data">
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
            <Form.Item className="w-full" name="data">
              <Input placeholder="Type here" />
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
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
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

export default ApprovePOPage;
