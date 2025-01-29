import { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { InputStyle } from "@/constants/themeContants";

import styled from "styled-components";
import { Form, Row } from "antd";
import { Input } from "@/components/ui/input";

import useApi from "@/hooks/useApi";
import {
  componentMapList,
  saveComponentMap,
} from "@/components/shared/Api/masterApi";
import { transformOptionData, transformOptionData2 } from "@/helper/transform";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Filter, Send } from "lucide-react";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { RowData } from "@/data";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import MuiInput from "@/components/ui/MuiInput";
import { Refresh } from "@mui/icons-material";
import { Button } from "@mui/material";
import ResetModal from "@/components/ui/ResetModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Reset, Submit } from "@/components/shared/Buttons";
const ComponentMap = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [resetModel, setResetModel] = useState(false);
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const [open, setOpen] = useState(false);
  const fetchComponentMap = async () => {
    const response = await execFun(() => componentMapList(), "fetch");
    let { data } = response;
    if (data.success) {
      let arr = response.data.data.map((r: any, index: any) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
    } else {
      toast({
        title: data.data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const createEntry = async () => {
    setOpen(false);
    const values = await form.validateFields();
    let payload = {
      comp: values.partName.value,
      vendor: values.vendorName.value,
      vendor_part_code: "--",
      vendor_comp: values.vendorPartName,
    };
    // return;
    const response = await execFun(() => saveComponentMap(payload), "fetch");
    let { data } = response;
    if (data.success) {
      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });
      fetchComponentMap();
      form.resetFields();
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  useEffect(() => {
    fetchComponentMap();
  }, []);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[450px_1fr]  overflow-hidden">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <Form
          form={form}
          layout="vertical"
          className="space-y-6 overflow-hidden  p-[15px] h-[500px]"
        >
          <div className="grid grid-cols-2 gap-[20px] mb-[-20px] ">
            <div className="">
              <Form.Item name="partName">
                <ReusableAsyncSelect
                  placeholder="Part Name"
                  endpoint="/backend/getComponentByNameAndNo"
                  transform={transformOptionData}
                  // onChange={(e) => log}
                  // value={selectedCustomer}
                  fetchOptionWith="query2"
                />
              </Form.Item>
            </div>

            <Form.Item name="vendorName">
              <ReusableAsyncSelect
                placeholder="Vendor Name"
                endpoint="/backend/vendorList"
                transform={transformOptionData2}
                // onChange={(e) => form.setFieldValue("vendorName", e)}
                // value={selectedCustomer}
                fetchOptionWith="query2"
              />
            </Form.Item>
          </div>
          <div className="">
            <Form.Item name="vendorPartName">
              <MuiInput
                form={form}
                name="vendorPartName"
                placeholder="Enter Vendor Part Name"
                label={"Vendor Part Name"}
              />
            </Form.Item>
          </div>

          <div className="bg-white h-[50px] flex items-center justify-end gap-[20px]">
            <Reset
              onClick={(e: any) => {
                setResetModel(true);
                e.preventDefault();
              }}
            />
            <Submit text="Submit" onClick={() => setOpen(true)} />
          </div>
          {/* </form> */}
        </Form>
      </div>
      <div className="ag-theme-quartz  h-[calc(100vh-100px)] relative">
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
      </div>

      <ResetModal open={resetModel} setOpen={setResetModel} form={form} />
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        form={form}
        submit={createEntry}
      />
    </Wrapper>
  );
};

export default ComponentMap;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
const columnDefs: ColDef<rowData>[] = [
  { headerName: "ID", field: "id", filter: "agNumberColumnFilter", width: 90 },
  {
    headerName: "Part Code",
    field: "part_no",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
    width: 120,
  },
  {
    headerName: "Part Name",
    field: "name",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
    width: 250,
  },
  {
    headerName: "Vendor Code",
    field: "vendor",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
    width: 180,
  },
  {
    headerName: "Vendor Name",
    field: "vendor_name",
    filter: "agTextColumnFilter",
    width: 250,
  },
  {
    headerName: "Vendor Part Name",
    field: "vendor_comp",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
    width: 250,
  },
];
