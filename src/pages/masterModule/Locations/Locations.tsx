import React, { useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { ICellRendererParams } from "ag-grid-community";
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
import ActionCellRenderer from "./ActionCellRenderer";
import {
  componentList,
  componentMapList,
  fetchLocationList,
  getComponentsByNameAndNo,
  getParentLocationOptions,
  getProductList,
  listOfUom,
  serviceList,
  servicesaddition,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import { convertSelectOptions } from "@/lib/utils";
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

const Locations = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  let arr = [];
  const customFlatArray = (array, prev) => {
    array?.map((row) => {
      let parent = "--";
      let obj = row;
      if (!row.children) {
        if (prev) {
          obj["parentLocation"] = prev.name;
        } else {
          obj["parentLocation"] = "--";
        }
      }
      if (row.children) {
        if (prev) {
          obj["parentLocation"] = prev.name;
        } else {
          obj["parentLocation"] = "--";
        }
        let children = row.children;

        delete obj["children"];
        arr = [...arr, obj];
        customFlatArray(children, obj);
        arr = [...arr, ...children];
        // }
      }
      //  else {
      //   let obj = row;

      //   if (prev) {
      //     obj["parentLocation"] = prev.name;
      //   } else {
      //     obj["parentLocation"] = "--";
      //   }
      //   arr = [...arr, obj];
      // }
    });

    return arr;
  };
  const fetchGrouplist = async () => {
    const response = await execFun(() => fetchLocationList(), "fetch");
    console.log("response -", response);
    let { data } = response;
    if (response.status === 200) {
      let a = customFlatArray(data.data);
      let arr = a.map((r, id) => {
        return { id: id + 1, ...r };
      });
      console.log("arr", arr);
      console.log("a", a);
      //   setLocationData(arr);
      console.log("arr", arr);
      setRowData(arr);
      //   addToast(response.message, {
      //     appearance: "success",
      //     autoDismiss: true,
      //   });
    }
  };
  const fetchGroupOptionslist = async () => {
    const response = await execFun(() => getParentLocationOptions(), "fetch");
    console.log("response", response);
    if (response.status == 200) {
      let { data } = response;
      //   let arr = convertSelectOptions(data);
      //
      let arr = data?.map((r, index) => {
        return {
          label: r.text,
          value: r.id,
        };
      });
      console.log("arr", arr);

      setAsyncOptions(arr);
    }
  };

  useEffect(() => {
    fetchGroupOptionslist();
    fetchGrouplist();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Locations Name",
      field: "name",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Parent Location",
      field: "parentLocation",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Is Blocked",
      field: "status",
      filter: "agTextColumnFilter",
      width: 190,
    },
  ];
  const locType = [
    {
      label: "Loaction Type",
      value: "yes",
    },
    {
      label: "Storage",
      value: "no",
    },
    {
      label: "Non Storage",
      value: "non",
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[450px_1fr]">
      <div className="bg-[#fff]">
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px] h-full"
          >
            {" "}
            <div className="">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LableStyle}>Location</FormLabel>
                    <FormControl>
                      <Input
                        className={InputStyle}
                        placeholder="Enter Locations Name"
                        // {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>{" "}
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <div className="">
                <FormField
                  control={form.control}
                  name="locationUnder"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Location Under
                      </FormLabel>
                      <FormControl>
                        <Select
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                          placeholder=" Enter Location"
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
                  name="locationType"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Location Type
                      </FormLabel>
                      <FormControl>
                        <Select
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                          placeholder=" Enter Type"
                          className="border-0 basic-single"
                          classNamePrefix="select border-0"
                          isDisabled={false}
                          isClearable={true}
                          isSearchable={true}
                          options={locType}
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
            <div className="">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LableStyle}>Enter Address</FormLabel>
                    <FormControl>
                      <Input
                        className={InputStyle}
                        placeholder="Enter Address"
                        // {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>{" "}
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
            >
              Submit
            </Button>
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
        />
      </div>
    </Wrapper>
  );
};

export default Locations;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
