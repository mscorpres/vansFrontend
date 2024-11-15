import { useEffect, useState } from "react";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { InputStyle } from "@/constants/themeContants";
import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import { Input } from "@/components/ui/input";

import Select from "react-select";

import useApi from "@/hooks/useApi";
import {
  fetchLocationList,
  getParentLocationOptions,
  insertLoations,
} from "@/components/shared/Api/masterApi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { Form } from "antd";
import { toast } from "@/components/ui/use-toast";
import { RowData } from "@/data";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
const Locations = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [form] = Form.useForm();

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
    if (response.status === 200) {
      let a = customFlatArray(data.data);
      let arr = a.map((r: any, id: any) => {
        return { id: id + 1, ...r };
      });
      setRowData(arr);
      //   addToast(response.message, {
      //     appearance: "success",
      //     autoDismiss: true,
      //   });
    }
  };
  const fetchGroupOptionslist = async () => {
    const response = await execFun(() => getParentLocationOptions(), "fetch");
    if (response.status == 200) {
      let { data } = response;
      //   let arr = convertSelectOptions(data);
      //
      let arr = data?.map((r: any, index: any) => {
        return {
          label: r.text,
          value: r.id,
        };
      });

      setAsyncOptions(arr);
    }
  };
  const handleSubmit = async () => {
    const values = await form.validateFields();
    let payload = {
      location_address: values.address,
      location_name: values.location,
      location_type: values.locationType.value,
      location_under: values.locationUnder.value,
    };

    const response = await execFun(() => insertLoations(payload), "fetch");
    let { data } = response;
    if (data.code == 200) {
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
        title: data.message.msg,
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
        <Form form={form}>
          <form
            // onSubmit={form.handleSubmit(onsubmit)}
            className="space-y-6 overflow-hidden p-[10px] h-[450px]"
          >
            {" "}
            <div className="">
              <Form.Item
                name="location"
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
                {/* )}
                /> */}
              </div>
            </div>
            <div className="">
              <Form.Item
                name="address"
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
        />
      </div>{" "}
      <ConfirmationModal
        open={showConfirmation}
        onClose={setShowConfirmation}
        onOkay={handleSubmit}
        title="Confirm Submit!"
        description="Are you sure to submit the entry?"
      />
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
