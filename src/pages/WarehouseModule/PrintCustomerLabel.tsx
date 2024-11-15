import { Button, Form, Input } from "antd";
import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";
import Select from "react-select";
import styled from "styled-components";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { transformOptionData } from "@/helper/transform";
import { AgGridReact } from "ag-grid-react";
import { useDispatch, useSelector } from "react-redux";
import { cutomerLable, getminBox, qrPrint } from "@/features/client/storeSlice";
import { spigenAxios } from "@/axiosIntercepter";
import { downloadFunction } from "@/components/shared/PrintFunctions";
import { print } from "./../../assets/print.jpeg";
import FullPageLoading from "@/components/shared/FullPageLoading";
function PrintMinLabel() {
  const [form] = Form.useForm();
  const selMin = Form.useWatch("min", form);
  const [loading, setLoading] = useState(false);
  const selType = Form.useWatch("printType", form);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const types = [
    {
      value: "min",
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
    let response = await spigenAxios.post("/qrPrint/getminBox", formData);
  };
  const getDataBox = async (formData) => {
    let response = await spigenAxios.post(
      "/backend/getTransferminBox",
      formData
    );
  };
  const onsubmit = async () => {
    let values = await form.validateFields();

    setLoading(true);
    let payload = {
      pickSlip_no: values.min.value,
    };
    dispatch(cutomerLable(payload)).then((res) => {
      if (res.payload.code == 200) {
        downloadFunction(
          res.payload.data.buffer.data,
          res.payload.data.filename
        );
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    if (selMin) {
      const formData = new FormData();
      formData.append("type", "MIN");
      formData.append("min_no", selMin.value);
      if (selType?.value == "Transfer" || selType == "Transfer") {
        getDataBox(formData);
      } else {
        getData(formData);
      }
    }
  }, [selMin]);
  return (
    <Wrapper className="h-[calc(100vh-50px)] grid grid-cols-[350px_1fr] overflow-hidden bg-[#eaf1ec]">
      <div className="bg-[#fff]">
        {loading == true && <FullPageLoading />}
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
              <Form.Item name="min" label="Slip Transaction Id">
                <ReusableAsyncSelect
                  // placeholder="Customer Name"
                  endpoint="/backend/getOutTransaction"
                  transform={transformOptionData}
                  // onChange={(e) => form.setValue("customerName", e)}
                  // value={selectedCustomer}
                  fetchOptionWith="payloadSearchTerm"
                />
              </Form.Item>
              {/* // )} */}
            </div>

            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 text-white"
              onClick={(e: any) => {
                e.preventDefault();
                onsubmit();
              }}
            >
              Print
            </Button>
          </form>
        </Form>{" "}
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-50px)]">
        {" "}
        <div className="h-[calc(100vh-50px)] flex flex-col gap-[20px] justify-center items-center">
          {/* <img
            src="./../../assets/print.jpeg"
            // alt="project under developent"
            className="w-[400px] opacity-30"
          /> */}
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
