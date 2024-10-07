import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { clientEditFormSchema } from "@/schema/masterModule/customerSchema";
import ReusableAsyncSelect from "./ReusableAsyncSelect";
import { transformClientTds } from "@/helper/transform";
import {
  MasterCustomer,
  Props,
} from "@/types/masterModule/masterCustomerTypes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import styled from "styled-components";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchClient, updateClient } from "@/features/client/clientSlice";
const MasterClientEdit: React.FC<Props> = ({
  uiState,
}: {
  uiState: MasterCustomer;
}) => {
  const { clientEdit, setClientEdit, clientId } = uiState;
  const { toast } = useToast();
  const dispatch = useDispatch();

  const clientData = useSelector(
    (state: any) =>
      state.client.data.find((client: any) => client?.code === clientId) || {}
  );

  const form = useForm<z.infer<typeof clientEditFormSchema>>({
    resolver: zodResolver(clientEditFormSchema),
    defaultValues: {
      active: false,
    },
  });

  console.log("client data", clientData);

  useEffect(() => {
    if (clientEdit && clientId) {
      dispatch(fetchClient({ code: clientId }) as any);
    }
  }, [clientEdit, clientId, dispatch]);

  useEffect(() => {
    if (clientData) {
      form.reset({
        clientName: clientData.name,
        email: clientData.email,
        panNo: clientData.panNo,
        mobileNo: clientData.mobile,
        salePerson: clientData.salesPerson,
        website: clientData.website,
        clientTDS: clientData.tds || [],
        clientTCS: clientData.tcs || [],
        active: clientData.status === "active",
      });
    }
  }, [clientData, form]);

  const onSubmit = (value: any) => {
    const payload = {
      ...value,
      code: clientId,
      status: value.active ? "active" : "inactive",
    };
    dispatch(updateClient({ endpoint: `/client/update`, payload }) as any);
    toast({
      title: "Client updated successfully",
      className: "bg-green-600 text-white items-center",
    });

    setClientEdit(false);
  };

  return (
    <Sheet open={clientEdit} onOpenChange={setClientEdit}>
      <SheetContent className="min-w-[50%]">
        <SheetHeader>
          <SheetTitle>Edit Client Details</SheetTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-[10px]">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-600">
                          Vendor Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Vendor Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-600">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="panNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-600">
                          PAN Number
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="PAN Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobileNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-600">Mobile</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Mobile"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salePerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-600">
                          Sale Person
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Sale Person" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-600">
                          Website
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Website" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="clientTDS"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-slate-600">
                        Client TDS
                      </FormLabel>
                      <FormControl>
                        <ReusableAsyncSelect
                          placeholder="Client TDS"
                          endpoint="vendor/getAllTds"
                          transform={transformClientTds}
                          fetchOptionWith="query"
                          onChange={(e: any) =>
                            form.setValue("clientTDS", e.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientTCS"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-slate-600">
                        Client TCS
                      </FormLabel>
                      <FormControl>
                        <ReusableAsyncSelect
                          placeholder="Client TCS"
                          endpoint="/tally/tcs/getAllTcs"
                          transform={transformClientTds}
                          fetchOptionWith="query"
                          onChange={(e: any) =>
                            form.setValue("clientTCS", e.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch className="flex items-center gap-[10px]">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e: any) =>
                                form.setValue("active", e.target.checked)
                              }
                            />
                            <span className="slider"></span>
                          </label>
                          <p className="text-slate-600 text-[13px]">Active</p>
                        </Switch>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                >
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const Switch = styled.div`
  .switch {
    position: relative;
    display: inline-block;
    width: 2.8em;
    height: 18px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 30px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 15px;
    width: 15px;
    border-radius: 20px;
    left: 2px;
    bottom: 1.5px;
    background-color: white;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #0891b2;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #0891b2;
  }

  input:checked + .slider:before {
    transform: translateX(1.7em);
  }
`;

export default MasterClientEdit;
