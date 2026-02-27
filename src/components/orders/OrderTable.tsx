// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import track from "../../assets/delivery_truck_speed.svg";

// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from "../ui/sheet";
// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import { Skeleton } from "../ui/skeleton";

// import { BsThreeDotsVertical } from "react-icons/bs";
// import GeneralInfo from "./orderSheetDetail/general_info";
// import Requirments_info from "./orderSheetDetail/requirements_info";
// import File_info from "./orderSheetDetail/file_info";
// import Billing_info from "./orderSheetDetail/billing_info";
// import Shipping from "./orderSheetDetail/shipping_info";
// import Notes from "./orderSheetDetail/notes";
// import Photos from "./orderSheetDetail/images";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import {
//   DropdownMenuItem,
// } from "@radix-ui/react-dropdown-menu";

// import { useLanguage } from "../../language/useLanguage";
// import strings from "../../language";

// import { useOrders } from "./useOrders";
// import ChangeStatusDialog from "./ChangeStatusDialog";

// const priorityStyles: Record<string, { badge: string; row?: string }> = {
//   MEDIUM: { badge: "bg-blue-100 text-blue-400 border-blue-400" },
//   HIGH: { badge: "bg-red-100 text-red-400 border-red-400" },
//   LOW: { badge: "bg-gray-100 text-gray-400 border-gray-400" },
// };

// export default function OrderTable() {
//   const { language } = useLanguage();
//   const t = strings[language];

//   const {
//     orders,
//     ordersDetail,
//     isLoading,
//     openOrderId,
//     setOpenOrderId,
//     openDetails,
//     isTrackingOpen,
//     setIsTrackingOpen,
//     isStatusPopupOpen,
//     setIsStatusPopupOpen,
//     newStatus,
//     setNewStatus,
//     provider,
//     setProvider,
//     trackingId,
//     setTrackingId,
//     isOkDisabled,
//     isSubmitting,
//     openChangeStatus,
//     closeChangeStatus,
//     handleOk,
//   } = useOrders();

//   const renderSkeletonRows = () =>
//     Array.from({ length: 10 }).map((_, idx) => (
//       <TableRow key={idx}>
//         <TableCell className="text-left">
//           <Skeleton className="h-4 w-40 bg-gray-300 dark:bg-gray-700" />
//         </TableCell>
//         <TableCell className="text-left">
//           <Skeleton className="h-4 w-32 bg-gray-300 dark:bg-gray-700" />
//         </TableCell>
//         <TableCell className="text-left">
//           <Skeleton className="h-6 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
//         </TableCell>
//         <TableCell className="text-left">
//           <Skeleton className="h-6 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
//         </TableCell>
//         <TableCell className="text-left">
//           <Skeleton className="h-4 w-28 bg-gray-300 dark:bg-gray-700" />
//         </TableCell>
//         <TableCell className="text-left">
//           <Skeleton className="h-8 w-10 rounded-md bg-gray-300 dark:bg-gray-700" />
//         </TableCell>
//       </TableRow>
//     ));

