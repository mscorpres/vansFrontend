import AddSalesOrder from "@/components/shared/AddSalesOrder";
import CreateSalesOrder from "@/components/shared/CreateSalesOrder";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

const CreateSalesOrderPage = () => {
  const [tabvalue, setTabvalue] = useState<string>("create");
  // const [data, setData] = useState<any>();
  const [payloadData, setPayloadData] = useState<any>(null);

  console.log("formdata", payloadData);

  return (
    <div>
      <Tabs value={tabvalue} onValueChange={setTabvalue}>
        <TabsContent value="create" className="p-0 m-0">
          <CreateSalesOrder setTab={setTabvalue} setPayloadData={setPayloadData} />
        </TabsContent>
        <TabsContent value="add" className="p-0 m-0">
          <AddSalesOrder setTab={setTabvalue}  payloadData={payloadData}/>
          
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateSalesOrderPage;
