import React, { useMemo } from "react";
import { useCallback, useEffect, useState } from "react";

import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";

import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";

import styled from "styled-components";
import { DatePicker, Row, Space, Form } from "antd";
import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import ActionCellRenderer from "./ActionCellRenderer";
import { getGroupList, saveGroups } from "@/components/shared/Api/masterApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FullPageLoading from "@/components/shared/FullPageLoading";
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

const Groups = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });
  const [form] = Form.useForm();
  const { toast } = useToast();
  const { execFun, loading: loading1 } = useApi();
  const fetchProductList = async () => {
    const response = await execFun(() => getGroupList(), "fetch");
    console.log("response", response);
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
      //   addToast(response.message, {
      //     appearance: "success",
      //     autoDismiss: true,
      //   });
    } else {
      //   addToast(response.message, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
    }
  };
  const createEntry = async () => {
    const values = await form.validateFields();
    setLoading(true);
    console.log("values", values);
    let payload = {
      group_name: values.groupName,
    };
    const response = await execFun(() => saveGroups(payload), "fetch");
    console.log("response", response);
    const { data } = response;
    if (data.code === 200) {
      setLoading(false);
      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });
    } else {
      setLoading(false);
      toast({
        title: data.message || "Failed to Create Group",
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
      width: 750,
    },
    {
      headerName: "Insert Date",
      field: "group_insert_dt",
      filter: "agTextColumnFilter",
      width: 250,
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-50px)] grid grid-cols-[350px_1fr]">
      {" "}
      {loading1("fetch") && <FullPageLoading />}
      <div className="bg-[#fff]">
        {" "}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit the form?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => createEntry()}
                className="bg-[#0E7490] hover:bg-[#0E7490]"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Form form={form} layout="vertical">
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px]"
          >
            {" "}
            <Form.Item name="groupName" label="Group Name">
              <Input
                className={InputStyle}
                placeholder="Enter Group Name"
                // {...field}
              />
            </Form.Item>
            <Row justify="space-between">
              {" "}
              <Button
                type="reset"
                className="shadow bg-red-700 hover:bg-red-600 shadow-slate-500"
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
        />
      </div>
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
