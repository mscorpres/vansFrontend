import React, { useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import socket from "@/components/shared/socket";

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
import dayjs from "dayjs"; // Added dayjs import

import { toast, useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";

import { exportDatepace } from "@/components/shared/Options";

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

const R1 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(), // Set default value to today's date
    },
  });
  const { execFun, loading: loading1 } = useApi();

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    let { date } = formData;

    let dataString = exportDatepace(formData?.date);

    socket.emit("stockPartBoxWise", {
      reqFor: "downloade_trans_out",
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
    <Wrapper className="h-[calc(100vh-100px)] flex flex-col">
      {/* Filter Section */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(fetchQueryResults)}
              className="flex items-center gap-4"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="w-[300px] m-0">
                    <FormControl>
                      <Space direction="vertical" size={12} className="w-full">
                        <DatePicker
                          format="DD-MM-YYYY" // Set the format to dd-mm-yyyy
                          defaultValue={dayjs()} // Set today's date as default
                          onChange={(date, dateString) => {
                            form.setValue("date", date ? date.toDate() : null);
                          }}
                          className="w-[100%] border-gray-300 shadow-none py-[7px] hover:border-gray-400"
                        />
                      </Space>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
              >
                Download
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Grid Section (Uncommented and Styled) */}
      <div className="ag-theme-quartz flex-1">
        {/* <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
        /> */}
      </div>
    </Wrapper>
  );
};

export default R1;

const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;