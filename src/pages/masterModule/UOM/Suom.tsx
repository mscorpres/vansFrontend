import { useEffect, useState } from "react";

import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";

import { InputStyle } from "@/constants/themeContants";

import styled from "styled-components";
import { Row, Form } from "antd";
import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import {
  createNewSUomEntry,
  listOfsUom,
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

const Suom = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [resetModel, setResetModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { toast } = useToast();
  const { execFun, loading: loading1 } = useApi();
  const fetchProductList = async () => {
    const response = await execFun(() => listOfsUom(), "fetch");
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
        className: "bg-green-600 text-white items-center",
      });
    }
  };
  const createEntry = async () => {
    setOpen(false);
    const values = await form.validateFields();
    setLoading(true);
    let payload = {
      description: values.description,
      uom: values.groupName,
      scode: values.code,
    };
    const response = await execFun(() => createNewSUomEntry(payload), "fetch");
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
      setOpen(false);
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
    <Wrapper className="h-[calc(100vh-50px)] grid grid-cols-[350px_1fr]">
      {" "}
      {loading1("fetch") && <FullPageLoading />}
      <div className="bg-[#fff]">
        {" "}
        <ConfirmationModal
          open={open}
          onClose={setOpen}
          onOkay={createEntry}
          title="Confirm Submit!"
          description="Are you sure to submit the entry?"
        />
        {loading1("fetch") && <FullPageLoading />}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Add
        </div>
        <Form form={form} layout="vertical">
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px]"
          >
            {" "}
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="groupName"
                label="Unit Name"
                rules={[{ required: true, message: "Unit Name is required" }]}
              >
                <Input
                  className={InputStyle}
                  placeholder="Enter Unit Name"
                  // {...field}
                />
              </Form.Item>
              <Form.Item
                name="code"
                label="Short Code"
                rules={[{ required: true, message: "Short Code is required" }]}
              >
                <Input
                  className={InputStyle}
                  placeholder="Enter Short Code"
                  // {...field}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="description"
              label="Secondary Descrption"
              rules={[{ required: true, message: "Descrption is required" }]}
            >
              <Input
                className={InputStyle}
                placeholder="Enter Descrption"
                // {...field}
              />
            </Form.Item>
            <Row justify="space-between">
              {" "}
              <Button
                // type="reset"
                className="shadow bg-red-700 hover:bg-red-600 shadow-slate-500"
                onClick={(e: any) => {
                  setResetModel(true);
                  e.preventDefault();
                }}
              >
                Reset
              </Button>
              <Button
                onClick={(e: any) => {
                  setOpen(true);
                  e.preventDefault();
                }}
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              >
                Submit
              </Button>
            </Row>
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-50px)]">
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
      </div>{" "}
      <AlertDialog open={resetModel} onOpenChange={setResetModel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-600">
              Are you absolutely sure you want to reset the form?
            </AlertDialogTitle>
            {/* <AlertDialogDescription>Are you sure want to logout.</AlertDialogDescription> */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-700 shadow hover:bg-red-600 shadow-slate-500"
              onClick={() => form.resetFields()}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Wrapper>
  );
};

export default Suom;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
