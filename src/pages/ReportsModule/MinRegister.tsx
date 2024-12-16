import React, { useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";

import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Divider, Space, Form } from "antd";
import {
  transformCustomerData,
  transformOptionData,
  transformPlaceData,
} from "@/helper/transform";
import Select from "react-select";

import useApi from "@/hooks/useApi";

import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { fetchListOfMINRegister } from "@/components/shared/Api/masterApi";
import { exportDateRangespace } from "@/components/shared/Options";
import { IoMdDownload } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { rangePresets } from "@/General";
import { Button } from "@mui/material";

const MinRegister = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [form] = Form.useForm();

  const theWise = Form.useWatch("types", form);
  const { execFun, loading: loading1 } = useApi();
  //   const { addToast } = useToastContainer()
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY/MM/DD";

  const fetchQueryResults = async () => {
    let value = await form.validateFields();
    // let { date, search } = formData;

    let dataString = "";
    if (value?.data) {
      dataString = exportDateRangespace(value.data);
    } else {
      dataString = value.search;
    }
    let payload = {
      min_types: value.types.value,
      data: dataString,
    };
    const response = await execFun(
      () => fetchListOfMINRegister(payload),
      "fetch"
    );
    setRowData([]);
    let { data } = response;
    if (data.success) {
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
  useEffect(() => {
    // fetchComponentList();
  }, []);
  // useEffect(() => {
  //   // fetchComponentList();
  //   form.setFieldValue("search", "");
  //   form.setFieldValue("date", "");
  // }, [theWise]);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Date & Time",
      field: "DATE",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Transaction Type",
      field: "TYPE",
      filter: "agTextColumnFilter",
      width: 200,
    },
    {
      headerName: "Part No.",
      field: "PART",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Component",
      field: "COMPONENT",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 280,
    },
    {
      headerName: "Decription",
      field: "Decription",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 250,
    },
    {
      headerName: "In Box",
      field: "LOCATION",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Rate",
      field: "RATE",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Exchange Rate",
      field: "EXCHANGE_RATE",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Currency",
      field: "CURRENCY",
      filter: "agTextColumnFilter",
      width: 120,
    },
    {
      headerName: "Currency Code",
      field: "CURRENCYSYMBOL",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "In Qty",
      field: "INQTY",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Amount LC",
      field: "AMOUNT_LC",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Amount FC",
      field: "AMOUNT_FC",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "UoM",
      field: "UNIT",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Vendor Code",
      field: "VENDOR_CODE",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 150,
    },
    {
      headerName: "Vendor Name",
      field: "VENDOR_NAME",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 300,
    },
    {
      headerName: "Vendor Branch",
      field: "VENDOR_BRANCH",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Invoice Id",
      field: "INVOIVENUMBER",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 220,
    },
    {
      headerName: "TXT ID",
      field: "TRANSACTION",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 200,
    },
    {
      headerName: "PO No.",
      field: "PONUMBER",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 220,
    },
    {
      headerName: "PO Date",
      field: "DATE",
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
      headerName: "In By",
      field: "ISSUEBY",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Remark",
      field: "COMMENT",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 250,
    },
  ];
  const type = [
    {
      label: "All MIN(s)",
      value: "MIN",
    },
    {
      label: "Markup-MIN(s)",
      value: "MARKUP",
    },
    {
      label: "Pending-Markup",
      value: "NONMARKUP",
    },
    {
      label: "PO MIN(s)",
      value: "POMIN",
    },
  ];
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "MIN Register");
  };
  useEffect(() => {
    if (theWise) {
      form.setFieldValue("date", []);
      // form.setValue("date", "");
    }
  }, [theWise]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      <div className="bg-[#fff]">
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form form={form} layout="vertical" className="p-[10px]">
          {/* <form
            onSubmit={form.handleSubmit(fetchQueryResults)}
            className="space-y-6 overflow-hidden p-[10px] h-[470px]"
          > */}
          {/* <FormField
              control={form.control}
              render={({ field }) => ( */}
          <Form.Item className="w-full" name="types">
            {/* <FormControl> */}
            <Select
              styles={customStyles}
              components={{ DropdownIndicator }}
              placeholder=" Enter Type"
              className="border-0 basic-single z-5"
              classNamePrefix="select border-0"
              isDisabled={false}
              isClearable={true}
              isSearchable={true}
              options={type}
              // onChange={(e: any) => form.setFieldValue("types", e.value)}
            />
            {/* </FormControl> */}
            {/* <FormMessage /> */}
          </Form.Item>
          {/* )}
            /> */}
          {theWise == "POMIN" ? (
            <Form.Item name="search">
              <ReusableAsyncSelect
                // placeholder="State"
                endpoint="/backend/searchPoByPoNo"
                transform={transformOptionData}
                fetchOptionWith="search"
                onChange={(e: any) => form.setFieldValue("search", e.value)}
              />
            </Form.Item>
          ) : (
            <Form.Item className="w-full" name="data">
              <Space direction="vertical" size={12} className="w-full">
                <RangePicker
                  className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                  // onChange={(e: any) => form.setFieldValue("data", e?.value)}
                  onChange={(value) =>
                    form.setFieldValue(
                      "data",
                      value ? value.map((date) => date!.toDate()) : []
                    )
                  }
                  format={"DD/MM/YYYY"}
                  presets={rangePresets}
                />
              </Space>
            </Form.Item>
          )}
          {/* )} */}
          <div className="flex gap-[10px] justify-end  px-[5px]">
            <Button
              // type="submit"
              className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey"
              // onClick={() => {}}
              disabled={rowData.length === 0}
              onClick={(e: any) => {
                e.preventDefault();
                handleDownloadExcel();
              }}
            >
              <IoMdDownload size={20} />
            </Button>
            <Button
              variant="contained"
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              onClick={() => {
                fetchQueryResults();
              }}
            >
              Search
            </Button>
          </div>
          {/* </form> */}
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)] relative">
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
    </Wrapper>
  );
};

export default MinRegister;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
