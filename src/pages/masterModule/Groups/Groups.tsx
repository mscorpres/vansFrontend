import { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";

import { InputStyle } from "@/constants/themeContants";

import styled from "styled-components";
import { Row, Form } from "antd";
import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import { getGroupList, saveGroups } from "@/components/shared/Api/masterApi";
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
import MuiInput from "@/components/ui/MuiInput";
import { Button } from "@mui/material";
import ResetModal from "@/components/ui/ResetModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Reset, Submit } from "@/components/shared/Buttons";

const Groups = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [resetModel, setResetModel] = useState(false);
  const [form] = Form.useForm();
  const { toast } = useToast();
  const { execFun, loading: loading1 } = useApi();
  const fetchProductList = async () => {
    const response = await execFun(() => getGroupList(), "fetch");
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
    } else {
    }
  };
  const createEntry = async () => {
    setOpen(false);
    const values = await form.validateFields();
    setLoading(true);
    let payload = {
      group_name: values.groupName,
    };
    const response = await execFun(() => saveGroups(payload), "fetch");
    const { data } = response;
    if (data.success) {
      setLoading(false);
      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });
      setOpen(false);
      form.resetFields();
    } else {
      setLoading(false);
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
    setLoading(false);
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
      headerName: "Group Name",
      field: "group_name",
      filter: "agTextColumnFilter",
      width: 550,
      flex: 1,
    },
    {
      headerName: "Insert Date",
      field: "group_insert_dt",
      filter: "agTextColumnFilter",
      width: 250,
      flex: 1,
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-50px)] grid grid-cols-[350px_1fr]">
      <div className="bg-[#fff]">
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Add
        </div>
        <Form form={form} layout="vertical">
          <form className="space-y-6 overflow-hidden p-[20px]">
            {" "}
            <Form.Item
              name="groupName"
              rules={[{ required: true, message: "Group Name is required" }]}
            >
              <MuiInput
                name="groupName"
                form={form}
                placeholder="Group Name"
                fullWidth={true}
                label="Group Name"
              />
            </Form.Item>{" "}
            <div className="bg-whiteh-[50px] flex items-center justify-end ">
              <Reset
                onClick={(e: any) => {
                  e.preventDefault();
                  setResetModel(true);
                }}
              />
              <Submit
                text="Submit"
                onClick={(e: any) => {
                  setOpen(true);
                  e.preventDefault();
                }}
              />
            </div>
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-50px)] relative ">
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

export default Groups;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
