import { Button, Form } from "antd";
import { Filter } from "lucide-react";
import styled from "styled-components";

import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { transformOptionData, transformOptionData2 } from "@/helper/transform";
import { useDispatch, useSelector } from "react-redux";
import { cutomerLable } from "@/features/client/storeSlice";
import { downloadFunction } from "@/components/shared/PrintFunctions";
import Print from "@/assets/Print.jpg";
import FullPageLoading from "@/components/shared/FullPageLoading";
function PrintMinLabel() {
  const [form] = Form.useForm();

  const { loading } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();

  const onsubmit = async () => {
    let values = await form.validateFields();

    let payload = {
      pickSlip_no: values.min.value,
    };
    dispatch(cutomerLable(payload)).then((res) => {
      if (res.payload.success) {
        downloadFunction(
          res.payload.data.buffer.data,
          res.payload.data.filename
        );
      }
    });
  };

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] overflow-hidden bg-white">
      <div className="bg-[#fff]">
        {loading && <FullPageLoading />}
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
                  transform={transformOptionData2}
                  // onChange={(e) => form.setValue("customerName", e)}
                  // value={selectedCustomer}
                  fetchOptionWith="query2"
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
      </div>{" "}
      <div
        className="h-[500px] bg-cover bg-repeat rounded"
        style={{ backgroundImage: "url('./../assets/images/s1.png')" }}
      >
        <div className="flex  items-center mt-[30px] gap-[20px] w-full justify-center h-full">
          <div className="h-[350px] w-[350px] flex flex-col items-center justify-center gap-[3px] opacity-80 pointer-events-none ">
            {" "}
            <img
              src={Print}
              alt="no access"
              className="border-rounded  rounded-full"
            />
            {/* <MdLocalPrintshop className="h-[150px] w-[150px] text-cyan-800" /> */}
            {/* <Link to={"/"} className="flex items-center gap-[5px]">
              <p className="text-cyan-800 font-[600]">Production</p>
              <BiLinkExternal className="text-cyan-800" />
            </Link> */}
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
