
export const podetail:RowData[] = [
  { poId: 'PO001', costCenter: 'CC1001', vendorNarration: 'Vendor A - Item X', poRegDate: '2023-01-15', approvedStatus: 'Pending', action: 'View' },
  { poId: 'PO002', costCenter: 'CC1002', vendorNarration: 'Vendor B - Item Y', poRegDate: '2023-02-20', approvedStatus: 'Approved', action: 'View' },
  { poId: 'PO003', costCenter: 'CC1003', vendorNarration: 'Vendor C - Item Z', poRegDate: '2023-03-25', approvedStatus: 'Rejected', action: 'View' },
  { poId: 'PO004', costCenter: 'CC1004', vendorNarration: 'Vendor D - Item W', poRegDate: '2023-04-30', approvedStatus: 'Pending', action: 'View' },
]
export interface RowData {
  poId: string;
  costCenter: string;
  vendorNarration: string;
  poRegDate: string;
  approvedStatus: 'Pending' | 'Rejected' | 'Approved';
  action: string;
  isNew?: boolean; // Add this flag
}

export const initialrowdata:RowData[] = [
  { poId: 'PO001', costCenter: 'CC1001', vendorNarration: 'Vendor A - Item X', poRegDate: '2023-01-15', approvedStatus: 'Pending', action: 'View', isNew: false },
 
] 

export interface RowData2 {
  index: number;
  material: string;
  asinNumber: string;
  ordQty: number;
  rate: number;
  gstRate: number;
  isNew?: boolean;
}
export const initialrowdata2: RowData2[] = [
  { index: 1, material: 'Material A', asinNumber: 'ASIN001', ordQty: 100, rate: 50, gstRate: 18 },
  { index: 2, material: 'Material B', asinNumber: 'ASIN002', ordQty: 200, rate: 60, gstRate: 18 },
  { index: 3, material: 'Material C', asinNumber: 'ASIN003', ordQty: 150, rate: 55, gstRate: 18 },
  { index: 4, material: 'Material D', asinNumber: 'ASIN004', ordQty: 120, rate: 52, gstRate: 18 },
  { index: 5, material: 'Material E', asinNumber: 'ASIN005', ordQty: 180, rate: 58, gstRate: 18 },
  { index: 6, material: 'Material F', asinNumber: 'ASIN006', ordQty: 130, rate: 54, gstRate: 18 },
  { index: 7, material: 'Material G', asinNumber: 'ASIN007', ordQty: 170, rate: 57, gstRate: 18 },
  { index: 8, material: 'Material H', asinNumber: 'ASIN008', ordQty: 140, rate: 53, gstRate: 18 },
  { index: 9, material: 'Material I', asinNumber: 'ASIN009', ordQty: 160, rate: 56, gstRate: 18 },
  { index: 10, material: 'Material J', asinNumber: 'ASIN010', ordQty: 110, rate: 51, gstRate: 18 },
  { index: 11, material: 'Material K', asinNumber: 'ASIN011', ordQty: 190, rate: 59, gstRate: 18 },
  { index: 12, material: 'Material L', asinNumber: 'ASIN012', ordQty: 105, rate: 50, gstRate: 18 },
  { index: 13, material: 'Material M', asinNumber: 'ASIN013', ordQty: 115, rate: 52, gstRate: 18 },
  { index: 14, material: 'Material N', asinNumber: 'ASIN014', ordQty: 125, rate: 53, gstRate: 18 },
  { index: 15, material: 'Material O', asinNumber: 'ASIN015', ordQty: 135, rate: 54, gstRate: 18 },
  { index: 16, material: 'Material P', asinNumber: 'ASIN016', ordQty: 145, rate: 55, gstRate: 18 },
  { index: 17, material: 'Material Q', asinNumber: 'ASIN017', ordQty: 155, rate: 56, gstRate: 18 },
  { index: 18, material: 'Material R', asinNumber: 'ASIN018', ordQty: 165, rate: 57, gstRate: 18 },
  { index: 19, material: 'Material S', asinNumber: 'ASIN019', ordQty: 175, rate: 58, gstRate: 18 },
  { index: 20, material: 'Material T', asinNumber: 'ASIN020', ordQty: 185, rate: 59, gstRate: 18 },
  { index: 21, material: 'Material U', asinNumber: 'ASIN021', ordQty: 195, rate: 60, gstRate: 18 },
];

export interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export const colourOptions: readonly ColourOption[] = [
  { value: "ocean", label: "Ocean", color: "#00B8D9" },
  { value: "blue", label: "Blue", color: "#0052CC" },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];