//   if (isLoading) {
//     return (
//       <div className="min-h-screen w-full bg-muted/30 flex justify-center items-start">
//         <div className="bg-white dark:bg-black border rounded-xl overflow-hidden w-full max-w-6xl mt-6">
//           <Table>
//             <TableHeader className="bg-gray-300 overflow-hidden">
//               <TableRow>
//                 <TableHead className="text-black text-left pl-4">
//                   {t.orderReq.table.headers["sno."]}
//                 </TableHead>
//                 <TableHead className="text-black text-left">
//                   {t.orderReq.table.headers.h1}
//                 </TableHead>
//                 <TableHead className="text-black text-left">
//                   {t.orderReq.table.headers.h2}
//                 </TableHead>
//                 <TableHead className="text-black text-left">
//                   {t.orderReq.table.headers.h3}
//                 </TableHead>
//                 <TableHead className="text-black text-left">
//                   {t.orderReq.table.headers.h4}
//                 </TableHead>
//                 <TableHead className="text-black text-left">
//                   {t.orderReq.table.headers.h6}
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody className="text-center">{renderSkeletonRows()}</TableBody>
//           </Table>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-white dark:bg-black border rounded-xl overflow-hidden no-scrollbar">
//         <Table>
//           <TableHeader className="bg-gray-300 overflow-hidden">
//             <TableRow>
//               <TableHead className="text-black pl-4">
//                 {t.orderList.table.headers["sno."]}
//               </TableHead>
//               <TableHead className="text-black">
//                 {t.orderList.table.headers.h1}
//               </TableHead>
//               <TableHead className="text-black">
//                 {t.orderList.table.headers.h2}
//               </TableHead>
//               <TableHead className="text-black">
//                 {t.orderList.table.headers.h3}
//               </TableHead>
//               <TableHead className="text-black">
//                 {t.orderList.table.headers.h4}
//               </TableHead>
//               <TableHead className="text-black">
//                 {t.orderList.table.headers.h6}
//               </TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody className="text-center">
//             {orders.map((order, index) => (
//               <Sheet
//                 key={order.order_id}
//                 open={openOrderId === order.order_id}
//                 onOpenChange={(open) => {
//                   if (open) setOpenOrderId(order.order_id);
//                   else setOpenOrderId(null);
//                 }}
//               >
//                 <TableRow>
//                   <TableCell className="font-medium text-left pl-4">
//                     {index + 1 + 1000}
//                   </TableCell>

//                   <TableCell className="text-left">
//                     {order.product_list}
//                   </TableCell>

//                   <TableCell className="text-left">
//                     <Badge
//                       variant="outline"
//                       className={`font-semibold ${
//                         priorityStyles[order.priority.toUpperCase()]?.badge
//                       }`}
//                     >
//                       {order.priority.toUpperCase()}
//                     </Badge>
//                   </TableCell>

//                   <TableCell className="text-left">
//                     <Badge className="bg-green-100 border-green-400 text-green-600 uppercase">
//                       {order.status}
//                     </Badge>
//                   </TableCell>

//                   <TableCell className="text-left">
//                     {new Date(order.expected_delivery)
//                       .toLocaleDateString("en-US", {
//                         month: "2-digit",
//                         day: "2-digit",
//                         year: "numeric",
//                       })
//                       .replace(/\//g, "-")}
//                   </TableCell>

//                   <TableCell className="text-left">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="outline" className="bg-gray-100">
//                           <BsThreeDotsVertical />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent
//                         align="end"
//                         className="w-40 bg-white border border-[#BABABA] text-black shadow-lg m-1"
//                       >
//                         <DropdownMenuItem
//                           onClick={() => openDetails(order.order_id)}
//                           className="p-2 cursor-pointer focus:bg-black focus:text-white rounded-md"
//                         >
//                           View details
//                         </DropdownMenuItem>

//                         <DropdownMenuItem
//                           onClick={() => openChangeStatus(order)}
//                           className="p-2 cursor-pointer focus:bg-black focus:text-white rounded-md"
//                         >
//                           Change status
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>

//                     {/* Sheet detail panel */}
//                     <SheetContent
//                       side="bottom"
//                       className="
//                         w-full h-[85vh] max-w-none
//                         rounded-t-2xl
//                         animate-in slide-in-from-bottom
//                         bg-white dark:bg-neutral-950
//                         border-l
//                         flex flex-col
//                         overflow-hidden
//                       "
//                     >
//                       <div className="sticky top-0 z-10 bg-white rounded-t-2xl dark:bg-neutral-950 border-b px-6 py-1">
//                         <div className="flex items-center justify-between gap-3">
//                           <SheetHeader className="space-y-1">
//                             <SheetTitle className="text-lg font-semibold">
//                               {t.orderList.title}
//                             </SheetTitle>
//                             <SheetDescription className="text-sm text-muted-foreground">
//                               Order ID: {order.order_id}
//                             </SheetDescription>
//                           </SheetHeader>
//                         </div>
//                       </div>

