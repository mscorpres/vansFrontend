// import AddSalesOrder from "@/components/shared/AddSalesOrder";
// import CreateSalesOrder from "@/components/shared/CreateSalesOrder";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import CreatePoPage from "./CreatePoPage";
import AddPO from "./AddPO";

const PoCreateTemplate = () => {
  const [tabvalue, setTabvalue] = useState<string>("create");
  // const [data, setData] = useState<any>();
  const [payloadData, setPayloadData] = useState<any>(null);
  console.log("tabvalue", tabvalue);

  return (
    <div>
      <Tabs value={tabvalue} onValueChange={setTabvalue}>
        <TabsContent value="create" className="p-0 m-0">
          <CreatePoPage setTab={setTabvalue} setPayloadData={setPayloadData} />
        </TabsContent>
        <TabsContent value="add" className="p-0 m-0">
          <AddPO setTab={setTabvalue} payloadData={payloadData} />
        </TabsContent>
      </Tabs>
    </div>
  );
  0;
};

export default PoCreateTemplate;
