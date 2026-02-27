import { useEffect, useMemo, useState } from "react";

export interface ApiBuffer {
  type: "Buffer";
  data: number[];
}

interface Address {
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

export interface ImageRepoUrl {
  id: string;
  url: string;
  file_type: string | null;
}

export interface Order {
  address: Address;
  order_id: string;
  patient_id: string;
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
  image_3d_urls: string;
  image_repository_ids?: string[] | null;
  image_repository_urls?: ImageRepoUrl[];
  created_at: string;
  updated_at: string;
}

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

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersDetail, setOrdersDetail] = useState<iOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sheet open state
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  // Tracking accordion open state
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Change status dialog state
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [trackingId, setTrackingId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ✅ Pagination state
const [currentPage, setCurrentPage] = useState<number>(1);
const [limit, setLimit] = useState<number>(10);
const [total, setTotal] = useState<number>(0);
const [totalPages, setTotalPages] = useState<number>(0);

useEffect(() => {
  const getOrderList = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:3000/ordersReq/ordersList?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setOrders(data.data ?? []);

      // ✅ SET META DATA FROM API
      setTotal(data.meta?.total ?? 0);
      setTotalPages(data.meta?.totalPages ?? 0);
      setLimit(data.meta?.limit ?? 10);

    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  getOrderList();
}, [currentPage, limit]);
  const openDetails = (orderId: string) => {
    setOpenOrderId(orderId);
  };

  const openChangeStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus("");
    setProvider("");
    setTrackingId("");
    setIsStatusPopupOpen(true);
  };

  const closeChangeStatus = () => {
    setIsStatusPopupOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
    setProvider("");
    setTrackingId("");
    setIsSubmitting(false);
  };

  const isOkDisabled = useMemo(() => {
    if (!selectedOrder) return true;
    if (!newStatus) return true;
    if (newStatus === "SHIPPED") {
      if (!provider) return true;
      if (!trackingId.trim()) return true;
    }
    return isSubmitting;
  }, [selectedOrder, newStatus, provider, trackingId, isSubmitting]);

  const handleOk = async () => {
    if (!selectedOrder) return;

    try {
      setIsSubmitting(true);

      const payload =
        newStatus === "SHIPPED"
          ? {
              orderId: selectedOrder.order_id,
              status: "SHIPPED",
              provider,
              trackingId: trackingId.trim(),
            }
          : {
              orderId: selectedOrder.order_id,
              status: newStatus,
            };

      const res = await fetch("http://localhost:3000/ordersReq/changeStatus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed: ${res.status}`);
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === selectedOrder.order_id
            ? { ...o, status: newStatus }
            : o,
        ),
      );

      closeChangeStatus();
    } catch (e) {
      console.error("Change status error:", e);
      setIsSubmitting(false);
    }
  };

return {
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

  selectedOrder,
  newStatus,
  setNewStatus,
  provider,
  setProvider,
  trackingId,
  setTrackingId,
  isSubmitting,
  isOkDisabled,
  openChangeStatus,
  closeChangeStatus,
  handleOk,

  // ✅ ADD THESE
  currentPage,
  setCurrentPage,
  totalPages,
  total,
  limit,
};
}