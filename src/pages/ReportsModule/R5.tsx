import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Space } from "antd";

import { toast, useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";

import {
  exportDatepace,
  exportDateRangespace,
} from "@/components/shared/Options";
import socket from "@/components/shared/socket";
const FormSchema = z.object({
  date: z
    .union([z.date(), z.array(z.date()).length(2)]) // Either a single date or an array with exactly 2 dates
    .optional()
    .refine(
      (data) => {
        // Additional refinement to ensure that if it's an array, it has exactly 2 dates
        if (Array.isArray(data)) {
          return data.length === 2;
        }
        return true; // If it's a single date, it's valid
      },
      {
        message: "Please select a valid date range.",
      }
    ),
  types: z.string().optional(),
});

const R5 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  //   const { addToast } = useToastContainer()
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY/MM/DD";

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    let { date } = formData;

    let dataString = exportDatepace(date);

    socket.emit("allComponentCloseingStock", {
      date: dataString,
    });
    toast({
      title: "Report will be sent to your email",
      className: "bg-cyan-700 text-white",
    });
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
      headerName: "Pick Slip No.",
      field: "PICKSLIPNNO",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Cost Center",
      field: "COSTCENTER",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Date & Time",
      field: "DATE",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "TYPE",
      field: "TYPE",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "Part No",
      field: "PART",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Component",
      field: "COMPONENT",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Box No",
      field: "FROMLOCATION",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Qty",
      field: "OUTQTY",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "UoM",
      field: "UNIT",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "Vendor Name",
      field: "CUSTOMER",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Approved By",
      field: "ISSUEBY",
      filter: "agTextColumnFilter",
      width: 190,
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

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(fetchQueryResults)}
            className="space-y-6 overflow-hidden p-[10px] h-[370px]"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Space direction="vertical" size={12} className="w-full">
                      {/* <RangePicker
                        className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                        onChange={(value) =>
                          field.onChange(
                            value ? value.map((date) => date!.toDate()) : []
                          )
                        }
                        format={"DD/MM/YYYY"}
                      /> */}
                      <DatePicker
                        format="DD-MM-YYYY" // Set the format to dd-mm-yyyy
                        onChange={(date, dateString) => {
                          // Use `date` to get the Date object, or `dateString` for formatted value
                          form.setValue("date", date ? date.toDate() : null);
                        }}
                        className="w-[100%] border-slate-400 shadow-none mt-[2px]"
                      />
                    </Space>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* )} */}
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              //   onClick={() => {
              //     fetchBOMList();
              //   }}
            >
              Search
            </Button>
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]"></div>
    </Wrapper>
  );
};

export default R5;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
