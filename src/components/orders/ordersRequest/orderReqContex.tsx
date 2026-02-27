import { createContext, useEffect, useState } from "react";
 
export type OrdersRequestContextType = {
  requestCount: number;
  setRequestCount: (count: number) => void;
};
 
export const OrdersRequestContext = createContext<
  OrdersRequestContextType | undefined
>(undefined);
 
export function OrdersRequestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [requestCount, setRequestCount] = useState(0);
 
  // Fetch the real pending-order count on mount so the bell badge
  // is accurate on every section, not just after visiting Requests.
  useEffect(() => {
    fetch("http://localhost:3000/ordersReq?page=1&limit=1", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((json) => setRequestCount(json.meta?.total ?? 0))
      .catch(() => {});
  }, []);
 
  return (
    <OrdersRequestContext.Provider value={{ requestCount, setRequestCount }}>
      {children}
    </OrdersRequestContext.Provider>
  );
}
 