import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { InputStyle } from "@/constants/themeContants";

import styled from "styled-components";
import { Form, Row } from "antd";
import { Input } from "@/components/ui/input";

import useApi from "@/hooks/useApi";
import {
  componentMapListCustomers,
  saveMapCustomer,
} from "@/components/shared/Api/masterApi";
import { transformOptionData } from "@/helper/transform";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";

import { toast } from "@/components/ui/use-toast";
import { Edit2, Filter } from "lucide-react";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { RowData } from "@/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import UpdateCustomerModal from "@/pages/masterModule/ComponentMap/UpdateCustomerModal";
const CustomerComponent = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [resetModel, setResetModel] = useState(false);
  const [openModal , setOpenModal] = useState(false);
  const [data , setData] = useState({})
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const fetchComponentMap = async () => {
    const response = await execFun(() => componentMapListCustomers(), "fetch");
    let { data } = response;
    if (data.success) {
      let arr = response.data.data.map((r: any, index: number) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
    } else {
      toast({
        title: data?.message,
        className: "bg-green-600 text-white items-center",
      });
    }
  };
  const createEntry = async () => {
    setOpen(false);

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
    if (data.success) {
      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });
      fetchComponentMap();
      form.resetFields();
      form.resetFields({
        partName: "",
        vendorName: "",
        vendorPartName: "",
      });
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  useEffect(() => {
    fetchComponentMap();
  }, []);

  const columnDefs: ColDef<RowData>[] = [
    { 
      headerName: "Action", 
      field: "action", 
      width: 100,
      cellRenderer: (params: any) => (
        <Button
          className="bg-transparent text-slate-600 hover:bg-[#f5f5f5]"
          onClick={() => {setData(params.node.data);setOpenModal(true)}}
          aria-label="Edit"
        >
          <Edit2 className="h-[20px] w-[20px]"/>
        </Button>
      ),
      sortable: false, // Optionally disable sorting for Action column
      filter: false, // Optionally disable filtering for Action column
    },
    { headerName: "ID", field: "id", filter: "agNumberColumnFilter", width: 90 },
    {
      headerName: "Part Code",
      field: "part_no",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 120,
    },
    {
      headerName: "Part Name",
      field: "name",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 250,
    },
    {
      headerName: "Code",
      field: "cust",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 150,
    },
    {
      headerName: " Name",
      field: "cust_name",
      filter: "agTextColumnFilter",
      width: 250,
    },
    {
      headerName: "Customer Part Code",
      field: "cust_comp",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 250,
    },
    {
      headerName: "Customer Part Number",
      field: "cust_part_no",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 250,
    },
    {
      headerName: "Description",
      field: "c_desc",
      filter: "agTextColumnFilter",
      width: 250,
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[450px_1fr]  overflow-hidden">
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
                  fetchOptionWith="query2"
                />
              </Form.Item>
            </div>

            <Form.Item name="vendorName" label="Customer Name">
              <ReusableAsyncSelect
                placeholder="Customer Name"
                endpoint="/others/customerList"
                transform={transformOptionData}
                // onChange={(e) => form.setFieldValue("vendorName", e)}
                // value={selectedCustomer}
                fetchOptionWith="search"
              />
            </Form.Item>
          </div>
          <div className="">
            <Form.Item name="vendorPartCode" label="Customer Part Code">
              <Input
                className={InputStyle}
                placeholder="Enter Customer Part Code"
                // {...field}
              />
            </Form.Item>
          </div>
          <div className="">
            <Form.Item name="vendorPartName" label="Customer Part Name">
              <Input
                className={InputStyle}
                placeholder="Enter Customer Part Name"
                // {...field}
              />
            </Form.Item>
            <Form.Item name="desc" label="Description">
              <Input
                className={InputStyle}
                placeholder="Enter Description"
                // {...field}
              />
            </Form.Item>
          </div>
          <Row justify="space-between">
            <Button
              // type="reset"
              className="shadow bg-red-700 hover:bg-red-600 shadow-slate-500"
              onClick={(e: any) => {
                setResetModel(true);
                e.preventDefault();
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              onClick={() => setOpen(true)}
            >
              Submit
            </Button>{" "}
          </Row>
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
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
        />
      </div>
      <AlertDialog open={resetModel} onOpenChange={setResetModel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-600">
              Are you absolutely sure you want to reset the form?
            </AlertDialogTitle>
            {/* <AlertDialogDescription>Are you sure want to logout.</AlertDialogDescription> */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-700 shadow hover:bg-red-600 shadow-slate-500"
              onClick={() => form.resetFields()}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ConfirmationModal
        open={open}
        onClose={setOpen}
        onOkay={() => {
          createEntry();
        }}
        loading={loading1("fetch")}
        title="Confirm Submit!"
        description="Are you sure to submit the entry?"
      />
      <UpdateCustomerModal
      open={openModal}
      onClose={setOpenModal}
      data={data}
      />
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