//                       <div className="flex-1 px-6 py-4 mt-2 overflow-hidden">
//                         <div className="flex gap-5 h-full">
//                           <div className="flex-1 overflow-y-auto pr-1 no-scrollbar">
//                             {order.status === "SHIPPED" && (
//                               <div className="mb-5">
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     setIsTrackingOpen((prev) => !prev)
//                                   }
//                                   className="
//                                     w-full flex items-center justify-between
//                                     rounded-xl border border-[#BABABA]
//                                     bg-neutral-50 px-5 py-3
//                                     text-left
//                                   "
//                                 >
//                                   <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
//                                     <img
//                                       src={track}
//                                       className="h-[28px] w-[28px]"
//                                       alt="track"
//                                     />
//                                     <span>Order Tracking</span>
//                                   </div>

//                                   <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
//                                     <span>
//                                       Tracking ID:&nbsp;{884651036621}
//                                     </span>
//                                     <svg
//                                       xmlns="http://www.w3.org/2000/svg"
//                                       viewBox="0 0 24 24"
//                                       className={`h-5 w-5 transition-transform ${
//                                         isTrackingOpen
//                                           ? "rotate-180"
//                                           : "rotate-0"
//                                       }`}
//                                     >
//                                       <path
//                                         fill="currentColor"
//                                         d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"
//                                       />
//                                     </svg>
//                                   </div>
//                                 </button>

//                                 {isTrackingOpen && (
//                                   <div className="mt-2 rounded-2xl border border-[#BABABA] bg-white px-5 py-4 text-sm text-gray-800">
//                                     <div className="flex flex-col gap-1">
//                                       <div className="flex justify-between">
//                                         <span className="font-medium">
//                                           Status
//                                         </span>
//                                         <span>
//                                           {order.status
//                                             ? order.status.charAt(0) +
//                                               order.status
//                                                 .slice(1)
//                                                 .toLowerCase()
//                                             : "N/A"}
//                                         </span>
//                                       </div>
//                                       <div className="flex justify-between">
//                                         <span className="font-medium">
//                                           Carrier
//                                         </span>
//                                         <span>{"FedEx"}</span>
//                                       </div>
//                                       <div className="flex justify-between gap-4">
//                                         <span className="font-medium">
//                                           Destination
//                                         </span>
//                                         <span className="text-right">
//                                           {order?.address
//                                             ? `${order.address.street}, ${order.address.city}, ${order.address.state}`
//                                             : "Not specified"}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             )}

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch auto-rows-auto pb-4">
//                               <section className="h-full">
//                                 <GeneralInfo
//                                   order_id={order.order_id}
//                                   case_type={order.product_type}
//                                   priority={order.priority.toUpperCase()}
//                                   status={order.status}
//                                 />
//                               </section>

//                               <section className="h-full">
//                                 <Requirments_info
//                                   materials={ordersDetail?.materials}
//                                   shade={order.shade}
//                                   tooth_numbers={order.tooth_numbers}
//                                 />
//                               </section>

//                               <section className="h-full">
//                                 <Billing_info
//                                   price={ordersDetail?.billing?.price}
//                                 />
//                               </section>

//                               <section className="h-full">
//                                 <Shipping address={order?.address} />
//                               </section>

//                               <section className="h-full">
//                                 <Notes
//                                   note={
//                                     order?.design_notes ? order.design_notes : ""
//                                   }
//                                 />
//                               </section>

//                               <section className="h-full">
//                                 {order.image && <Photos data={order.image} />}
//                               </section>
//                             </div>
//                           </div>

