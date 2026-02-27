import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useOrdersRequest } from "../../../hooks/orderReqHook";
import warning from "../../../assets/error.svg";
import accepted from "../../../assets/Icon.svg";

import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";

import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useLanguage } from "../../../language/useLanguage";
import strings from "../../../language";
import Pagination from "../../../utils/Pagination";
import OrderReqDetails from "./OrderReqDetail";

export interface iOrders {
  order_id: string;
  clinic_id: string;
  doctor_id: string;
  patient_id: string;
  case_type: string;
  shade: string;
  tooth_numbers: string[];
  priority: string;
  status: string;
  order_date: string;
  expected_delivery: string;
  design_notes: string;
}

export interface OrderFile {
  id: string;
  order_id: string;
  file_type: string;
  file_name: string;
}

export interface OrderMaterial {
  id: number;
  order_id: string;
  material_key: string;
  material_value: string;
}

export interface OrderBilling {
  order_id: string;
  payment_status: string;
  price: string;
  currency: string;
}

export interface OrderShipping {
  order_id: string;
  method: string;
  address: string;
  tracking_number: string;
}

export interface iOrderDetail {
  order: iOrders;
  files: OrderFile[];
  materials: OrderMaterial[];
  billing: OrderBilling;
  shipping: OrderShipping;
}

export interface ApiBuffer {
  type: "Buffer";
  data: number[];
}

interface address {
  address_type: string;
  city: string;
  country: string;
  entity_type: string;
  house_no: string;
  id: number;
  state: string;
  street: string;
  user_id: string;
  zipCode: string;
}
export interface Image3DItem {
  content_type: string;
  file_name: string;
  file_size: number;
  order_id: string;
  patient_id: string;
  s3_bucket: string;
  s3_key: string;
  uploaded_at: string;
  s3_url?: string;
  url?: string;
}
export interface ImageRepoUrl {
  id: string;
  url: string;
  file_type: string | null;
}
export interface Order {
  address: address;
  order_id: string;
  patient_id: string;
  image_3d_urls: string[];
  product_list: string;
  product_type: string;
  shade: string;
  tooth_numbers: string[];
  priority: string;
  status: string;
  order_date: string;
  expected_delivery: string;
  design_notes?: string;
  image?: ApiBuffer | null;
  image_mime_type?: string | null;
  image_3d: Image3DItem[];
  image_repository_ids?: string[] | null;
  image_repository_urls?: ImageRepoUrl[];
  created_at: string;
  updated_at: string;
}
type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
const priorityStyles: Record<string, { badge: string; row?: string }> = {
  MEDIUM: { badge: "bg-blue-100 text-blue-400 border-blue-400" },
  HIGH: { badge: "bg-red-100 text-red-400 border-red-400" },
  LOW: { badge: "bg-gray-100 text-gray-400 border-gray-400" },
};

const statusStyles: Record<string, { badge: string; row?: string }> = {
  PENDING: { badge: "bg-amber-100 border-amber-400 text-amber-600 uppercase" },
};

