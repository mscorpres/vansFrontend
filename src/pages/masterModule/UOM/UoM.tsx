import { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";

import { InputStyle } from "@/constants/themeContants";

import styled from "styled-components";
import { Row, Form } from "antd";
import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import {
  createNewUomEntry,
  listOfUom,
} from "@/components/shared/Api/masterApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FullPageLoading from "@/components/shared/FullPageLoading";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { Filter } from "lucide-react";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { ColDef } from "@ag-grid-community/core";
import MuiInput from "@/components/ui/MuiInput";
import { Button } from "@mui/material";
import { Refresh, Send } from "@mui/icons-material";
import ResetModal from "@/components/ui/ResetModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

const UoM = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [resetModel, setResetModel] = useState(false);
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();
  const { toast } = useToast();
  const { execFun, loading: loading1 } = useApi();
  const fetchProductList = async () => {
    const response = await execFun(() => listOfUom(), "fetch");
    let { data } = response;
    if (data.success) {
      let arr = data.data.map((r: any, index: any) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
      // toast({
      //   title: data.message,
      //   className: "bg-green-600 text-white items-center",
      // });
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const createEntry = async () => {
    setOpen(false);
    const values = await form.validateFields();
    let payload = {
      description: values.description,
      uom: values.groupName,
    };
    const response = await execFun(() => createNewUomEntry(payload), "fetch");
    const { data } = response;
    if (data.success) {
      toast({
        title: data.message || "Created Successfully",
        className: "bg-green-600 text-white items-center",
      });
      form.resetFields();
      setOpen(false);
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
      setOpen(false);
    }
    fetchProductList();
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Unit Name",
      field: "units_name",
      filter: "agTextColumnFilter",
      width: 250,
      flex: 4,
    },
    {
      headerName: "Unit Description",
      field: "units_details",
      filter: "agTextColumnFilter",
      minWidth: 550,
      flex: 4,
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      {" "}
      {loading1("fetch") && <FullPageLoading />}
      <div className="bg-[#fff]">
        {" "}
        {loading1("fetch") && <FullPageLoading />}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px] ">
          <Filter className="h-[20px] w-[20px]" />
          Add
        </div>
        <Form form={form} layout="vertical">
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden  p-[15px] mt-[10px]"
          >
            {" "}
            <Form.Item
              name="groupName"
              // label="Unit Name"
              rules={[{ required: true, message: "Unit Name is required" }]}
            >
              <MuiInput
                form={form}
                name="groupName"
                placeholder="Unit Name"
                label={"Unit Name"}
              />
            </Form.Item>
            <Form.Item
              name="description"
              // label="Unit Descrption"
              rules={[{ required: true, message: "Descrption is required" }]}
            >
              <MuiInput
                form={form}
                name="description"
                placeholder="Enter Descrption"
                label={"Unit Descrption"}
              />
            </Form.Item>
            <div className="bg-white h-[50px] flex items-center justify-end gap-[20px]">
              <Button
                // type="reset"
                className="shadow shadow-slate-500 mr-[10px]"
                onClick={(e: any) => {
                  setResetModel(true);
                  e.preventDefault();
                }}
                startIcon={<Refresh />}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                onClick={(e: any) => {
                  setOpen(true);
                  e.preventDefault();
                }}
                startIcon={<Send />}
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 ml-[20px]"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
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
      <ResetModal open={resetModel} setOpen={setResetModel} form={form}  />
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        form={form}
        submit={createEntry}
      />
    </Wrapper>
  );
};

export default UoM;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
