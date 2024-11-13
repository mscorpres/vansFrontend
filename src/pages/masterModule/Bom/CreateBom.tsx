import {  useEffect, useState } from "react";;
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { MoreOutlined } from "@ant-design/icons";
import {
  InputStyle,
} from "@/constants/themeContants";
import {  Filter,  } from "lucide-react";
import styled from "styled-components";
import {  Divider, Dropdown, Menu, Form } from "antd";
import { Input } from "@/components/ui/input";

import Select from "react-select";

import useApi from "@/hooks/useApi";
import { fetchBomTypeWise } from "@/components/shared/Api/masterApi";
import ViewBom from "./ViewBom";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { useNavigate } from "react-router-dom";
import { RowData } from "@/data";
import { ColDef } from "ag-grid-community";
const FormSchema = z.object({
  wise: z.string(),
});

const CreateBom = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [openView, setSheetOpenView] = useState([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState([]);
  const [form] = Form.useForm();
  const theSku = Form.useWatch("product");

  const { execFun, loading: loading1 } = useApi();

  const fetchBOMList = async (formData: z.infer<typeof FormSchema>) => {
    // const { wise } = formData;
    // console.log("fetchBOMList", formData);
    // return;
    const values = await form.validateFields();

    let wise = values.wise.value;
    const response = await execFun(() => fetchBomTypeWise(wise), "fetch");
    // return;
    let { data } = response;
    if (response.status === 200) {
      let arr = data.response.data.map((r: any, index: any) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
      //   addToast(response.message, {
      //     appearance: "success",
      //     autoDismiss: true,
      //   });
    } else {
      //   addToast(response.message, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
    }
  };
  const createBOM = async () => {
    // const { wise } = formData;
    // console.log("fetchBOMList", formData);
    // return;
    const values = await form.validateFields();

    let wise = values.wise.value;
    const response = await execFun(() => fetchBomTypeWise(wise), "fetch");
    // return;
    let { data } = response;
    if (response.status === 200) {
      let arr = data.response.data.map((r: any, index: any) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
      //   addToast(response.message, {
      //     appearance: "success",
      //     autoDismiss: true,
      //   });
    } else {
      //   addToast(response.message, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
    }
  };
  const sfgType = [
    {
      label: "Yes",
      value: "yes",
    },
    {
      label: "No",
      value: "no",
    },
  ];
  const type = [
    {
      label: "FG",
      value: "FG",
    },
    {
      label: "SGF",
      value: "SGF",
    },
  ];
  useEffect(() => {
    fetchBOMList();
  }, []);
  const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
    const menu = (
      <Menu>
        <Menu.Item
          key="View"
          onClick={() => {
            setSheetOpenView(row.data?.subject_id);
          }}
        >
          View
        </Menu.Item>
        <Menu.Item
          key="Edit"
          onClick={() => {
            setSheetOpenEdit(row.data?.subject_id);
          }}
        >
          Edit
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        <Dropdown overlay={menu} trigger={["click"]}>
          {/* <Button icon={<Badge />} /> */}
          <MoreOutlined />
        </Dropdown>
      </>
    );
  };
  useEffect(() => {
    if (sheetOpenEdit.length) {
      window.open(`/master/bom/edit/${sheetOpenEdit}`, "_blank");
    }
  }, [sheetOpenEdit]);

  const columnDefs: ColDef<rowData>[] = [
    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      cellRenderer: (params: any) => <ActionMenu row={params} />,
      // cellRenderer: (params: any) => {
      // return (
      //     <div className="flex gap-[5px] items-center justify-center h-full">
      //       <Button
      //         onClick={() => {
      //           setSheetOpenView(params.data?.subject_id);
      //         }}
      //         className="rounded h-[25px] w-[25px] felx justify-center items-center p-0 bg-cyan-500 hover:bg-cyan-600"
      //       >
      //         <EyeIcon className="h-[15px] w-[15px] text-white" />
      //       </Button>
      //       {/* <Button className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600"> */}
      //       <Edit2
      //         className="h-[20px] w-[20px] text-cyan-700 "
      //         onClick={() => {
      //           setSheetOpenEdit(params.data?.subject_id);
      //         }}
      //       />
      //       {/* </Button> */}
      //     </div>
      //   );
      // },
    },
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 70,
    },
    {
      headerName: "BOM Name & SKU",
      field: "bom_product_sku",
      filter: "agTextColumnFilter",
      width: 200,
    },
    {
      headerName: "Customer",
      field: "client_name",
      filter: "agTextColumnFilter",
      width: 300,
    },
    {
      headerName: "Customer Code",
      field: "client_code",
      filter: "agTextColumnFilter",
      width: 190,
    },
  ];


  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] overflow-hidden">
      <div className="bg-[#fff]">
        {loading1("fetch") && <FullPageLoading />}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form form={form}>
          <form
            // onSubmit={form.handleSubmit(fetchBOMList)}
            className="space-y-6 overflow-hidden p-[10px] h-[170px]"
          >
            <Form.Item className="w-full" name="wise">
              <Select
                styles={customStyles}
                components={{ DropdownIndicator }}
                placeholder="Select Type"
                className="border-0 basic-single"
                classNamePrefix="select border-0"
                isDisabled={false}
                isClearable={true}
                isSearchable={true}
                options={type}
                // onChange={(e: any) => form.setFieldValue("wise", e)}
              />
            </Form.Item>

            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              onClick={(e) => {
                e.preventDefault();
                fetchBOMList();
              }}
            >
              Search
            </Button>
          </form>
        </Form>
        <Divider />
        <Form form={form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px] h-[300px]"
          >
            {" "}
            <div className="">
              <Form.Item name="bom">
                <Input
                  className={InputStyle}
                  placeholder="Enter BOM"
                  // {...field}
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <div className="">
                <Form.Item name="sku">
                  <Input
                    className={InputStyle}
                    placeholder="Enter SKU"
                    // {...field}
                  />
                </Form.Item>
                {/* )}
                /> */}
              </div>
              <div className="">
                <Form.Item name="product">
                  <Select
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    placeholder=" Enter SKU"
                    className="border-0 basic-single"
                    classNamePrefix="select border-0"
                    isDisabled={false}
                    isClearable={true}
                    isSearchable={true}
                    options={sfgType}
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
                  {/* </FormControl> */}
                  {/* <FormMessage /> */}
                </Form.Item>
                {/* )}
                /> */}
              </div>{" "}
            </div>
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              onClick={(e) => {
                e.preventDefault();
                createBOM();
              }}
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
      {/* {sheetOpenEdit && (
        <EditBom
          sheetOpenEdit={sheetOpenEdit}
          setSheetOpenEdit={setSheetOpenEdit}
        />
      )} */}
      {openView && (
        <ViewBom openView={openView} setSheetOpenView={setSheetOpenView} />
      )}
    </Wrapper>
  );
};

export default CreateBom;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
