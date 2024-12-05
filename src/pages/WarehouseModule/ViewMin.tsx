import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Filter } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
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

import { exportDatepace } from "@/components/shared/Options";
import { MoreOutlined } from "@ant-design/icons";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { downloadFunction } from "@/components/shared/PrintFunctions";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import FullPageLoading from "@/components/shared/FullPageLoading";
import {
  getMinTransactionByDate,
  printSingleMin,
} from "@/features/client/storeSlice";
import { toast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
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
        key=" Print"
        onClick={() => cancelTheSelectedPo(row)} // disabled={isDisabled}
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
const dateFormat = "YYYY/MM/DD";
const ViewMin: React.FC = () => {
  const { managePoList } = useSelector((state: RootState) => state.client);
  const { loading } = useSelector((state: RootState) => state.store);

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
  // const [loading, setLoading] = useState(false);
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
      field: "datetime",
      headerName: "MIN Date Time ",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO ID...",
        },
      },
    },
    {
      field: "transaction",
      headerName: "MIN Id",
      cellRenderer: CopyCellRenderer,
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Cost Center...",
        },
      },
    },
    {
      field: "invoice",
      headerName: "Invoice Id",
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
      field: "vendorname",
      headerName: "Vendor Name",
      flex: 2,
      filter: "agDateColumnFilter",
      cellRenderer: CopyCellRenderer,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO Reg. Date...",
        },
      },
    },
    {
      field: "partcode",
      headerName: "Part Code",
      cellRenderer: CopyCellRenderer,
      flex: 1,
    },
    {
      field: "inqty",
      headerName: "In Qty",
      cellRenderer: CopyCellRenderer,
      flex: 1,
    },
    {
      field: "c_center",
      headerName: "Cost Center",
      flex: 1,
    },
    {
      field: "inby",
      headerName: "In By",
      flex: 1,
    },
  ]);
  const type = [
    {
      label: "Date Wise ",
      value: "datewise",
    },
    {
      label: "MIN Wise",
      value: "minwise",
    },
  ];
  const cancelTheSelectedPo = async (row: any) => {
    let payload = {
      transaction: row?.transaction,
    };

    dispatch(printSingleMin({ transaction: row?.transaction })).then(
      (res: any) => {
        if (res.payload.status) {
          let { data } = res.payload;
          downloadFunction(data.buffer.data, data.filename);
        }
      }
    );
    // setLoading(false);
  };
  const dispatch = useDispatch<AppDispatch>();

  const fetchManageList = async () => {
    // setLoading(true);
    const values = await form.validateFields();
    let date;
    if (values.wise.value == "datewise") {
      date = exportDatepace(values.data);
    } else {
      date = values.data;
    }
    let payload = { data: date, wise: values.wise.value };
    dispatch(getMinTransactionByDate(payload)).then((res: any) => {
      if (res.payload.success) {
        let arr = res.payload.data;
        let newRow = arr.data.map((r) => {
          return { ...r };
        });

        setRowData(newRow);
      } else {
        toast({
          title: res.payload.message.msg,
          className: "bg-red-700 text-white text-center",
        });
        // setLoading(false);
      }
    });

    if (managePoList) {
      setRowData(managePoList);
      // setLoading(false);
    }
    // setLoading(false);
  };
  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
    };
  }, []);
  useEffect(() => {
    form.setFieldValue("data", "");
  }, [selectedwise]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[300px_1fr]">
      {" "}
      <div className="bg-[#fff]">
        {" "}
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
          {selectedwise?.value === "datewise" ? (
            <Form.Item className="w-full" name="data">
              <Space direction="vertical" size={12} className="w-full">
                <DatePicker
                  className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                  // onChange={(e: any) => form.setFieldValue("data", e?.value)}
                  onChange={(date, dateString) => {
                    // Use `date` to get the Date object, or `dateString` for formatted value
                    form.setFieldValue("data", date ? date.toDate() : null);
                  }}
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
              <Input placeholder="MIN number" />
            </Form.Item>
          )}
          <div className="w-full flex justify-end">
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500  flex justify-right items-right w-20"
              onClick={fetchManageList}
            >
              Search
            </Button>{" "}
          </div>{" "}
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
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        {loading && <FullPageLoading />}
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          // rowSelection="multiple"
          // suppressRowClickSelection={false}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
        />
      </div>{" "}
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
      />{" "}
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

export default ViewMin;
