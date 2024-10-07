import { Props } from "@/types/salesmodule/salesShipmentTypes";
import React, { useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cardHeaderBg, InputStyle, LableStyle, modelFixFooterStyle, modelFixHeaderStyle, primartButtonStyle } from "@/constants/themeContants";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import columnDefs, { dummyRowData } from "@/config/agGrid/salesmodule/shipmentUpdateTable";
import { AgGridReact } from "ag-grid-react";
import SalesShipmentUpadetTextCellrender from "@/config/agGrid/cellRenders.tsx/SalesShipmentUpadetTextCellrender";

const SalesShipmentUpdate: React.FC<Props> = ({ uiState }) => {
  
  const { update, setUpdate } = uiState;
  const components = useMemo(()=>({
    salesShipmentTextCellRender:SalesShipmentUpadetTextCellrender
  }),[])
  return (
    <Sheet open={update} onOpenChange={setUpdate}>
      <SheetContent className="min-w-[100%] p-0">
        <SheetHeader className={modelFixHeaderStyle}>
          <SheetTitle className="text-slate-600">Update Shipment (SO/24-25/0024)</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-100px)] bg-neutral-100 grid grid-cols-[400px_1fr]">
          <div className="p-[10px] h-[calc(100vh-100px)] overflow-y-auto flex flex-col gap-[10px]">
            <Card className="rounded-sm shadow-slate-300 ">
              <CardHeader className={cardHeaderBg}>
                <CardTitle className="font-[600] text-slate-800">Client Details</CardTitle>
              </CardHeader>
              <CardContent className="mt-[10px] p-[10px] flex flex-col gap-[10px]">
                <div>
                  <h3 className="text-slate-900  font-[500]">Client</h3>
                  <p className="text-slate-600">BLACKTAIL MINDHOUSE PRIVATE LIMITED</p>
                </div>
                <div>
                  <h3 className="text-slate-900  font-[500]">Branch</h3>
                  <p className="text-slate-600">Gurgaon</p>
                </div>
                <div>
                  <h3 className="text-slate-900  font-[500]">Address</h3>
                  <p className="text-slate-600">3rd Floor, Unit 307, Solitaire,Plaza,MG RoadGurgaon-122002 Haryana (06)</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-slate-300 ">
              <CardHeader className={cardHeaderBg}>
                <CardTitle className="font-[600] text-slate-800">Billing Details (as per the sales order)</CardTitle>
              </CardHeader>
              <CardContent className="mt-[10px] p-[10px] flex flex-col gap-[10px]">
                <div>
                  <h3 className="text-slate-900  font-[500]">PAN</h3>
                  <p className="text-slate-600">BLACKTAIL MINDHOUSE PRIVATE LIMITED</p>
                </div>
                <div>
                  <h3 className="text-slate-900  font-[500]">GST Number</h3>
                  <p className="text-slate-600">Gurgaon</p>
                </div>
                <div>
                  <h3 className="text-slate-900  font-[500]">Address</h3>
                  <p className="text-slate-600">3rd Floor, Unit 307, Solitaire,Plaza,MG RoadGurgaon-122002 Haryana (06)</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-slate-300 ">
              <CardHeader className={cardHeaderBg}>
                <CardTitle className="font-[600] text-slate-800">Shipping Details(as per the sales order)</CardTitle>
              </CardHeader>
              <CardContent className="mt-[10px] p-[10px] flex flex-col gap-[10px]">
                <div>
                  <h3 className="text-slate-900  font-[500]">CIN</h3>
                  <p className="text-slate-600">BLACKTAIL MINDHOUSE PRIVATE LIMITED</p>
                </div>
                <div>
                  <h3 className="text-slate-900  font-[500]">PAN</h3>
                  <p className="text-slate-600">Gurgaon</p>
                </div>
                <div>
                  <h3 className="text-slate-900  font-[500]">GST Number</h3>
                  <p className="text-slate-600">3rd Floor, Unit 307, Solitaire,Plaza,MG RoadGurgaon-122002 Haryana (06)</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-slate-300 ">
              <CardHeader className={cardHeaderBg}>
                <CardTitle className="font-[600] text-slate-800">Shipment Info</CardTitle>
              </CardHeader>
              <CardContent className="mt-[10px] p-[10px] flex flex-col gap-[10px]">
                <div>
                  <Label className={LableStyle}>Ship Doc. Number</Label>
                  <Input className={InputStyle} />
                </div>
                <div>
                  <Label className={LableStyle}>Vehicle Number</Label>
                  <Input className={InputStyle} />
                </div>
                <div>
                  <Label className={LableStyle}>Other References</Label>
                  <Input className={InputStyle} />
                </div>
                <div>
                  <Label className={LableStyle}>Billing Name </Label>
                  <Input disabled={true} className={InputStyle} />
                </div>
                <div>
                  <Label className={LableStyle}>Billing Address</Label>
                  <Textarea disabled={true} className={InputStyle} />
                </div>
                <div>
                  <Label className={LableStyle}>Shipping Name</Label>
                  <Input className={InputStyle} />
                </div>
                <div>
                  <Label className={LableStyle}>Shipping Address</Label>
                  <Textarea className={InputStyle} />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
          <div className="ag-theme-quartz h-[calc(100vh-100px)] w-full">
            <AgGridReact
            rowData={dummyRowData}
              columnDefs={columnDefs}
              components={components}
              animateRows={true}
              suppressCellFocus={true}
              suppressRowClickSelection={false}
            />
          </div>
          </div>
        </div>
        <div className={modelFixFooterStyle}>
          <Button onClick={()=>setUpdate(false)} className={"shadow-slate-300 mr-[10px]"} variant={"outline"}>
            Back
          </Button>
          <Button className={primartButtonStyle}>Update Shipment</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SalesShipmentUpdate;
