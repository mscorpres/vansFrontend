import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Space } from "antd";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Select from "react-select";
import { fetchSellRequestList } from "@/features/salesmodule/SalesSlice";
import { RootState } from "@/store";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
// import { columnDefs } from "@/config/agGrid/SalesOrderRegisterTableColumns";
import { useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import {
  componentList,
  getdetailsOfUpdateComponent,
  listOfUom,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import EditMaterial from "./EditMaterial";
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
  compCode: z.string().optional(),
});

const Material = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [suomOtions, setSuomOtions] = useState([]);
  const [grpOtions, setGrpOtions] = useState([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({ compCode: "" });
  const { execFun, loading: loading1 } = useApi();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const typeOption = [
    {
      label: "Component",
      value: "Component",
    },
    {
      text: "Other",
      value: "Other",
    },
  ];
  const smtOption = [
    {
      label: "Yes",
      value: "yes",
    },
    {
      label: "No",
      value: "no",
    },
  ];

  const loadingCellRenderer = useCallback(CustomLoadingCellRenderer, []);
  const listOfComponentList = async () => {
    const response = await execFun(() => componentList(), "fetch");
    console.log("here in api", response);
    let { data } = response;
    if (response.status == 200) {
      let comp = data.data;
      console.log("comp", comp);

      let arr = comp?.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      console.log("arr", arr);
      setRowData(arr);
    }
  };
  console.log("here in api", rowData);
  const listUom = async () => {
    const response = await execFun(() => listOfUom(), "fetch");
    const { data } = response;

    if (response.status == 200) {
      let arr = data.data.map((r, index) => {
        return {
          text: r.units_name,
          value: r.units_id,
        };
      });
      console.log("arr", arr);
      setAsyncOptions(arr);
    }
  };
  const listSUom = async () => {
    // const response = await execFun(() => listOfUom(), "submit");
    // console.log("response", response);
    const response = await spigenAxios.get("/suom");
    const { data } = response;
    // addToast("SUom List fetched", {
    //   appearance: "success",
    //   autoDismiss: true,
    // });
    if (response.status == 200) {
      console.log("data", data);

      let arr = data?.data?.map((r, index) => {
        return {
          label: r.units_name,
          value: r.units_id,
        };
      });
      setSuomOtions(arr);
    }
  };
  const listOfGroups = async () => {
    // const response = await execFun(() => listOfUom(), "submit");
    const response = await spigenAxios.get("/groups/allGroups");
    const { data } = response;
    if (response.status == 200) {
      console.log("datadata", data);

      let arr = data?.data.map((r, index) => {
        return {
          label: r.group_name,
          value: r.group_id,
        };
      });
      console.log("arr ssssss", arr);

      setGrpOtions(arr);
    }
  };
  useEffect(() => {
    listUom();
    listOfGroups();
    listSUom();
    listOfComponentList();
  }, []);
  const columnDefs: ColDef<rowData>[] = [
    // { headerName: 'ID', field: 'id', filter: 'agNumberColumnFilter'},
    {
      headerName: "Part Code",
      field: "c_part_no",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Component",
      field: "c_name",
      filter: "agTextColumnFilter",
      width: 200,
    },
    {
      headerName: "Description",
      field: "c_specification",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "UoM",
      field: "units_name",
      filter: "agTextColumnFilter",
    },
    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      cellRenderer: (param) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            <Button className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600">
              <Edit2
                className="h-[15px] w-[15px] text-white"
                onClick={() => setSheetOpenEdit(param?.data)}
              />
            </Button>
          </div>
        );
      },
    },
  ];


  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[550px_1fr]">
      <div className="bg-[#fff]">
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px] "
          >
            <div className="grid grid-cols-3 gap-[40px] mt-[30px]">
              <div className="">
                <FormField
                  control={form.control}
                  name="partCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>Part Code</FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="Part Code"
                          // {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="uom"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>UOM</FormLabel>
                      <FormControl>
                        <Select
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                          placeholder="UOM"
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="suom"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>S Uom</FormLabel>
                      <FormControl>
                        <Select
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                          placeholder="S Uom"
                          className="border-0 basic-single"
                          classNamePrefix="select border-0"
                          isDisabled={false}
                          isClearable={true}
                          isSearchable={true}
                          options={suomOtions}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <div className="">
                <FormField
                  control={form.control}
                  name="compName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Component name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="Component name"
                          // {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="soq"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>SOQ</FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="SOQ"
                          // {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>{" "}
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <div className="">
                <FormField
                  control={form.control}
                  name="Maker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>Maker</FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="Maker"
                          // {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>{" "}
              <div className="">
                <FormField
                  control={form.control}
                  name="Specifiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>Specifiction</FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="Specifiction"
                          // {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[40px] mt-[30px]">
              <div className="">
                <FormField
                  control={form.control}
                  name="group"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}> Group</FormLabel>
                      <FormControl>
                        <Select
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                          placeholder="Group"
                          className="border-0 basic-single"
                          classNamePrefix="select border-0"
                          isDisabled={false}
                          isClearable={true}
                          isSearchable={true}
                          options={grpOtions}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="">
                <FormField
                  control={form.control}
                  name="type"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}> Type</FormLabel>
                      <FormControl>
                        <Select
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                          placeholder="Type"
                          className="border-0 basic-single"
                          classNamePrefix="select border-0"
                          isDisabled={false}
                          isClearable={true}
                          isSearchable={true}
                          options={typeOption}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="smt"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}> SMT</FormLabel>
                      <FormControl>
                        <Select
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                          placeholder="SMT"
                          className="border-0 basic-single"
                          classNamePrefix="select border-0"
                          isDisabled={false}
                          isClearable={true}
                          isSearchable={true}
                          options={smtOption}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
            >
              Submit
            </Button>
          </form>
        </Form>{" "}
        <EditMaterial
          sheetOpenEdit={sheetOpenEdit}
          setSheetOpenEdit={setSheetOpenEdit}
        />
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        {" "}
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          loadingCellRenderer={loadingCellRenderer}
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
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;

export default Material;
