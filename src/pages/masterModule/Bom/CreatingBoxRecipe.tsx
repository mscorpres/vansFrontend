import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { MoreOutlined } from "@ant-design/icons";
import { InputStyle } from "@/constants/themeContants";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import { Filter, Plus } from "lucide-react";
import styled from "styled-components";
import { Dropdown, Menu, Form, Row } from "antd";
import { Input } from "@/components/ui/input";

import Select from "react-select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useApi from "@/hooks/useApi";
import {
  fetchPartCodeDetails,
  fetchProductBySku,
  insertBom,
} from "@/components/shared/Api/masterApi";
import ViewBom from "./ViewBom";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { RowData } from "@/data";
import { ColDef } from "ag-grid-community";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import { AppDispatch } from "@/store";
import { fetchComponentDetail } from "@/features/salesmodule/createSalesOrderSlice";
import { useDispatch } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
const FormSchema = z.object({
  wise: z.string(),
});

const CreatingBoxRecipe = () => {
  const [rowData, setRowData] = useState<RowData[]>([
    {
      material: "",
      orderQty: "",
      isNew: true,
    },
  ]);
  const [openView, setSheetOpenView] = useState<any>([]);
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [sheetOpenEdit, setSheetOpenEdit] = useState([]);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const thrproduct = Form.useWatch("product", form);
  const theSku = Form.useWatch("sku", form);
  const thepartCode = Form.useWatch("partCode", form);
  const dispatch = useDispatch<AppDispatch>();
  const [resetModel, setResetModel] = useState(false);
  const { execFun, loading: loading1 } = useApi();
  const addNewRow = () => {
    const newRow = {
      material: "",
      orderQty: "",
      isNew: true,
    };
    // setRowData((prevData) => [...prevData, newRow]);
    setRowData((prevData) => [
      ...(Array.isArray(prevData) ? prevData : []),
      newRow,
    ]);
  };

  const fetchingsku = async (theSku: any) => {
    const response = await execFun(() => fetchProductBySku(theSku), "fetch");

    // return;
    let { data } = response;
    if (response.data.code === 200) {
      let a = data.data[0].p_name;

      form.setFieldValue("productName", a);
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-700 text-center text-white",
      });
    }
  };

  const fetchingPartCodeDetails = async (thepartCode: any) => {
    const response = await execFun(
      () => fetchPartCodeDetails(thepartCode),
      "fetch"
    );

    // return;
    let { data } = response;
    if (response.data.code === 200) {
      let a = data.data[0].c_name;

      form.setFieldValue("partName", a);
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-700 text-center text-white",
      });
    }
  };
  const createBOM = async () => {
    const values = await form.validateFields();
    let payload = {
      bom_subject: values.bom,
      sku: values.sku,
      bom_recipe_type: values.product.value,
      mapped_sfg: values.partCode,
      bom_components: {
        component_key: rowData.map((r) => r.material),
        qty: rowData.map((r) => r.orderQty),
      },
    };

    const response = await execFun(() => insertBom(payload), "fetch");

    // return;
    let { data } = response;
    if (data.success) {
      toast({
        title: data.message,
        className: "bg-green-700 text-center text-white",
      });
      setRowData([]);
      form.resetFields();
    } else {
      toast({
        title: data.message,
        className: "bg-red-700 text-center text-white",
      });
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

  useEffect(() => {
    if (theSku) {
      fetchingsku(theSku);
    }
  }, [theSku]);
  useEffect(() => {
    if (thepartCode) {
      fetchingPartCodeDetails(thepartCode);
    }
  }, [thepartCode]);

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

  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          {...props}
          setRowData={setRowData}
          rowData={rowData}
          setSearch={handleSearch}
          search={search}
          onSearch={handleSearch}
          // vendorCode={selectedVendor}
          // currencyList={currencyList}
          // componentDetails={hsnlist}
        />
      ),
    }),
    []
  );

  const statusBar = useMemo<{
    statusPanels: StatusPanelDef[];
  }>(() => {
    return {
      statusPanels: [
        { statusPanel: "agFilteredRowCountComponent", align: "right" },
        { statusPanel: "agSelectedRowCountComponent", align: "right" },
        { statusPanel: "agAggregationComponent", align: "right" },
      ],
    };
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      floatingFilter: false,
      editable: false,
    };
  }, []);
  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "",
      valueGetter: "node.rowIndex + 1",
      cellRenderer: "textInputCellRenderer",
      maxWidth: 100,
      field: "delete",
    },
    {
      headerName: "Product Name",
      field: "material",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Qty",
      field: "orderQty",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
  ];
  useEffect(() => {
    if (sheetOpenEdit.length) {
      window.open(`/master/bom/edit/${sheetOpenEdit}`, "_blank");
    }
  }, [sheetOpenEdit]);
  const handleSearch = (searchKey: string, type: any, name: string) => {
    if (searchKey) {
      let p = { search: searchKey };

      dispatch(fetchComponentDetail(p));
    }
  };
  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] overflow-hidden">
      <div className="bg-[#fff]">
        {loading1("fetch") && <FullPageLoading />}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>

        <Form form={form} layout="vertical">
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px] h-[500px]"
          >
            {" "}
            <div className="">
              <Form.Item name="bom" label="BOM">
                <Input
                  className={InputStyle}
                  placeholder="Enter BOM"
                  // {...field}
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <div className="">
                <Form.Item name="sku" label="SKU">
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
                <Form.Item name="product" label="Product">
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
                  />
                </Form.Item>
                {/* )}
                /> */}
              </div>{" "}
            </div>{" "}
            <Form.Item name="productName" label="Product Name">
              <Input
                className={InputStyle}
                placeholder="Enter Product"
                disabled
                // {...field}
              />
            </Form.Item>
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <Form.Item name="partCode" label="Part Code">
                <Input
                  className={InputStyle}
                  placeholder="Enter Part Code"
                  // {...field}
                />
              </Form.Item>
              <Form.Item name="partName" label="Part Name">
                <Input
                  className={InputStyle}
                  placeholder="Enter Part Name"
                  disabled
                  // {...field}
                />
              </Form.Item>
            </div>
            <div className="">
              {/* )}
                /> */}
            </div>
            <Row justify="space-between">
              {" "}
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
                onClick={(e) => {
                  e.preventDefault();
                  createBOM();
                }}
              >
                Submit
              </Button>{" "}
            </Row>
          </form>
        </Form>
      </div>{" "}
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <div className="flex items-center w-full gap-[20px] h-[60px] px-[10px] justify-between bg-white">
          <Button
            onClick={() => {
              addNewRow();
            }}
            className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
          >
            <Plus className="font-[600]" /> Add Item
          </Button>{" "}
        </div>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs as (ColDef | ColGroupDef)[]}
          defaultColDef={defaultColDef}
          statusBar={statusBar}
          components={components}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
          gridOptions={commonAgGridConfig}
          suppressCellFocus={false}
          suppressRowClickSelection={false}
          rowSelection="multiple"
          checkboxSelection={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
        />
      </div>
      {openView && (
        <ViewBom openView={openView} setSheetOpenView={setSheetOpenView} />
      )}
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
    </Wrapper>
  );
};

export default CreatingBoxRecipe;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
