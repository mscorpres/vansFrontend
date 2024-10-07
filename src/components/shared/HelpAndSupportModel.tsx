import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Props } from "@/types/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { modelFixFooterStyle, primartButtonStyle, tabNavStyle } from "@/constants/themeContants";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "../ui/textarea";
import { GrAttachment } from "react-icons/gr";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog";

const HelpAndSupportModel: React.FC<Props> = ({ uiState }) => {
  const { helpModel, setHelpModel } = uiState;
  const [model, setModel] = useState<boolean>(false);
  return (
    <>
      <Dialog open={model} onOpenChange={setModel} >
        <DialogOverlay />
        <DialogContent className="min-w-[60%] animate-shake"   onInteractOutside={(e:any) => {
          e.preventDefault();
        }}>
          <DialogHeader>
            <DialogTitle className="text-slate-600">Desktop</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] border border-dashed border-slate-400 flex justify-center items-center rounded-md">
            <div className="flex flex-col gap-[10px] items-center">
              <p className="text-slate-600 text-[18px] font-[600]">Drag & Drop files here</p>
              <p>or</p>
              <input type="file" className="hidden" id="file" />
              <Label htmlFor="file" className={`${primartButtonStyle} cursor-pointer text-white rounded-md py-[10px] px-[20px]`}>
                Choose files to upload
              </Label>
            </div>
          </div>
          <div className="flex gap-[10px]">
            <Button className={primartButtonStyle}>Attach</Button>
            <Button onClick={() => setModel(false)} variant={"outline"} className="shadow shadow-slate-300">
              Cancle
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={helpModel} onOpenChange={setHelpModel}>
        <SheetContent className="min-w-[35%] p-0"  onInteractOutside={(e:any) => {
          e.preventDefault();
        }}>
          <Tabs defaultValue="resources">
            <SheetHeader className="h-[50px] flex justify-end bg-white shadow shadow-slate-300 p-0">
              <TabsList className="justify-start p-0 bg-white">
                <TabsTrigger value="resources" className={tabNavStyle}>
                  Resources
                </TabsTrigger>
                <TabsTrigger value="contact" className={tabNavStyle}>
                  Contact us
                </TabsTrigger>
              </TabsList>
            </SheetHeader>
            <div className="h-[calc(100vh-52px)] bg-white overflow-y-auto mt-[2px]">
              <TabsContent value="resources" className="px-[10px] ">
                <div className="flex items-center rounded bg-white gap-[10px] shadow-sm  text-slate-600 border px-[10px] py-[2px] border-slate-300">
                  <Search className="h-[20px] w-[20px]" />
                  <span className="text-slate-400">|</span>
                  <Input placeholder="Enter a keyword for relevent articals" className="border-none rounded-none shadow-none focus-visible:ring-0" />
                </div>
                <h2 className="h-[20px] text-slate-700 mt-[20px] font-[600] text-[17px]">Related Topics</h2>
                <div className="bg-white border rounded-lg mt-[20px] p-[10px] shadow">
                  <Accordion type="multiple">
                    <AccordionItem value="item-1" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline text-start">Lorem ipsum dolor sit amet consectetur adipisicing elit.</AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">Lorem, ipsum dolor sit amet consectetur </AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">Lorem, ipsum dolor sit amet consectetur lorem </AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">Lorem ipsum dolor sit amet consectetur adipisicing elit.</AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">Lorem, ipsum dolor sit amet consectetur </AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">Lorem, ipsum dolor sit amet consectetur lorem </AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <h2 className="h-[20px] text-slate-700 mt-[20px] font-[600] text-[17px] ">Popular Topics</h2>
                <div className="bg-white border rounded-lg mt-[20px] p-[10px] shadow">
                  <Accordion type="multiple">
                    <AccordionItem value="item-1" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">Lorem ipsum dolor sit amet consectetur adipisicing elit.</AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">Lorem, ipsum dolor sit amet consectetur </AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">Lorem, ipsum dolor sit amet consectetur lorem </AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">Lorem ipsum dolor sit amet consectetur adipisicing elit.</AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">Lorem, ipsum dolor sit amet consectetur </AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6" className="">
                      <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">Lorem, ipsum dolor sit amet consectetur lorem </AccordionTrigger>
                      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
              <TabsContent value="contact" className="bg-white ">
                <div className="p-[10px]">
                  <h2 className="h-[20px] text-slate-700 mt-[20px] font-[600] text-[17px]">Write to us</h2>
                  <p className="text-slate-600 text-[13px] mt-[5px]">Provide a brief desciption of your issue or any feedback that you have</p>
                  <div className="flex flex-col gap-[20px] mt-[30px]">
                    <Input className={"border-slate-400 focus-visible:ring-0 h-[50px]"} placeholder="Email Address" />
                    <Input className={"border-slate-400 focus-visible:ring-0 h-[50px]"} placeholder="Subject" />
                    <Textarea className={"border-slate-400 focus-visible:ring-0 h-[150px] resize-none"} placeholder="Description" />
                    <Label onClick={() => setModel(true)} className="cursor-pointer flex gap-[10px] items-center text-cyan-600 text-[15px]">
                      <GrAttachment className="h-[20px] w-[20px] " />
                      Attachment{" "}
                    </Label>
                    <p className="text-slate-600">Supported fiel types-jpg,png,pdf,doc</p>
                  </div>
                </div>
                <div className={modelFixFooterStyle}>
                  <Button className={`${primartButtonStyle} max-w-max`}> Submit</Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default HelpAndSupportModel;
