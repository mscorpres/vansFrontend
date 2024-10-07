import React from "react";
import { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { InputStyle } from "@/constants/themeContants";

import styled from "styled-components";
import { Form } from "antd";
import { Input } from "@/components/ui/input";

import useApi from "@/hooks/useApi";
import {
  componentMapList,
  saveComponentMap,
} from "@/components/shared/Api/masterApi";
import { transformOptionData } from "@/helper/transform";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";

import { toast } from "@/components/ui/use-toast";
const ComponentMap = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);

  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const fetchComponentMap = async () => {
    const response = await execFun(() => componentMapList(), "fetch");
    console.log("response", response);
    if (response.status === 200) {
      let arr = response.data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
      console.log("arr", arr);
    }
  };
  const createEntry = async () => {
    const values = await form.validateFields();
    console.log("values", values);
    let payload = {
      comp: values.partName.value,
      vendor: values.vendorName.value,
      vendor_part_code: "--",
      vendor_comp: values.vendorPartName,
    };
    // return;
    const response = await execFun(() => saveComponentMap(payload), "fetch");
    if (response.status == "success") {
      toast({
        title: response.message,
        className: "bg-green-600 text-white items-center",
      });
      fetchComponentMap();
    }
    toast({
      title: response.message.msg || "Failed to Create Product",
      className: "bg-red-600 text-white items-center",
    });
  };
  useEffect(() => {
    fetchComponentMap();
  }, []);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[450px_1fr]">
      <div className="bg-[#fff]">
        <Form form={form} layout="vertical">
          {/* <form
            onSubmit={form.handleSubmit(createEntry)}
            className="space-y-6 overflow-hidden p-[10px] h-[500px]"
          > */}
          <div className="grid grid-cols-2 gap-[40px] mt-[30px] ">
            <div className="">
              <Form.Item name="partName" label="Part Name">
                <ReusableAsyncSelect
                  placeholder="Part Name"
                  endpoint="/backend/getComponentByNameAndNo"
                  transform={transformOptionData}
                  // onChange={(e) => log}
                  // value={selectedCustomer}
                  fetchOptionWith="payload"
                />
              </Form.Item>
            </div>

            <Form.Item name="vendorName" label="Vendor Name">
              <ReusableAsyncSelect
                placeholder="Part Name"
                endpoint="/backend/vendorList"
                transform={transformOptionData}
                // onChange={(e) => form.setFieldValue("vendorName", e)}
                // value={selectedCustomer}
                fetchOptionWith="payload"
              />
            </Form.Item>
          </div>
          <div className="">
            <Form.Item name="vendorPartName" label="Vendor Part Name">
              <Input
                className={InputStyle}
                placeholder="Enter Vendor Part Name"
                // {...field}
              />
            </Form.Item>
          </div>

          <Button
            type="submit"
            className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
            onClick={() => createEntry()}
          >
            Submit
          </Button>
          {/* </form> */}
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

export default ComponentMap;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
const columnDefs: ColDef<rowData>[] = [
  { headerName: "ID", field: "id", filter: "agNumberColumnFilter", width: 90 },
  {
    headerName: "Part Code",
    field: "part_no",
    filter: "agTextColumnFilter",
    width: 120,
  },
  {
    headerName: "Part Name",
    field: "name",
    filter: "agTextColumnFilter",
    width: 250,
  },
  {
    headerName: "Vendor Code",
    field: "vendor",
    filter: "agTextColumnFilter",
    width: 150,
  },
  {
    headerName: "Vendor Name",
    field: "vendor_name",
    filter: "agTextColumnFilter",
    width: 250,
  },
  {
    headerName: "Vendor Part Name",
    field: "vendor_part_no",
    filter: "agTextColumnFilter",
    width: 250,
  },
];
