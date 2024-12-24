import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Filter } from "lucide-react";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import SearchIcon from "@mui/icons-material/Search";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { DatePicker, Divider, Dropdown, Form, Menu, Space } from "antd";
import Select from "react-select";
import { AppDispatch, RootState } from "@/store";
import useApi from "@/hooks/useApi";

import { exportDateRangespace } from "@/components/shared/Options";
import { MoreOutlined } from "@ant-design/icons";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { printFunction } from "@/components/shared/PrintFunctions";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import FullPageLoading from "@/components/shared/FullPageLoading";
import {
  fetchPrintPickSetelement,
  printPickSetelement,
} from "@/features/client/storeSlice";
import { transformOptionData2 } from "@/helper/transform";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { rangePresets } from "@/General";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { Button } from "@mui/material";
const ActionMenu: React.FC<ActionMenuProps> = ({ row, printTheSelectedPo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const menu = (
    <Menu>
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
const dateFormat = "YYYY/MM/DD";
const PrintPickSlip: React.FC = () => {
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
          printTheSelectedPo={printTheSelectedPo}
        />
      ),
    },
    {
      field: "part",
      headerName: "Part ",
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
      field: "component",
      headerName: "Component",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Cost Center...",
        },
      },
    },
    {
      field: "desc",
      headerName: "Desc & Narration",
      cellRenderer: CopyCellRenderer,
      flex: 2,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Vendor & Narration...",
        },
      },
    },
    {
      field: "transaction",
      headerName: "Transaction",
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
      field: "remark",
      headerName: "Remark",
      flex: 1,
    },
  ]);
  const type = [
    {
      label: "Date Wise ",
      value: "datewise",
    },
    {
      label: "Txn Wise",
      value: "transaction_wise",
    },
  ];
  const printTheSelectedPo = async (row: any) => {
    let payload = {
      pickSlip_no: row?.transaction,
    };
    // return;
    dispatch(printPickSetelement({ pickSlip_no: row?.transaction })).then(
      (res: any) => {
        if (res.payload.success) {
          let { data } = res.payload;
          printFunction(data.buffer.data);
          // downloadFunction(data.buffer, data.filename);
        }
      }
    );
    // setLoading(false);
  };
  const dispatch = useDispatch<AppDispatch>();
  const fetchManageList = async () => {
    const values = await form.validateFields();
    setRowData([]);
    let date;
    if (values.wise.value === "datewise") {
      date = exportDateRangespace(values.data);
    } else {
      date = values.data.value;
    }
    let payload = { data: date, wise: values.wise.value };
    dispatch(fetchPrintPickSetelement(payload)).then((res: any) => {
      if (res.payload.success) {
        let a = res.payload.response.data;
        let arr = a.map((r) => {
          return {
            ...r,
          };
        });

        setRowData(arr);
      }
    });
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
          className="space-y-6 overflow-hidden p-[10px] h-[470px]  "
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
              className="border-0 basic-single z-10"
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
                  presets={rangePresets}
                />
              </Space>
            </Form.Item>
          ) : (
            <Form.Item className="w-full" name="data">
              <ReusableAsyncSelect
                placeholder="Search Transaction Id"
                endpoint="/backend/getOutTransaction"
                transform={transformOptionData2}
                fetchOptionWith="query2"
                // onChange={handleCostCenterChange}
                // value={selectedCostCenter}
              />
            </Form.Item>
          )}
          <div className="w-full flex justify-end">
            <Button
              variant="contained"
              type="submit"
              onClick={fetchManageList}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </div>
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
          paginationPageSizeSelector={[10, 25, 50]}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
        />
      </div>
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

export default PrintPickSlip;
