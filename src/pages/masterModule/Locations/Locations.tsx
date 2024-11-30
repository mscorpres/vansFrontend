import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { InputStyle } from "@/constants/themeContants";
import {  Filter } from "lucide-react";
import styled from "styled-components";
import { Input } from "@/components/ui/input";

import Select from "react-select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import useApi from "@/hooks/useApi";
import {
  fetchLocationList,
  getParentLocationOptions,
  insertLoations,
} from "@/components/shared/Api/masterApi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { Form, Row } from "antd";
import { toast } from "@/components/ui/use-toast";
import { RowData } from "@/data";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
const Locations = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [form] = Form.useForm();
  const [resetModel, setResetModel] = useState(false);

  const { execFun, loading: loading1 } = useApi();
  let arr: any = [];
  const customFlatArray = (array: any, prev: any) => {
    array?.map((row: any) => {
      let parent = "--";
      let obj = row;
      if (!row.children) {
        if (prev) {
          obj["parentLocation"] = prev.name;
        } else {
          obj["parentLocation"] = "--";
        }
      }
      if (row.children) {
        if (prev) {
          obj["parentLocation"] = prev.name;
        } else {
          obj["parentLocation"] = "--";
        }
        let children = row.children;

        delete obj["children"];
        arr = [...arr, obj];
        customFlatArray(children, obj);
        arr = [...arr, ...children];
        // }
      }
      //  else {
      //   let obj = row;

      //   if (prev) {
      //     obj["parentLocation"] = prev.name;
      //   } else {
      //     obj["parentLocation"] = "--";
      //   }
      //   arr = [...arr, obj];
      // }
    });

    return arr;
  };
  const fetchGrouplist = async () => {
    const response = await execFun(() => fetchLocationList(), "fetch");
    let { data } = response;

    if (data.success) {
      let a = customFlatArray(data.data);
      let arr = a.map((r: any, id: any) => {
        return { id: id + 1, ...r };
      });
      setRowData(arr);
     
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const fetchGroupOptionslist = async () => {
    const response = await execFun(() => getParentLocationOptions(), "fetch");
    let { data } = response;

    if (data.success) {

      //   let arr = convertSelectOptions(data);
      //
      let arr = data?.data?.map((r: any) => {
        return {
          label: r.text,
          value: r.id,
        };
      });

      setAsyncOptions(arr);
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const handleSubmit = async () => {
    setShowConfirmation(false);
    const values = await form.validateFields();
    let payload = {
      location_address: values.address,
      location_name: values.location,
      location_type: values.locationType.value,
      location_under: values.locationUnder.value,
    };

    const response = await execFun(() => insertLoations(payload), "fetch");
    let { data } = response;
    if (data.success) {
      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });
      fetchGroupOptionslist();
      fetchGrouplist();
      form.resetFields();
      setShowConfirmation(false);
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  useEffect(() => {
    fetchGroupOptionslist();
    fetchGrouplist();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Locations Name",
      field: "name",
      filter: "agTextColumnFilter",
      width: 320,
    },
    {
      headerName: "Parent Location",
      field: "parentLocation",
      filter: "agTextColumnFilter",
      width: 320,
    },
  ];
  const locType = [
    {
      label: "Loaction Type",
      value: "yes",
    },
    {
      label: "Storage",
      value: "no",
    },
    {
      label: "Non Storage",
      value: "non",
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-50px)] grid grid-cols-[550px_1fr]">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <Form form={form} layout="vertical">
          <form
            // onSubmit={form.handleSubmit(onsubmit)}
            className="space-y-6 overflow-hidden p-[10px] h-[550px]"
          >
            {" "}
            <div className="">
              <Form.Item
                name="location"
                label="Location Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter location!",
                  },
                ]}
              >
                <Input
                  className={InputStyle}
                  placeholder="Enter Locations Name"
                />
              </Form.Item>
            </div>{" "}
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <div className="">
                <Form.Item
                  name="locationUnder"
                  label="Parent Location"
                  rules={[
                    {
                      required: true,
                      message: "Please enter parent Location!",
                    },
                  ]}
                >
                  <Select
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    placeholder=" Enter Location"
                    className="border-0 basic-single"
                    classNamePrefix="select border-0"
                    isDisabled={false}
                    isClearable={true}
                    isSearchable={true}
                    options={asyncOptions}
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
                </Form.Item>
              </div>
              <div className="">
                <Form.Item
                  label="Location Type"
                  name="locationType"
                  rules={[
                    {
                      required: true,
                      message: "Please enter location Type!",
                    },
                  ]}
                >
                  <Select
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    placeholder=" Enter Type"
                    className="border-0 basic-single"
                    classNamePrefix="select border-0"
                    isDisabled={false}
                    isClearable={true}
                    isSearchable={true}
                    options={locType}
                  />
                </Form.Item>
                {/* )}
                /> */}
              </div>
            </div>
            <div className="">
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  {
                    required: true,
                    message: "Please enter address!",
                  },
                ]}
              >
                <Input
                  className={InputStyle}
                  placeholder="Enter Address"
                  // {...field}
                />
              </Form.Item>
            </div>{" "}
            <Row justify="space-between">
              <Button
                type="reset"
                className="shadow bg-red-700 hover:bg-red-600 shadow-slate-500"
                onClick={() => setResetModel(true)}
              >
                Reset
              </Button>
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  setShowConfirmation(true);
                }}
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              >
                Submit
              </Button>
            </Row>
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-50px)]">
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
      </div>{" "}
      <ConfirmationModal
        open={showConfirmation}
        onClose={setShowConfirmation}
        onOkay={handleSubmit}
        title="Confirm Submit!"
        description="Are you sure to submit the entry?"
      />{" "}
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

export default Locations;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
