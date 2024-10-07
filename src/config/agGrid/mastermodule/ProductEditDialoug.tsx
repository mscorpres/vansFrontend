// import React, { useEffect } from 'react';
// import { z } from 'zod';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetHeader, SheetFooter } from '@/components/ui/sheet';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useApi } from '@hooks/useApi'; 
// import { FormField,  } from "@/components/ui/form";

// const productSchema = z.object({
//   name: z.string().nonempty('Product name is required'),
//   code: z.string().nonempty('Product code is required'),
//   type: z.string().nonempty('Product type is required'),
//   uom: z.string().nonempty('UOM is required'),
//   price: z.number().min(0, 'Price must be a positive number'),
//   description: z.string().optional(),
// });

// type ProductFormData = z.infer<typeof productSchema>;

// interface ProductUpdateDialogProps {
//   productId: string;
//   onClose: () => void;
// }

// export const ProductUpdateDialog: React.FC<ProductUpdateDialogProps> = ({ productId, onClose }) => {
//   const { data: product, refetch } = useApi(`/products/${productId}`); 
//   const { mutateAsync: updateProduct } = useApi('/products/update', { method: 'PUT' }); 

//   const { control, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
//     resolver: zodResolver(productSchema),
//     defaultValues: product,
//   });

//   useEffect(() => {
//     if (product) {
//       reset(product);
//     }
//   }, [product, reset]);

//   const onSubmit = async (data: ProductFormData) => {
//     try {
//       await updateProduct({ ...data, id: productId });
//       refetch(); 
//       onClose(); 
//     } catch (error) {
//       console.error('Error updating product:', error);
//     }
//   };

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button>Edit Product</Button>
//       </SheetTrigger>
//       <SheetContent>
//         <SheetHeader>
//           <SheetTitle>Update Product</SheetTitle>
//         </SheetHeader>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <FormField
//             render={({ field }) => (
//               <>
//                 <Label htmlFor="name">Product Name</Label>
//                 <Input id="name" {...field} placeholder="Enter product name" />
//                 {errors.name && <p className="text-red-500">{errors.name.message}</p>}
//               </>
//             )}
//             control={control}
//             name="name"
//           />
//           <FormField
//             render={({ field }) => (
//               <>
//                 <Label htmlFor="code">Product Code</Label>
//                 <Input id="code" {...field} placeholder="Enter product code" />
//                 {errors.code && <p className="text-red-500">{errors.code.message}</p>}
//               </>
//             )}
//             control={control}
//             name="code"
//           />
//           <FormField
//             render={({ field  }) => (
//               <>
//                 <Label htmlFor="type">Product Type</Label>
//                 <Input id="type" {...field} placeholder="Enter product type" />
//                 {errors.type && <p className="text-red-500">{errors.type.message}</p>}
//               </>
//             )}
//             control={control}
//             name="type"
//           />
//           <FormField
//             render={({ field }) => (
//               <>
//                 <Label htmlFor="uom">UOM</Label>
//                 <Input id="uom" {...field} placeholder="Enter unit of measure" />
//                 {errors.uom && <p className="text-red-500">{errors.uom.message}</p>}
//               </>
//             )}
//             control={control}
//             name="uom"
//           />
//           <FormField
//             render={({ field }) => (
//               <>
//                 <Label htmlFor="price">Price</Label>
//                 <Input id="price" type="number" {...field} placeholder="Enter price" />
//                 {errors.price && <p className="text-red-500">{errors.price.message}</p>}
//               </>
//             )}
//             control={control}
//             name="price"
//           />
//           <FormField
//             render={({ field }) => (
//               <>
//                 <Label htmlFor="description">Description</Label>
//                 <Input id="description" {...field} placeholder="Enter description" />
//               </>
//             )}
//             control={control}
//             name="description"
//           />
//           <SheetFooter>
//             <Button type="submit">Save Changes</Button>
//             <Button type="button" onClick={onClose}>Cancel</Button>
//           </SheetFooter>
//         </form>
//       </SheetContent>
//     </Sheet>
//   );
// };
