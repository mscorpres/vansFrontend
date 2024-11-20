import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { InputStyle, LableStyle } from "@/constants/themeContants";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import { Input } from "@/components/ui/input";

import Select from "react-select";

import useApi from "@/hooks/useApi";
import {
  listOfUom,
  saveService,
  serviceList,
  servicesaddition,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import FullPageLoading from "@/components/shared/FullPageLoading";
import EditService from "./EditService";
import { Form } from "antd";
import { useToast } from "@/components/ui/use-toast";
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
const Service = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const { toast } = useToast();
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();

  const listUom = async () => {
    const response = await execFun(() => listOfUom(), "fetch");
    const { data } = response;

    if (response.status == 200) {
      let arr = data.data.map((r, index) => {
        return {
          label: r.units_name,
          value: r.units_id,
        };
      });
      setAsyncOptions(arr);
    }
  };

  const fetchServiceList = async () => {
    const response = await execFun(() => serviceList(), "fetch");
    const { data } = response;
    console.log("response0", response);
    if (response.status === 200) {
      let arr = data.data.map((r, id) => {
        return { id: id + 1, ...r };
      });
      setRowData(arr);
    }
  };
  useEffect(() => {
    fetchServiceList();
    listUom();
  }, []);
  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Part Code",
      field: "c_part_no",
      filter: "agTextColumnFilter",
      width: 200,
    },
    {
      headerName: "Component",
      field: "c_name",
      filter: "agTextColumnFilter",
      width: 250,
    },

    {
      headerName: "UoM",
      field: "units_name",
      filter: "agTextColumnFilter",
      width: 200,
    },
    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      cellRenderer: (e) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            {/* <Button className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600"> */}
            <Edit2
              className="h-[20px] w-[20px] text-cyan-700 "
              onClick={() => setSheetOpenEdit(e?.data?.component_key)}
            />
            {/* </Button> */}
          </div>
        );
      },
    },
  ];
  const onSubmit = async () => {
    const values = await form.validateFields();
    let payload = {
      part: values.partCode,
      uom: values.uom.value,
      component: values.compName,
      notes: values.specifiction,
    };
    const response = await execFun(() => saveService(payload), "fetch");
    let { data } = response;
    if (response.data.code == 200) {
      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });

      form.resetFields();
      fetchServiceList();
    } else {
      toast({
        title: data.message.msg || "Failed to Create Group",
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[450px_1fr] overflow-hidden">
      {" "}
      {loading1("fetch") && <FullPageLoading />}
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Add
        </div>
        <div className="p-[10px]"></div>
        <Form form={form} layout="vertical" {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px]"
          >
            <div className="grid grid-cols-2 gap-[40px]  ">
              <div className="">
                <Form.Item
                  name="partCode"
                  label="Part Code"
                  rules={[
                    { required: true, message: "Please enter Part Code!" },
                  ]}
                >
                  <Input
                    className={InputStyle}
                    placeholder="Part Code"
                    // {...field}
                  />
                </Form.Item>
              </div>
              <div className="">
                <Form.Item
                  name="uom"
                  label="UOM"
                  rules={[{ required: true, message: "Please enter UOM!" }]}
                >
                  <Select
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    placeholder="UoM"
                    className="border-0 basic-single"
                    classNamePrefix="select border-0"
                    isDisabled={false}
                    isClearable={true}
                    isSearchable={true}
                    options={asyncOptions}
                    //   onChange={(e) => console.log(e)}
                    //   value={
                    //     data.clientDetails
                    //       ? {
                    //           label: data.clientDetails.city.name,
                    //           value: data.clientDetails.city.name,
                    //         }
                    //       : null
                    //   }
                  />
                </Form.Item>
              </div>
            </div>
            <div className="">
              <Form.Item
                name="compName"
                label="Component Name"
                rules={[
                  { required: true, message: "Please enter Component Name!" },
                ]}
              >
                <Input
                  className={InputStyle}
                  placeholder="Component Name"
                  // {...field}
                />
              </Form.Item>
            </div>

            <div className="">
              <Form.Item
                name="specifiction"
                label="Specifiction"
                rules={[
                  { required: true, message: "Please enter Specifiction!" },
                ]}
              >
                <Input
                  className={InputStyle}
                  placeholder="Specifiction"
                  // {...field}
                />
              </Form.Item>
            </div>

            <Button
              type="submit"
              onClick={(e: any) => {
                onSubmit();
                e.preventDefault();
              }}
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
            >
              Submit
            </Button>
          </form>
        </Form>
        {sheetOpenEdit?.length > 0 && (
          <EditService
            sheetOpenEdit={sheetOpenEdit}
            setSheetOpenEdit={setSheetOpenEdit}
          />
        )}
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
        />
      </div>
    </Wrapper>
  );
};

export default Service;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
