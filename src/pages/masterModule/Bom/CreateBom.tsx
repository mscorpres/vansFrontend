import { useEffect, useState } from "react";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { MoreOutlined } from "@ant-design/icons";
import { Filter } from "lucide-react";
import styled from "styled-components";
import {  Dropdown, Menu, Form } from "antd";

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
  const [openView, setSheetOpenView] = useState<any>([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState([]);
  const [form] = Form.useForm();
  const theSku = Form.useWatch("product");

  const { execFun, loading: loading1 } = useApi();

  const fetchBOMList = async (formData: z.infer<typeof FormSchema>) => {
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
    } else {
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
      headerName: "Action",
      width: 120,
      cellRenderer: (params: any) => <ActionMenu row={params} />,
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
      width: 350,
    },
    {
      headerName: "Customer",
      field: "client_name",
      filter: "agTextColumnFilter",
      width: 350,
    },
    {
      headerName: "Customer Code",
      field: "client_code",
      filter: "agTextColumnFilter",
      width: 250,
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
