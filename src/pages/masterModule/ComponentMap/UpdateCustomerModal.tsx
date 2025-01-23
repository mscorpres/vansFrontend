import React, { useEffect } from "react";
import { Form, Row } from "antd";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch, RootState } from "@/store";
import { InputStyle } from "@/constants/themeContants";
// import styled from "styled-components";
import { fetchStates } from "@/features/salesmodule/createSalesOrderSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { updateMapCustomer } from "@/features/client/clientSlice";
import { componentMapListCustomers } from "@/components/shared/Api/masterApi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { Button } from "@mui/material";

interface Props {
  open: boolean;
  onClose: (open: boolean) => void;
  data: any;
  fetchComponentMap: any;
}

const UpdateCustomerModal: React.FC<Props> = (props: Props) => {
  const { open, onClose, data, fetchComponentMap } = props;
  const { toast } = useToast();
  const { loading } = useSelector((state: RootState) => state.client);
  const dispatch = useDispatch<AppDispatch>();

  const [form] = Form.useForm();
  useEffect(() => {
    if (data) {
      form.setFieldValue("desc", data?.customer_desc);
      form.setFieldValue("vendorPartName", data?.cust_name);
      form.setFieldValue("vendorPartCode", data?.cust_part_no);
      form.setFieldValue("vendorName", data?.cust + " " + data?.cust_name);
      form.setFieldValue("partName", data?.comp + " " + data?.cust_comp);
    }
  }, [data, dispatch]);

  const onSubmit = async (values: any) => {
    const payload: any = {
      comp: data?.comp,
      customer: data?.cust,
      customer_part_code: values.vendorPartCode,
      customer_comp: values.vendorPartName,
      description: values.desc,
    };
    dispatch(updateMapCustomer(payload)).then((res: any) => {
      if (res.payload.success) {
        toast({
          title: res.payload.message || "Billing Address created successfully",
          className: "bg-green-600 text-white items-center",
        });
        onClose(false);
        fetchComponentMap();
      } else {
        toast({
          title: res.payload.message || "Failed to Create Product",
          className: "bg-red-600 text-white items-center",
        });
      }
    });
  };

  useEffect(() => {
    dispatch(fetchStates());
  }, []);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        className="min-w-[60%] max-h-[100vh] overflow-y-auto flex flex-col"
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
      >
        {loading && <FullPageLoading />}
        <SheetHeader>
          <SheetTitle className="text-slate-600 text-[25px]">
            Update Customer
          </SheetTitle>
        </SheetHeader>
        <div>
          <Form
            form={form}
            layout="vertical"
            className="space-y-6 overflow-hidden p-[10px] h-[500px]"
          >
            <div className="grid grid-cols-2 gap-[40px] ">
              <div className="">
                <Form.Item name="partName" label="Part Name">
                  <Input
                    className={InputStyle}
                    placeholder="Enter PartName"
                    readOnly
                    style={{ backgroundColor: "#f0f0f0" }}
                    // {...field}
                  />
                </Form.Item>
              </div>

              <Form.Item name="vendorName" label="Customer Name">
                <Input
                  className={InputStyle}
                  placeholder="Enter Customer Name"
                  readOnly
                  style={{ backgroundColor: "#f0f0f0" }}
                  // {...field}
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
                variant="contained"
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                onClick={() => onSubmit(form.getFieldsValue())}
              >
                Submit
              </Button>
            </Row>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateCustomerModal;
