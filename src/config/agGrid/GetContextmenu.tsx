import { GetContextMenuItemsParams, MenuItemDef } from "@ag-grid-community/core";



export const menuresult = (params: GetContextMenuItemsParams) => {
  var result: (string | MenuItemDef)[] = [
    {
      name: "Export to Excel",
      action: () => {
        const targetDiv = document.querySelector('div[row-index="0"]');
        // Check if the target div exists and proceed
        if (targetDiv) {
          // Assuming you want to export the data for this specific row
          const rowIndex = targetDiv.getAttribute("row-index");

          // Get the node for the specific row
          const rowNode = params.api.getRowNode(rowIndex!);

          // Set export parameters
          const params2 = {
            onlySelected: true, // Assuming you want to export only the specific row
            processCellCallback: (params: any) => {
              // You can add additional processing here if needed
              return params.value;
            },
            // If you want to export only this row, set the row nodes
            rowNodes: rowNode ? [rowNode] : [],
          };

          // Export data as Excel
          params.api.exportDataAsExcel(params2);
        } else {
        }
      },
      cssClasses: ["bg-[#217346]","bold","text-white","hover:bg-[#2e9c60]","text-[14px]","py-[5px]","mx-[5px]","rounded-full","max-w-max"],
      icon:`<img src="https://static-00.iconduck.com/assets.00/ms-excel-icon-1024x1014-pg0ryoeb.png" />`
    },
  ];

  return result;
};