//                           <div className="w-full md:w-[32%] lg:w-[28%] xl:w-[45%] h-full">
//                             {order?.image && (
//                               <div className="h-full">
//                                 <File_info
//                                   pathToFile={`${order.image_3d_urls[0]}`}
//                                 />
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </SheetContent>
//                   </TableCell>
//                 </TableRow>
//               </Sheet>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Change Status Dialog — rendered once outside the loop */}
//       <ChangeStatusDialog
//         open={isStatusPopupOpen}
//         onOpenChange={setIsStatusPopupOpen}
//         newStatus={newStatus}
//         onStatusChange={setNewStatus}
//         provider={provider}
//         onProviderChange={setProvider}
//         trackingId={trackingId}
//         onTrackingIdChange={setTrackingId}
//         isOkDisabled={isOkDisabled}
//         isSubmitting={isSubmitting}
//         onCancel={closeChangeStatus}
//         onOk={handleOk}
//       />
//     </>
//   );
// }

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import track from "../../assets/delivery_truck_speed.svg";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

import { BsThreeDotsVertical } from "react-icons/bs";
import GeneralInfo from "./orderSheetDetail/general_info";
import Requirments_info from "./orderSheetDetail/requirements_info";
import File_info from "./orderSheetDetail/file_info";
import Billing_info from "./orderSheetDetail/billing_info";
import Shipping from "./orderSheetDetail/shipping_info";
import Notes from "./orderSheetDetail/notes";
import Photos from "./orderSheetDetail/images";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

import { useLanguage } from "../../language/useLanguage";
import strings from "../../language";

import { useOrders } from "./useOrders";
import ChangeStatusDialog from "./ChangeStatusDialog";
import Pagination from "../../utils/Pagination";

const priorityStyles: Record<string, { badge: string; row?: string }> = {
  MEDIUM: { badge: "bg-blue-100 text-blue-400 border-blue-400" },
  HIGH: { badge: "bg-red-100 text-red-400 border-red-400" },
  LOW: { badge: "bg-gray-100 text-gray-400 border-gray-400" },
};

