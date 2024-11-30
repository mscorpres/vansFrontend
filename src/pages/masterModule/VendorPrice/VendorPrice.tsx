import { useState } from "react";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import styled from "styled-components";
import { Divider, Form, Typography } from "antd";
import { useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/shared/FileUpload";
import {
  createVendorPrice,
  uplaodPriceList,
} from "@/components/shared/Api/masterApi";
import { RowData } from "@/data";
import { ColDef } from "ag-grid-community";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { IoCloudUpload } from "react-icons/io5";
import { downloadCSVCustomColumns } from "@/components/shared/ExportToCSV";
import { Filter } from "lucide-react";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
const FormSchema = z.object({
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  soWise: z.string().optional(),
});

const VendorPrice = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { toast } = useToast();
  const [files, setFiles] = useState<File[] | null>(null);

  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const sampleData = [
    {
      VENDOR_CODE: "VEN0002",
      PART_CODE: "TG0002",
      // PART_NAME: "BATTERY",
      RATE: "5",
    },
  ];

  const handleFileChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
  };
  const sendFileForParse = async () => {
    setRowData([]);
    const formData = new FormData();
    files.map((comp) => {
      formData.append("file", comp);
    });
    const response = await execFun(() => uplaodPriceList(formData), "fetch");
   
    let { data } = response;
    if (data?.success) {
      let arr = response.data.data.map((r: any, index: any) => {
        return {
          id: index + 1,

          ...r,
        };
      });

      setRowData(arr);
      // toast
      // toast({
      //   title: response.data.message,
      //   className: "bg-green-600 text-white items-center",
      // });
      // setLoading(false);
      setSheetOpen(false);
      // setAttachmentFile(response.data.data);
    } else {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
    }
    // setLoading(false);
  };

  const onsubmit = async () => {
    const response = await execFun(() => createVendorPrice(rowData), "fetch");

    const { data } = response;
    if (data?.success) {
      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });
      form.resetFields();
      setRowData([]);
      setFiles([]);
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  const columnDefs: ColDef<RowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      flex: 1,
      width: 90,
    },
    {
      headerName: "Vendor Code",
      field: "vendorCode",
      flex: 1,
      filter: "agTextColumnFilter",
      width: 380,
    },
    {
      headerName: "Part Code",
      field: "partCode",
      flex: 1,
      filter: "agTextColumnFilter",
      width: 250,
    },
    // {
    //   headerName: "Part Name",
    //   field: "partname",
    //   filter: "agTextColumnFilter",
    //   width: 250,
    // },
    {
      headerName: "Rate",
      field: "rate",
      filter: "agTextColumnFilter",
      flex: 1,
      width: 250,
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] overflow-hidden">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="ag-theme-quartz h-[calc(100vh-150px)] w-full">
          {loading1("fetch") && <FullPageLoading />}
          <FileUploader
            value={files}
            onValueChange={handleFileChange}
            dropzoneOptions={{
              accept: {
                "image/*": [".xlsx", ".csv", ".xls"],
              },
              maxFiles: 1,
              maxSize: 4 * 1024 * 1024, // 4 MB
              multiple: true,
            }}
          >
            <div className="bg-white border border-gray-300 rounded-lg shadow-lg h-[120px] p-[20px] m-[10px]">
              <h2 className="text-xl font-semibold text-center mb-4">
                <div className=" text-center w-full justify-center flex">
                  {" "}
                  <div>Upload Your Files</div>
                  <div>
                    {" "}
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
              </FileInput>{" "}
            </div>{" "}
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
          <Divider />
          <div className="flex items-center justify-between p-[10px]">
            <a
              onClick={() =>
                downloadCSVCustomColumns(sampleData, "POVENDORPRICNG")
              }
              type="link"
            >
              <Typography underline className="text-cyan-700">
                Sample File
              </Typography>
            </a>
            <Button
              type="submit"
              className="bg-cyan-700 hover:bg-cyan-600"
              onClick={() => sendFileForParse()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-150px)]">
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          //   loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
        />
        <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
          <Button
            className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
            onClick={() => setRowData([])}
          >
            Reset
          </Button>{" "}
          <Button
            className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
            onClick={onsubmit}
            // loading={laoding}
            disabled={rowData.length === 0}
          >
            {/* {isApprove ? "Approve" : "Submit"} */}
            Send For Approval
          </Button>{" "}
        </div>
      </div>{" "}
    </Wrapper>
  );
};

export default VendorPrice;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
