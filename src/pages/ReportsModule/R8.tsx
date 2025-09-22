import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { toast } from "@/components/ui/use-toast";

import {
  InputStyle,
} from "@/constants/themeContants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import styled from "styled-components";
import { DatePicker, Space } from "antd";
import Select from "react-select";
import moment from "moment";

import useApi from "@/hooks/useApi";

import { fetchR8 } from "@/components/shared/Api/masterApi";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import { IoMdDownload } from "react-icons/io";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import socket from "@/components/shared/socket";

const FormSchema = z.object({
  types: z.string().optional(),
  date: z.date().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  search: z.string().optional(),
});

const R8 = () => {
  const [rowData, setRowData] = useState([]);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      types: "",
      date: null,
      startDate: null,
      endDate: null,
      search: "",
    },
  });
  const { execFun, loading: loading1 } = useApi();

  const dateFormat = "DD/MM/YYYY";
  const theType = form.watch("types");

  const fetchQueryResults = (e) => {
    e.preventDefault();
    console.log("Button clicked!"); // Debug log
    
    const formData = form.getValues();
    console.log("Form data:", formData);
    
    setRowData([]);
    let dataString = "";

    // Validation based on type
    if (!formData.types) {
      toast({
        title: "Error",
        description: "Please select a report type",
        variant: "destructive",
      })
      return;
    }

    if (formData.types === "datewise") {
      if (!formData.date) {
       toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
       })
        return;
      }
      // Handle datewise via socket
      dataString = moment(formData.date).format("DD-MM-YYYY");
      console.log("Emitting socket event with:", { wise: "datewise", data: dataString });
      
      socket.emit("outwardReportGenerate", {
        wise: "datewise",
        data: dataString,
      });
      
      toast({
        title: "Report generation started - will be sent to your email",
        className: "bg-cyan-700 text-white",
      });
      return;
    }

    if (formData.types === "daterange") {
      if (!formData.startDate || !formData.endDate) {
       toast({
        title: "Error",
        description: "Please select start and end date",
        variant: "destructive",
       })
        return;
      }
      dataString = `${moment(formData.startDate).format("DD-MM-YYYY")} to ${moment(formData.endDate).format("DD-MM-YYYY")}`;
    }

    if (formData.types === "customerwise") {
      if (!formData.search || formData.search.trim() === "") {
       toast({
        title: "Error",
        description: "Please enter customer name",
        variant: "destructive",
       })
        return;
      }
      dataString = formData.search.trim();
    }

    if (formData.types === "outwardwise") {
      if (!formData.search || formData.search.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter pickslip/transaction ID",
        variant: "destructive",
      })
        return;
      }
      dataString = formData.search.trim();
    }

    // API call for non-datewise queries
    const payload = {
      wise: formData.types,
      data: dataString,
    };

    console.log("API Payload:", payload);

    execFun(() => fetchR8(payload), "fetch")
      .then((response) => {
        let { data } = response;
        if (data && data.success) {
          let arr = data.response.data.map((r, index) => ({
            id: index + 1,
            ...r,
          }));
          setRowData(arr);
          toast({
            title: `Found ${arr.length} records`,
            className: "bg-green-700 text-white text-center",
          })
        } else {
         toast({
          title: data.message || "no data found",
          className: "bg-red-700 text-white text-center",
         })
          setRowData([]);
        }
      })
      .catch((error) => {
        toast({
          title: "API Error",
          description: error.message,
          variant: "destructive",
        })
        setRowData([]);
      });
  };

  const handleDownloadExcel = () => {
    if (rowData.length === 0) {
      toast({
        title: "No data to download",
        variant: "destructive",
      });
      return;
    }
    downloadCSV(rowData, columnDefs, "R8 Outward Report");
  };

  // Clear form fields when type changes
  const handleTypeChange = (selectedOption) => {
    const newValue = selectedOption ? selectedOption.value : "";
    form.setValue("types", newValue);
    
    // Clear all other fields
    form.setValue("date", null);
    form.setValue("startDate", null);
    form.setValue("endDate", null);
    form.setValue("search", "");
    
    // Clear any existing data
    setRowData([]);
  };

  useEffect(() => {
    // Socket listeners for datewise reports
    const handleReportGenerated = (response) => {
      console.log("Report generated:", response);
      toast({
        title: "Report Generated Successfully",
        description: "The report has been sent to your email",
        className: "bg-green-600 text-white",
      });
    };

    const handleSocketError = (error) => {
      console.error("Socket error:", error);
      toast({
        title: "Report Generation Failed",
        description: error.toString(),
        variant: "destructive",
      });
    };

    socket.on("reportGenerated", handleReportGenerated);
    socket.on("errorMs", handleSocketError);

    // Cleanup
    return () => {
      socket.off("reportGenerated", handleReportGenerated);
      socket.off("errorMs", handleSocketError);
    };
  }, []);

  const columnDefs = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Date & Time",
      field: "DATETIME",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Pickslip No",
      field: "PICKSLIP_NO",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 180,
    },
    {
      headerName: "SO ID",
      field: "SO_ID",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 150,
    },
    {
      headerName: "Shipment ID",
      field: "SHIPMENT_ID",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 150,
    },
    {
      headerName: "Customer",
      field: "CUSTOMER",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      
      minWidth: 220,
      flex: 1,
    },
    {
      headerName: "Part Code",
      field: "PARTCODE",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 160,
    },
    {
      headerName: "Part Name",
      field: "PART_NAME",
      filter: "agTextColumnFilter",
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: "Description",
      field: "DESCRIPTION",
      filter: "agTextColumnFilter",
      width: 250,
      minWidth: 200,
    },
    {
      headerName: "Quantity",
      field: "QUANTITY",
      filter: "agNumberColumnFilter",
      width: 120,
    },
    {
      headerName: "Location Out",
      field: "LOCATION_OUT",
      filter: "agTextColumnFilter",
      width: 140,
    },
    {
      headerName: "Cost Center",
      field: "COST_CENTER",
      filter: "agTextColumnFilter",
      width: 160,
    },
    {
      headerName: "Prepared By",
      field: "PREPARED_BY",
      filter: "agTextColumnFilter",
      width: 150,
    },
  ];

  const type = [
    { label: "Date Wise", value: "datewise" },
    { label: "Date Range", value: "daterange" },
    { label: "Customer Wise", value: "customerwise" },
    { label: "Outward Wise", value: "outwardwise" },
  ];

  return (
    <Wrapper className="h-[calc(100vh-100px)] flex flex-col">
      {/* Filter Section */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Form {...form}>
            <form className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="types"
                render={({ field }) => (
                  <FormItem className="w-[200px] m-0">
                    <FormControl>
                      <Select
                        styles={customStyles}
                        components={{ DropdownIndicator }}
                        placeholder="Select Search Type"
                        className="border-0 basic-single"
                        classNamePrefix="select border-0"
                        isDisabled={false}
                        isClearable={true}
                        isSearchable={true}
                        options={type}
                        value={type.find(option => option.value === field.value) || null}
                        onChange={handleTypeChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {theType === "datewise" && (
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="w-[300px] m-0">
                      <FormControl>
                        <Space direction="vertical" size={12} className="w-full">
                          <DatePicker
                            className="border shadow-sm border-gray-300 py-[7px] hover:border-gray-400 w-full"
                            placeholder="Select Date (Up to this date)"
                            value={field.value ? moment(field.value) : null}
                            onChange={(value) =>
                              field.onChange(value ? value.toDate() : null)
                            }
                            format={dateFormat}
                          />
                        </Space>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {theType === "daterange" && (
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="w-[150px] m-0">
                        <FormControl>
                          <Space direction="vertical" size={12} className="w-full">
                            <DatePicker
                              className="border shadow-sm border-gray-300 py-[7px] hover:border-gray-400 w-full"
                              placeholder="Start Date"
                              value={field.value ? moment(field.value) : null}
                              onChange={(value) =>
                                field.onChange(value ? value.toDate() : null)
                              }
                              format={dateFormat}
                            />
                          </Space>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="w-[150px] m-0">
                        <FormControl>
                          <Space direction="vertical" size={12} className="w-full">
                            <DatePicker
                              className="border shadow-sm border-gray-300 py-[7px] hover:border-gray-400 w-full"
                              placeholder="End Date"
                              value={field.value ? moment(field.value) : null}
                              onChange={(value) =>
                                field.onChange(value ? value.toDate() : null)
                              }
                              format={dateFormat}
                            />
                          </Space>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {(theType === "customerwise" || theType === "outwardwise") && (
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem className="w-[300px] m-0">
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder={
                            theType === "customerwise"
                              ? "Enter Customer Code/Name"
                              : "Enter Pickslip/Transaction ID"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={fetchQueryResults}
                  disabled={!theType}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {theType === "datewise" ? "Generate Report" : "Search"}
                </Button>
                <Button
                  type="button"
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={rowData.length === 0}
                  onClick={handleDownloadExcel}
                >
                  <IoMdDownload size={20} />
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Info text */}
        <div className="text-sm text-gray-600">
          {theType === "datewise" && "Select date to generate report (up to this date) - Will be sent via email"}
          {theType === "daterange" && "Select date range to search between two dates"}
          {theType === "customerwise" && "Search by customer code or name"}
          {theType === "outwardwise" && "Search by transaction/pickslip ID"}
          {!theType && "Select a search type to begin"}
        </div>
      </div>

      {/* Grid Section */}
      <div className="ag-theme-quartz flex-1">
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={15}
          paginationAutoPageSize={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          enableCellTextSelection={true}
        />
      </div>
    </Wrapper>
  );
};

export default R8;

const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;