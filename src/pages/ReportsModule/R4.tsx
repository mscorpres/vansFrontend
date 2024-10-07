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
import MyAsyncSelect from "@/components/shared/MyAsyncSelect";
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
import { DatePicker, Divider, Space } from "antd";
import {
  transformCustomerData,
  transformOptionData,
  transformPlaceData,
} from "@/helper/transform";
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
import { spigenAxios } from "@/axiosIntercepter";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import {
  fetchListOfMINRegister,
  fetchListOfMINRegisterOut,
  fetchListOfQ1,
  fetchR4,
  getComponentsByNameAndNo,
} from "@/components/shared/Api/masterApi";
const FormSchema = z.object({
  date: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  types: z.string().optional(),
});

const R4 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  //   const { addToast } = useToastContainer()
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY/MM/DD";

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    console.log("formData", formData);
    // let { date } = formData;
    // let dataString = "";
    // if (date) {
    //   const startDate = date[0]
    //     .toLocaleDateString("en-GB")
    //     .split("/")
    //     .reverse()
    //     .join("-");
    //   const endDate = date[1]
    //     .toLocaleDateString("en-GB")
    //     .split("/")
    //     .reverse()
    //     .join("-");
    //   dataString = `${startDate}-${endDate}`;
    //   console.log("dateString", dataString);
    // }
    // let payload = {
    //   min_types: formData.types,
    //   data: dataString,
    // };
    const response = await execFun(() => fetchR4(), "fetch");
    console.log("response", response);
    let { data } = response;
    if (data.code == 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      console.log("arr", arr);

      setRowData(arr);
    } else {
      //   addToast(data.message.msg, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
    }
  };
  useEffect(() => {
    // fetchComponentList();
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
      field: "part_no",
      filter: "agTextColumnFilter",
      width: 140,
    },
    {
      headerName: "Part Name",
      field: "name",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Desc",
      field: "c_specification",
      filter: "agTextColumnFilter",
      width: 320,
    },

    {
      headerName: "Total Stock",
      field: "stock",
      filter: "agTextColumnFilter",
      width: 150,
    },

    {
      headerName: "Navs Stock",
      field: "navStock",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Stock Time",
      field: "closing_stock_time",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Make",
      field: "make",
      filter: "agTextColumnFilter",
      width: 180,
    },
    {
      headerName: "Soq",
      field: "soq",
      filter: "agTextColumnFilter",
      width: 150,
    },
  ];
  const type = [
    {
      label: "Pending",
      value: "P",
    },
    {
      label: "All",
      value: "A",
    },
    {
      label: "Project",
      value: "PROJECT",
    },
  ];
  useEffect(() => {
    fetchQueryResults();
  }, []);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-1">
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

export default R4;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