export default function OrdersReqTable() {
  const MAX_REASON_LENGTH = 300;
  const [isReasonLimitReached, setIsReasonLimitReached] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const { setRequestCount } = useOrdersRequest();
  const [ordersDetail] = useState<iOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [approvedToast, setApprovedToast] = useState(false);

  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = strings[language];
  const [confirmAcceptId, setConfirmAcceptId] = useState<string | null>(null);
  const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null);

  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [total, setTotal] = useState(0);

  const handleAccept = async (orderId: string) => {
    const response = await fetch(
      `http://localhost:3000/ordersReq/orderStatusAccept?orderReqId=${orderId}&Type=FedEx&trackingNo=884651036621`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderReqId: orderId }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Decrement real total → bell always matches server record count
    setTotal((prev) => {
      const newTotal = Math.max(0, prev - 1);
      setRequestCount(newTotal);
      return newTotal;
    });
    setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
    setApprovedToast(true);
    setTimeout(() => setApprovedToast(false), 5000);
  };

  const handleReject = async (reason: string, orderId: string) => {
    const response = await fetch(
      `http://localhost:3000/ordersReq/orderStatusReject?orderReqId=${orderId}&comment=${reason}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderReqId: orderId, comment: reason }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Same fix for reject
    setTotal((prev) => {
      const newTotal = Math.max(0, prev - 1);
      setRequestCount(newTotal);
      return newTotal;
    });
    setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
    setOpenOrderId(null);
  };

  const fetchOrders = async (page: number) => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `http://localhost:3000/ordersReq?page=${page}&limit=${PAGE_SIZE}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const json: PaginatedResponse<Order> = await res.json();

      setOrders(json.data);
      setTotal(json.meta.total);
      setRequestCount(json.meta.total); // initialise bell from server truth
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const renderSkeletonRows = () => {
    return Array.from({ length: 10 }).map((_, idx) => (
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-muted/30 flex justify-center items-start">
        <div className="bg-white dark:bg-black border rounded-xl overflow-hidden w-full max-w-6xl mt-6">
          <Table>
            <TableHeader className="bg-brand-100 overflow-hidden">
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
            <TableBody className="text-center">
              {renderSkeletonRows()}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {approvedToast && (
        <div className="fixed right-6 top-20 z-50">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-lg min-w-[260px]">
            <span className="flex items-center justify-center">
              <img src={accepted} className="h-7 w-7" alt="approved" />
            </span>
            <div className="flex-1 text-sm">
              <span className="text-gray-500">{t.toast.orderApproved} </span>
              <span className="text-black">{t.toast.approved}</span>
            </div>
            <button
              className="ml-2 text-emerald-700 hover:text-emerald-900"
              onClick={() => setApprovedToast(false)}
            >
              <span className="sr-only">{t.close}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="currentColor" d="M18 6.41L17.59 6 12 11.59 6.41 6 6 6.41 11.59 12 6 17.59 6.41 18 12 12.41 17.59 18 18 17.59 12.41 12z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-black border rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-brand-100 overflow-hidden">
            <TableRow>
              <TableHead className="text-black pl-4">
                {t.orderReq.table.headers["sno."]}
              </TableHead>
              <TableHead className="text-black">
                {t.orderReq.table.headers.h1}
              </TableHead>
              <TableHead className="text-black">
                {t.orderReq.table.headers.h2}
              </TableHead>
              <TableHead className="text-black">
                {t.orderReq.table.headers.h3}
              </TableHead>
              <TableHead className="text-black">
                {t.orderReq.table.headers.h4}
              </TableHead>
              <TableHead className="text-black">
                {t.orderReq.table.headers.h6}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {orders.map((order, index) => (
              <OrderReqDetails
                key={order.order_id}
                order={order}
                ordersDetail={ordersDetail}
                openOrderId={openOrderId}
                setOpenOrderId={setOpenOrderId}
                onReject={(orderId: string) => {
                  setOpenOrderId(null);
                  setConfirmRejectId(orderId);
                  setRejectReason("");
                  setRejectError(false);
                }}
                onAccept={(orderId: string) => {
                  setOpenOrderId(null);
                  setConfirmAcceptId(orderId);
                }}
              >
                <TableRow>
                  <TableCell className="font-medium text-left pl-4">
                    {999 + total - ((currentPage - 1) * PAGE_SIZE + index)}
                  </TableCell>
                  <TableCell className="text-left">
                    {order.product_list}
                  </TableCell>
                  <TableCell className="text-left">
                    <Badge
                      variant="outline"
                      className={`font-semibold ${priorityStyles[order.priority.toUpperCase()]?.badge} pb-1`}
                    >
                      {order.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <Badge
                      variant="outline"
                      className={`font-semibold ${statusStyles[order.status.toUpperCase()]?.badge} pb-1`}
                    >
                      {order.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    {new Date(order.order_date)
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
                        <Button
                          variant="outline"
                          className="bg-gray-200"
                        >
                          <BsThreeDotsVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 bg-white border border-[#BABABA] text-black shadow-lg m-1"
                      >
                        <DropdownMenuItem
                          onClick={() => setOpenOrderId(order.order_id)}
                          className="p-2 cursor-pointer focus:bg-black focus:text-white rounded-md"
                        >
                          {t.viewDetail}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </OrderReqDetails>
            ))}
          </TableBody>
        </Table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (page < 1 || page > totalPages) return;
            setCurrentPage(page);
          }}
        />

        {/* Accept Dialog */}
        <AlertDialog
          open={!!confirmAcceptId}
          onOpenChange={(open) => { if (!open) setConfirmAcceptId(null); }}
        >
          <AlertDialogContent className="max-w-sm">
            <AlertDialogHeader className="items-center text-center">
              <div className="mb-3 w-full flex justify-center">
                <div className="rounded-full border flex items-center justify-center">
                  <img src={warning} className="h-7 w-7" alt="warning" />
                </div>
              </div>
              <AlertDialogTitle className="pl-10">
                {t.ifAccepts.heading}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex w-full justify-center gap-4 sm:justify-center">
              <AlertDialogCancel
                className="w-32 border border-gray-400 bg-white text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  if (confirmAcceptId) setOpenOrderId(confirmAcceptId);
                  setConfirmAcceptId(null);
                }}
              >
                {t.ifAccepts.no}
              </AlertDialogCancel>
              <AlertDialogAction
                className="w-32 bg-black text-white hover:bg-black/90"
                onClick={async () => {
                  if (confirmAcceptId) await handleAccept(confirmAcceptId);
                  setConfirmAcceptId(null);
                }}
              >
                {t.ifAccepts.yes}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Dialog */}
        <AlertDialog
          open={!!confirmRejectId}
          onOpenChange={(open) => {
            if (!open) { setConfirmRejectId(null); setRejectError(false); }
          }}
        >
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader className="items-center text-center">
              <div className="mb-3 w-full flex justify-center">
                <div className="rounded-full border flex items-center justify-center">
                  <img src={warning} className="h-7 w-7" alt="warning" />
                </div>
              </div>
              <AlertDialogTitle className="pl-11">
                {t.ifRejects.heading}
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="mt-2">
              <textarea
                value={rejectReason}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= MAX_REASON_LENGTH) {
                    setRejectReason(value);
                    if (value.trim()) setRejectError(false);
                    setIsReasonLimitReached(value.length === MAX_REASON_LENGTH);
                  }
                }}
                placeholder={t.ifRejects.placeholder}
                maxLength={MAX_REASON_LENGTH}
                className={`mt-1 w-full min-h-[90px] rounded-md px-3 py-2 text-sm border focus:outline-none ${
                  rejectError || isReasonLimitReached ? "border-red-500" : "border-gray-700"
                }`}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className={isReasonLimitReached ? "text-red-500 font-medium" : "text-gray-500"}>
                  {rejectReason.length}/{MAX_REASON_LENGTH} {t.characters}
                </span>
                {isReasonLimitReached && (
                  <span className="text-red-500">
                    {t.charLimitReached} (max {MAX_REASON_LENGTH}).
                  </span>
                )}
              </div>
              {rejectError && (
                <p className="mt-1 text-xs text-red-500">{t.ifRejects.err}</p>
              )}
            </div>

            <AlertDialogFooter className="flex w-full justify-center gap-4 sm:justify-center mt-3">
              <AlertDialogCancel
                className="w-32 border border-gray-400 bg-white text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  if (confirmRejectId) setOpenOrderId(confirmRejectId);
                  setConfirmRejectId(null);
                  setRejectReason("");
                  setRejectError(false);
                  setIsReasonLimitReached(false);
                }}
              >
                {t.cancel}
              </AlertDialogCancel>
              <AlertDialogAction
                className="w-32 bg-black text-white hover:bg-black/90"
                onClick={async (event) => {
                  if (!rejectReason.trim()) {
                    event.preventDefault();
                    setRejectError(true);
                    return;
                  }
                  if (confirmRejectId) {
                    await handleReject(rejectReason, confirmRejectId);
                  }
                  setConfirmRejectId(null);
                  setRejectReason("");
                  setRejectError(false);
                  setIsReasonLimitReached(false);
                }}
              >
                {t.reject}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}