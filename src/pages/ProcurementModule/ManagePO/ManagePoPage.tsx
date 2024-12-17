import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "ag-grid-react";
import { Filter } from "lucide-react";
import React, { useEffect, useMemo, useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { DatePicker, Divider, Dropdown, Form, Menu, Space } from "antd";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { AppDispatch, RootState } from "@/store";
import { fetchManagePOList, printPO } from "@/features/client/clientSlice";
import { modelFixHeaderStyle } from "@/constants/themeContants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { InputStyle } from "@/constants/themeContants";
import { exportDateRange } from "@/components/shared/Options";
import { MoreOutlined } from "@ant-design/icons";
import ViewCompoents from "./ViewCompoents";
import POCancel from "./POCancel";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import MINPO from "./MINPO";
import { useNavigate } from "react-router-dom";
import { downloadFunction } from "@/components/shared/PrintFunctions";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import { IoCloudUpload } from "react-icons/io5";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/shared/FileUpload";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { spigenAxios } from "@/axiosIntercepter";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { transformOptionData, transformOptionData2 } from "@/helper/transform";
import { rangePresets } from "@/General";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { uploadAttachmentForPO } from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import { Button, TextField } from "@mui/material";
const ActionMenu: React.FC<ActionMenuProps> = ({
  setViewMinPo,
  setCancel,
  setView,
  row,
  cancelTheSelectedPo,
  setSheetOpen,
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
      <Menu.Item key=" Attachment" onClick={() => setSheetOpen(row)}>
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
  const { loading } = useSelector((state: RootState) => state.client);

  const [form] = Form.useForm();
  const [rowData, setRowData] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [view, setView] = useState(false);
  const [viewMinPo, setViewMinPo] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [remarkDescription, setRemarkDescription] = useState(false);
  const [captions, setCaptions] = useState("");
  const [cancel, setCancel] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const selectedwise = Form.useWatch("wise", form);
  const dateFormat = "DD/MM/YYYY";

  const { execFun, loading: loading1 } = useApi();
  const gridRef = useRef<AgGridReact<RowData>>(null);
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
          setSheetOpen={setSheetOpen}
        />
      ),
    },
    {
      field: "po_transaction",
      headerName: "PO Id ",
      width: "220",
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
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Cost Center...",
        },
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor & Narration",
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
      field: "po_reg_date",
      headerName: "PO Reg. Date",
      width: "190",
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
      headerName: "Approval Status",
      width: "190",
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
    let payload = {
      poId: row?.po_transaction,
    };

    dispatch(printPO({ poid: row?.po_transaction })).then((res: any) => {
      if (res.payload.success) {
        let { data } = res.payload;
        downloadFunction(data.buffer.data, data.filename);
      }
    });
  };
  const dispatch = useDispatch<AppDispatch>();

  const fetchManageList = async () => {
    const values = await form.validateFields();
    let date;
    let payload;
    setRowData([]);
    if (selectedwise?.value === "datewise") {
      date = exportDateRange(values.data);
      payload = { data: date, wise: values.wise.value };
    } else if (selectedwise?.value === "vendorwise") {
      payload = { data: values.data.value, wise: values.wise.value };
    } else {
      payload = { data: values.data, wise: values.wise.value };
    }
    dispatch(fetchManagePOList(payload)).then((res: any) => {
      setRowData([]);
      if (res.payload.success) {
        setRowData(res.payload.response.data);
      } else {
        toast({
          title: res.payload.message,
          className: "bg-red-700 text-white",
        });
      }
    });
  };
  const handleFileChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
  };
  const uploadDocs = async () => {
    const formData = new FormData();
    files.map((comp) => {
      formData.append("files", comp);
      formData.append("doc_name", captions);
      formData.append("po_id", sheetOpen?.po_transaction);
    });
    setLoadingPage(true);
    const response = await execFun(
      () => uploadAttachmentForPO(formData),
      "fetch"
    );

    if (response?.success || response.data?.success) {
      // toast
      toast({
        title: "Doc Uploaded successfully",
        className: "bg-green-600 text-white items-center",
      });
      setLoadingPage(false);
      setSheetOpen(false);
      setFiles([]);
      setCaptions("");
      setLoadingPage(false);
    } else {
      toast({
        title: response.message,
        className: "bg-red-600 text-white items-center",
      });
    }
    setLoadingPage(false);
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
                  format={dateFormat}
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
                onChange={(e) => form.setFieldValue("data", e)}
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
            <Button
              variant="contained"
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500  flex justify-right items-right w-20"
              onClick={fetchManageList}
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
          {/* </form>    */}
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
          // suppressRowClickSelection={true}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          // gridOptions={commonAgGridConfig}
        />
      </div>
      <ViewCompoents
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
      <MINPO viewMinPo={viewMinPo} setViewMinPo={setViewMinPo} />
      <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        // onOkay={handleCancelPO}
        title="Confirm Submit!"
        description="Are you sure to submit details of all components of this Purchase Order?"
      />
      <Sheet open={sheetOpen?.po_transaction} onOpenChange={setSheetOpen}>
        <SheetContent
          className="min-w-[35%] p-0 relative"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          {/* {loading == true && <FullPageLoading />} */}
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Upload Docs here</SheetTitle>
          </SheetHeader>
          {(loading1("fetch") || loadingPage) && <FullPageLoading />}
          <div className="ag-theme-quartz h-[calc(100vh-100px)] w-full">
            <FileUploader
              value={files}
              onValueChange={handleFileChange}
              dropzoneOptions={{
                accept: {
                  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".pdf"],
                },
                maxFiles: 1,
                maxSize: 4 * 1024 * 1024, // 4 MB
                multiple: true,
              }}
            >
              <div className="bg-white border border-gray-300 rounded-lg shadow-lg h-[120px] p-[20px] m-[20px]">
                <h2 className="text-xl font-semibold text-center mb-4">
                  <div className=" text-center w-full justify-center flex">
                    <div>Upload Your Files</div>
                    <div>
                      <IoCloudUpload
                        className="text-cyan-700 ml-5 h-[20]"
                        size={"1.5rem"}
                      />
                    </div>
                  </div>
                </h2>
                <FileInput>
                  <span className="text-slate-500 text-sm text-center w-full justify-center flex">
                    Drag and drop files here, or click to select files
                  </span>
                </FileInput>
              </div>
              <div className=" m-[20px]">
                <FileUploaderContent>
                  {files?.map((file, index) => (
                    <FileUploaderItem key={index} index={index}>
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
                </FileUploaderContent>
              </div>
            </FileUploader>
            <div className="w-full flex justify-center">
              <div className="w-[80%] flex justify-center">
                {/* <Input
                  placeholder="Enter Image Captions"
                  className={InputStyle}
                  onChange={(e) => setCaptions(e.target.value)}
                /> */}
                <TextField
                  //   id="filled-basic"
                  //   color="grey"
                  //   sx={{ height: "30px" }}
                  variant="outlined"
                  label="Image Captions"
                  placeholder="Enter Image Captions"
                  fullWidth={true}
                  // label={label}
                  value={captions}
                  onChange={(e) => setCaptions(e.target.value)}
                  //   error={form}
                  //   helperText={"geee"}
                  //   onChange={()=>{form.setFieldsValue({})}}
                />
              </div>
            </div>
          </div>
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              className="rounded-md shadow shadow-slate-500 max-w-max px-[30px]"
              onClick={() => setSheetOpen(false)}
            >
              Back
            </Button>
            <Button
              variant="contained"
              className="rounded-md shadow shadow-slate-500 max-w-max px-[30px]"
              onClick={uploadDocs}
              // loading={laoding}
            >
              {/* {isApprove ? "Approve" : "Submit"} */}
              Upload
            </Button>
          </div>
        </SheetContent>
      </Sheet>
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
