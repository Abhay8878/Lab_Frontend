import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "../components/ui/sidebar";
import {
  LayoutDashboardIcon,
  List,
  MessageCircleWarning,
  MessageSquare,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../language/useLanguage";
import strings from "../language";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { chatService } from "../components/chat/services/chatService";
export default function AppSidebar() {
  const { language } = useLanguage();
  const t = strings[language];
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const threads = await chatService.getThreads();
        const total = threads.reduce(
          (acc, thread) => acc + (thread.unreadCount || 0),
          0,
        );
        setUnreadCount(total);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-gray-600 dark:border-gray-800"
    >
      <SidebarHeader
        className="
          flex px-2
          group-data-[state=expanded]:justify-end
          group-data-[state=collapsed]:justify-start
        "
      >
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem className="px-[8px] pb-[4px] pt-[4px]">
            <NavLink to="/" end>
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={t.sidebar.dashboard}
                  className="cursor-pointer  data-[active=true]:bg-black data-[active=true]:text-white"
                >
                  <div
                    className={` flex items-center justify-center rounded-md`}
                  >
                    <LayoutDashboardIcon className="h-4 w-4" />
                  </div>
                  <span className="group-data-[state=collapsed]:hidden">
                    {t.sidebar.dashboard}
                  </span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>

          <SidebarMenuItem className="px-[8px]  pb-[4px] ">
            <NavLink to="/orders" end>
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={t.sidebar.orderList}
                  className="cursor-pointer data-[active=true]:bg-black  data-[active=true]:text-white"
                >
                  <div
                    className={`flex items-center justify-center rounded-md `}
                  >
                    <List className="h-4 w-4" />
                  </div>
                  <span className="group-data-[state=collapsed]:hidden">
                    {t.sidebar.orderList}
                  </span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>

          <SidebarMenuItem className="px-[8px] pb-[4px]">
            <NavLink to="/OrdersRequest" end>
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={t.sidebar.orderRequest}
                  className="cursor-pointer data-[active=true]:bg-black data-[active=true]:text-white"
                >
                  <div className="relative flex items-center justify-center rounded-md">
                    <MessageCircleWarning className="h-4 w-4" />
                  </div>

                  <span className="group-data-[state=collapsed]:hidden">
                    {t.sidebar.orderRequest}
                  </span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
          <SidebarMenuItem className="px-[8px] pb-[4px]">
            <NavLink to="/chat" end>
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={t.sidebar.chat}
                  className="cursor-pointer data-[active=true]:bg-black data-[active=true]:text-white"
                >
                  <div className="flex items-center justify-center rounded-md relative">
                    <MessageSquare className="h-4 w-4" />

                    {unreadCount > 0 && (
                      <span
                        className={cn(
                          "absolute -top-1 -right-1 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold border border-white dark:border-gray-900",
                          unreadCount > 9 ? "px-1 min-w-[18px] h-4" : "h-4 w-4",
                        )}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>

                  <span className="group-data-[state=collapsed]:hidden">
                    {t.sidebar.chat}
                  </span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
