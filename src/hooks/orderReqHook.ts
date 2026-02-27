import { useContext } from "react";
import { OrdersRequestContext } from "../components/orders/ordersRequest/orderReqContex";

export function useOrdersRequest() {
  const ctx = useContext(OrdersRequestContext);

  if (!ctx) {
    throw new Error(
      "useOrdersRequest must be used inside OrdersRequestProvider"
    );
  }

  return ctx;
}