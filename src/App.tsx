import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";

import Navbar from "./pages/Navbar";
import AppSidebar from "./pages/AppSidebar";
import Dashboard from "./components/dashboard/Dashboard";
import Orders from "./components/orders/Orders";
import Login from "./components/login/Login";
import ProtectedRoute from "./ProtectedRoute";
import OrdersRequest from "./components/orders/ordersRequest/OrderRequest";
import { OrdersRequestProvider } from "../src/components/orders/ordersRequest/orderReqContex";
import { LanguageProvider } from "./language/LanguageContext";
import ChatPage from "./components/chat/ChatPage";
import { ChatSocketProvider } from "./modules/chat/context/ChatSocketContext";

function AppLayout() {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <OrdersRequestProvider>
          <ProtectedRoute>
            <ChatSocketProvider>
              <div className="h-screen w-screen flex flex-col overflow-hidden text-foreground">
                <Navbar />

                <div className="flex flex-1 min-h-0 w-full overflow-hidden">
                  <AppSidebar />

                  <SidebarInset className="w-full overflow-hidden">
                    <main className="h-full w-full p-6 bg-muted/40 overflow-y-auto">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route
                          path="/OrdersRequest"
                          element={<OrdersRequest />}
                        />

                        <Route path="chat" element={<ChatPage />} />
                      </Routes>
                    </main>
                  </SidebarInset>
                </div>
              </div>
            </ChatSocketProvider>
          </ProtectedRoute>
        </OrdersRequestProvider>
      </SidebarProvider>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