export default function OrderTable() {
  const { language } = useLanguage();
  const t = strings[language];

  const {
    orders,
    ordersDetail,
    isLoading,
    openOrderId,
    setOpenOrderId,
    openDetails,
    isTrackingOpen,
    setIsTrackingOpen,
    isStatusPopupOpen,
    setIsStatusPopupOpen,
    newStatus,
    setNewStatus,
    provider,
    setProvider,
    trackingId,
    setTrackingId,
    isOkDisabled,
    isSubmitting,
    openChangeStatus,
    closeChangeStatus,
    handleOk,
    // ✅ Added from second code
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    limit,
  } = useOrders();

  const renderSkeletonRows = () =>
    Array.from({ length: limit || 10 }).map((_, idx) => (
      <TableRow key={idx}>
        <TableCell className="text-left">
          <Skeleton className="h-4 w-40 bg-gray-300 dark:bg-gray-700" />
        </TableCell>
        <TableCell className="text-left">
          <Skeleton className="h-4 w-32 bg-gray-300 dark:bg-gray-700" />
        </TableCell>
        <TableCell className="text-left">
          <Skeleton className="h-6 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
        </TableCell>
        <TableCell className="text-left">
          <Skeleton className="h-6 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
        </TableCell>
        <TableCell className="text-left">
          <Skeleton className="h-4 w-28 bg-gray-300 dark:bg-gray-700" />
        </TableCell>
        <TableCell className="text-left">
          <Skeleton className="h-8 w-10 rounded-md bg-gray-300 dark:bg-gray-700" />
        </TableCell>
      </TableRow>
    ));

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-muted/30 flex justify-center items-start">
        <div className="bg-white dark:bg-black border rounded-xl overflow-hidden w-full max-w-6xl mt-6">
          <Table>
            <TableHeader className="bg-gray-300 overflow-hidden">
              <TableRow>
                <TableHead className="text-black text-left pl-4">
                  {t.orderReq.table.headers["sno."]}
                </TableHead>
                <TableHead className="text-black text-left">
                  {t.orderReq.table.headers.h1}
                </TableHead>
                <TableHead className="text-black text-left">
                  {t.orderReq.table.headers.h2}
                </TableHead>
                <TableHead className="text-black text-left">
                  {t.orderReq.table.headers.h3}
                </TableHead>
                <TableHead className="text-black text-left">
                  {t.orderReq.table.headers.h4}
                </TableHead>
                <TableHead className="text-black text-left">
                  {t.orderReq.table.headers.h6}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">{renderSkeletonRows()}</TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-black border rounded-xl overflow-hidden no-scrollbar">
        <Table>
          <TableHeader className="bg-gray-300 overflow-hidden">
            <TableRow>
              <TableHead className="text-black pl-4">
                {t.orderList.table.headers["sno."]}
              </TableHead>
              <TableHead className="text-black">
                {t.orderList.table.headers.h1}
              </TableHead>
              <TableHead className="text-black">
                {t.orderList.table.headers.h2}
              </TableHead>
              <TableHead className="text-black">
                {t.orderList.table.headers.h3}
              </TableHead>
              <TableHead className="text-black">
                {t.orderList.table.headers.h4}
              </TableHead>
              <TableHead className="text-black">
                {t.orderList.table.headers.h6}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-center">
            {orders.map((order, index) => (
              <Sheet
                key={order.order_id}
                open={openOrderId === order.order_id}
                onOpenChange={(open) => {
                  if (open) setOpenOrderId(order.order_id);
                  else setOpenOrderId(null);
                }}
              >
                <TableRow>
                  {/* ✅ Serial number from second code: counts down correctly across pages */}
                  <TableCell className="font-medium text-left pl-4">
                    {999 + total - ((currentPage - 1) * limit + index)}
                  </TableCell>

                  <TableCell className="text-left">
                    {order.product_list}
                  </TableCell>

                  <TableCell className="text-left">
                    <Badge
                      variant="outline"
                      className={`font-semibold ${
                        priorityStyles[order.priority.toUpperCase()]?.badge
                      }`}
                    >
                      {order.priority.toUpperCase()}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-left">
                    <Badge className={`uppercase ${
                      order.status?.toUpperCase() === "SHIPPED"
                        ? "bg-blue-100 border-blue-400 text-blue-600"
                        : "bg-green-100 border-green-400 text-green-600"
                    }`}>
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-left">
                    {new Date(order.expected_delivery)
                      .toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })
                      .replace(/\//g, "-")}
                  </TableCell>

                  <TableCell className="text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-gray-100">
                          <BsThreeDotsVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 bg-white border border-[#BABABA] text-black shadow-lg m-1"
                      >
                        <DropdownMenuItem
                          onClick={() => openDetails(order.order_id)}
                          className="p-2 cursor-pointer focus:bg-black focus:text-white rounded-md"
                        >
                          {t.viewDetail}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => openChangeStatus(order)}
                          className="p-2 cursor-pointer focus:bg-black focus:text-white rounded-md"
                        >
                          {t.changeStatus}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Sheet detail panel */}
                    <SheetContent
                      side="bottom"
                      className="
                        w-full h-[85vh] max-w-none
                        rounded-t-2xl
                        animate-in slide-in-from-bottom
                        bg-white dark:bg-neutral-950
                        border-l
                        flex flex-col
                        overflow-hidden
                      "
                    >
                      <div className="sticky top-0 z-10 bg-white rounded-t-2xl dark:bg-neutral-950 border-b px-6 py-1">
                        <div className="flex items-center justify-between gap-3">
                          <SheetHeader className="space-y-1">
                            <SheetTitle className="text-lg font-semibold">
                              {t.orderList.title}
                            </SheetTitle>
                            <SheetDescription className="text-sm text-muted-foreground">
                              {t.orderList.orderId}: {order.order_id}
                            </SheetDescription>
                          </SheetHeader>
                        </div>
                      </div>

                      <div className="flex-1 px-6 py-4 mt-2 overflow-hidden">
                        <div className="flex gap-5 h-full min-h-0">
                          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar min-h-0">
                            {order.status === "SHIPPED" && (
                              <div className="mb-5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setIsTrackingOpen((prev) => !prev)
                                  }
                                  className="
                                    w-full flex items-center justify-between
                                    rounded-xl border border-[#BABABA]
                                    bg-neutral-50 px-5 py-3
                                    text-left
                                  "
                                >
                                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <img
                                      src={track}
                                      className="h-[28px] w-[28px]"
                                      alt="track"
                                    />
                                    <span>{t.orderList.orderTracking}</span>
                                  </div>

                                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                    <span>
                                      {t.orderList.trackingIdLabel}:&nbsp;{884651036621}
                                    </span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      className={`h-5 w-5 transition-transform ${
                                        isTrackingOpen
                                          ? "rotate-180"
                                          : "rotate-0"
                                      }`}
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"
                                      />
                                    </svg>
                                  </div>
                                </button>

                                {isTrackingOpen && (
                                  <div className="mt-2 rounded-2xl border border-[#BABABA] bg-white px-5 py-4 text-sm text-gray-800">
                                    <div className="flex flex-col gap-1">
                                      <div className="flex justify-between">
                                        <span className="font-medium">{t.orderList.status}</span>
                                        <span>
                                          {order.status
                                            ? order.status.charAt(0) +
                                              order.status.slice(1).toLowerCase()
                                            : "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">{t.orderList.carrier}</span>
                                        <span>{"FedEx"}</span>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <span className="font-medium">{t.orderList.destination}</span>
                                        <span className="text-right">
                                          {order?.address
                                            ? `${order.address.street}, ${order.address.city}, ${order.address.state}`
                                            : "Not specified"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch auto-rows-auto pb-4">
                              <section className="h-full">
                                <GeneralInfo
                                  order_id={order.order_id}
                                  case_type={order.product_type}
                                  priority={order.priority.toUpperCase()}
                                  status={order.status}
                                />
                              </section>

                              <section className="h-full">
                                <Requirments_info
                                  materials={ordersDetail?.materials}
                                  shade={order.shade}
                                  tooth_numbers={order.tooth_numbers}
                                />
                              </section>

                              <section className="h-full">
                                <Billing_info
                                  price={ordersDetail?.billing?.price}
                                />
                              </section>

                              <section className="h-full">
                                <Shipping address={order?.address} />
                              </section>

                              <section className="h-full">
                                <Notes
                                  note={order?.design_notes ? order.design_notes : ""}
                                />
                              </section>

                              <section className="h-full">
                                <Photos data={order.image ?? undefined} imageRepositoryUrls={order?.image_repository_urls} />
                              </section>
                            </div>
                          </div>

                   <div className="w-full md:w-[32%] lg:w-[28%] xl:w-[45%] min-h-0 overflow-y-auto no-scrollbar">
  
                                <File_info
                                  pathToFile={order?.image_3d_urls?.[0]}
                                  imageRepositoryUrls={order?.image_repository_urls}
                                  imageRepositoryIds={order?.image_repository_ids}
                                  orderId={order.order_id}
                                  patientId={order.patient_id}
                                  orderStatus={order.status}
                           />
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </TableCell>
                </TableRow>
              </Sheet>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ✅ Pagination from second code */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => {
          if (page < 1 || page > totalPages) return;
          setCurrentPage(page);
        }}
      />

      {/* Change Status Dialog — rendered once outside the loop */}
      <ChangeStatusDialog
        open={isStatusPopupOpen}
        onOpenChange={setIsStatusPopupOpen}
        newStatus={newStatus}
        onStatusChange={setNewStatus}
        provider={provider}
        onProviderChange={setProvider}
        trackingId={trackingId}
        onTrackingIdChange={setTrackingId}
        isOkDisabled={isOkDisabled}
        isSubmitting={isSubmitting}
        onCancel={closeChangeStatus}
        onOk={handleOk}
      />
    </>
  );
}