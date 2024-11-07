import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { InputStyle } from "@/constants/themeContants";

import styled from "styled-components";
import { Form } from "antd";
import { Input } from "@/components/ui/input";

import useApi from "@/hooks/useApi";
import {
  componentMapListCustomers,
  saveMapCustomer,
} from "@/components/shared/Api/masterApi";
import { transformOptionData } from "@/helper/transform";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";

import { toast } from "@/components/ui/use-toast";
import { Filter } from "lucide-react";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { RowData } from "@/data";
const CustomerComponent = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);

  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const fetchComponentMap = async () => {
    const response = await execFun(() => componentMapListCustomers(), "fetch");
    if (response.status === 200) {
      let arr = response.data.data.map((r: any, index: number) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
    }
  };
  const createEntry = async () => {
    const values = await form.validateFields();
    let payload = {
      comp: values.partName?.value,
      customer: values.vendorName?.value,
      customer_comp: values.vendorPartName,
      customer_part_code: values.vendorPartCode,
      description: values.desc,
    };

    // return;
    const response = await execFun(() => saveMapCustomer(payload), "fetch");

    let { data } = response;
    if (response.data.code == 200) {
      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });
      fetchComponentMap();
      form.resetFields({
        partName: "",
        vendorName: "",
        vendorPartName: "",
      });
    } else {
      toast({
        title: data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  useEffect(() => {
    fetchComponentMap();
  }, []);

  return (
    <Wrapper className="h-[calc(100vh-50px)] grid grid-cols-[450px_1fr]  overflow-hidden">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <Form
          form={form}
          layout="vertical"
          className="space-y-6 overflow-hidden p-[10px] h-[500px]"
        >
          {/* <form
            onSubmit={form.handleSubmit(createEntry)}
            className="space-y-6 overflow-hidden p-[10px] h-[500px]"
          > */}
          <div className="grid grid-cols-2 gap-[40px] ">
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

            <Form.Item name="vendorName" label="Customer Name">
              <ReusableAsyncSelect
                placeholder="Vendor Name"
                endpoint="/others/customerList"
                transform={transformOptionData}
                // onChange={(e) => form.setFieldValue("vendorName", e)}
                // value={selectedCustomer}
                fetchOptionWith="payload"
              />
            </Form.Item>
          </div>
          <div className="">
            <Form.Item name="vendorPartCode" label="Customer Part Code">
              <Input
                className={InputStyle}
                placeholder="Enter Vendor Part Name"
                // {...field}
              />
            </Form.Item>
          </div>
          <div className="">
            <Form.Item name="vendorPartName" label="Customer Part Name">
              <Input
                className={InputStyle}
                placeholder="Enter Vendor Part Name"
                // {...field}
              />
            </Form.Item>
            <Form.Item name="desc" label="Description">
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
      <div className="ag-theme-quartz">
        {loading1("fetch") && <FullPageLoading />}
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

export default CustomerComponent;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
const columnDefs: ColDef<RowData>[] = [
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
    headerName: "Code",
    field: "cust",
    filter: "agTextColumnFilter",
    width: 150,
  },
  {
    headerName: " Name",
    field: "cust_name",
    filter: "agTextColumnFilter",
    width: 250,
  },
  {
    headerName: "Part Number",
    field: "cust_part_no",
    filter: "agTextColumnFilter",
    width: 250,
  },
  {
    headerName: "Description",
    field: "c_desc",
    filter: "agTextColumnFilter",
    width: 250,
  },
];
