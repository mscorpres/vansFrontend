import { Skeleton } from "@/components/ui/skeleton";
export default () => {
  return (
    <div className="items-center ag-custom-loading-cell w-full flex flex-col gap-[20px] ">
      <div className=" flex items-center justify-between gap-[50px] w-full">
        <Skeleton className="h-[20px] rounded-full w-[150px]" />
        <Skeleton className="h-[20px] rounded-full w-[150px]" />
        <Skeleton className="h-[20px] rounded-full w-[150px]" />
        <Skeleton className="h-[20px] rounded-full w-[150px]" />
        <Skeleton className="h-[20px] rounded-full w-[150px]" />
        <Skeleton className="h-[20px] rounded-full w-[150px]" />
      </div>
    </div>
  );
};
