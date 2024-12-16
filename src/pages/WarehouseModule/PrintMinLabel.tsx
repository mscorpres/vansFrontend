import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

import Select from "react-select";
import styled from "styled-components";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { transformOptionData, transformOptionData2 } from "@/helper/transform";
import PrintIcon from "@mui/icons-material/Print";
import { useDispatch, useSelector } from "react-redux";
import { printsticker2, qrPrint } from "@/features/client/storeSlice";
import { spigenAxios } from "@/axiosIntercepter";
import { downloadFunction } from "@/components/shared/PrintFunctions";
import Print from "@/assets/Print.jpg";
// import p1 from "@/assets/p1.jpeg";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@mui/material";
import { Form } from "antd";
function PrintMinLabel() {
  const [form] = Form.useForm();
  const selMin = Form.useWatch("min", form);
  const selType = Form.useWatch("printType", form);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { loading } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();
  const types = [
    {
      value: "MIN",
      label: "MIN Wise",
    },
    {
      value: "label",
      label: "Label Box Wise",
    },
    {
      value: "Transfer",
      label: "Transfer MIN Label Box ",
    },
  ];
  const wise = [
    {
      value: "MIN",
      label: "MIN",
    },
    {
      value: "TRN",
      label: "TRN",
    },
  ];

  const getData = async (formData) => {
    const value = await form.getFieldValue("printType");
    const min = await form.getFieldValue("min");
    let response = await spigenAxios.get(
      `qrPrint/getminBox?type=MIN&min_no=${min.value}`,
      formData
    );

    if (response.data.success) {
      let { data } = response;
      let arr = data.data.map((r) => {
        return {
          label: r.loc_in,
          value: r.loc_in,
        };
      });
      setRowData(arr);
    }
  };
  const getDataBox = async (formData) => {
    let response = await spigenAxios.post(
      "/backend/getTransferminBox",
      formData
    );
  };
  const onsubmit = async () => {
    const value = await form.validateFields();
    let payload = {
      type: "MIN",
      min_no: selMin.value,
    };
    if (selType == "label" || selType.value == "label") {
      let payload = {
        type: "MIN",
        min_no: selMin.value,
        box: value.box.map((r) => r.value),
      };
      // return;

      dispatch(printsticker2(payload)).then((res) => {
        if (res.payload.success) {
          downloadFunction(
            res.payload.data.buffer.data,
            res.payload.data.filename
          );
        } else {
          toast({
            title: res.payload.message,
            className: "bg-red-600 text-white items-center",
          });
        }
      });
    } else {
      dispatch(qrPrint(payload)).then((res) => {
        if (res.payload.success) {
          downloadFunction(
            res.payload.data.buffer.data,
            res.payload.data.filename
          );
        } else {
          toast({
            title: res.payload.message,
            className: "bg-red-600 text-white items-center",
          });
        }
      });
    }
  };
  useEffect(() => {
    if (selMin) {
      form.setFieldValue("box", "");
    }
  }, [selMin]);
  useEffect(() => {
    if (selMin) {
      let payload = {
        type: "MIN",
        min_no: selMin.value,
      };
      // const formData = new FormData();
      // formData.append("type", "MIN");
      // formData.append("min_no", selMin.value);
      if (selType.value == "Transfer" || selType == "Transfer") {
        getDataBox(payload);
      } else {
        getData(payload);
      }
    }
  }, [selMin]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] overflow-hidden bg-white ">
      <div className="bg-[#fff]">
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <Form form={form} layout="vertical">
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px] h-[1000px]"
          >
            <div className="grid grid-cols-1 gap-[40px]">
              <Form.Item
                name="printType"
                label="Print Type"
                rules={[{ required: true }]}
              >
                <Select
                  styles={customStyles}
                  components={{ DropdownIndicator }}
                  placeholder="Print Type"
                  className="border-0 basic-single  mb-[-24px] z-20"
                  classNamePrefix="select border-0"
                  isDisabled={false}
                  isClearable={true}
                  isSearchable={true}
                  options={types}
                />
              </Form.Item>
              {selType == "Transfer" ||
              selType?.value == "Transfer" ||
              selType == "MIN" ||
              selType?.value == "MIN" ? (
                <Form.Item
                  name="min"
                  label="  MIN"
                  rules={[{ required: true }]}
                >
                  <ReusableAsyncSelect
                    // placeholder="Customer Name"
                    className="z-10"
                    placeholder="Search Transfer"
                    endpoint="/backend/getTrfMinsTransaction4Label"
                    transform={transformOptionData}
                    // onChange={(e) => form.setValue("customerName", e)}
                    // value={selectedCustomer}
                    fetchOptionWith="payloadSearchTerm"
                  />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    name="min"
                    label="  MIN"
                    rules={[{ required: true }]}
                  >
                    <ReusableAsyncSelect
                      placeholder="Search MIN"
                      endpoint="/backend/getMinsTransaction4Label"
                      transform={transformOptionData2}
                      // onChange={(e) => form.setValue("customerName", e)}
                      // value={selectedCustomer}
                      fetchOptionWith="query2"
                    />
                  </Form.Item>
                  <Form.Item
                    className="w-full"
                    name="box"
                    label="Boxes"
                    rules={[{ required: true }]}
                  >
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      placeholder="Select Boxes"
                      className="border-0 basic-single mb-[-24px]"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      isMulti={true}
                      options={rowData}
                    />
                  </Form.Item>
                </>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                variant="contained"
                type="submit"
                startIcon={<PrintIcon />}
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 text-white"
                onClick={(e: any) => {
                  e.preventDefault();
                  onsubmit();
                }}
              >
                Print
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div
        className="h-[500px] bg-cover bg-repeat rounded relative"
        style={{ backgroundImage: "url('./../assets/images/s1.png')" }}
      >
        {loading && <FullPageLoading />}
        <div className="flex  items-center mt-[30px] gap-[20px] w-full justify-center h-full">
          <div className="h-[350px] w-[350px] flex flex-col items-center justify-center gap-[3px] opacity-80 pointer-events-none ">
            <img
              src={Print}
              alt="no access"
              className="border-rounded  rounded-full"
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default PrintMinLabel;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
