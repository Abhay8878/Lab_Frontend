import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

import BellIcon from "../assets/notifications.svg";
import { useOrdersRequest } from "../hooks/orderReqHook";
import { useLanguage } from "../language/useLanguage";
import strings from "../language";

export default function Navbar() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = strings[language];
  const { requestCount } = useOrdersRequest();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="h-14 w-full flex items-center justify-between px-10 bg-brand-800 text-white border-b border-white/10 shadow-md">
      <h1 className="text-xl font-semibold tracking-wide">{t.app.title}</h1>

      <div className="flex items-center gap-5">
        {/* Language Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="
                flex items-center justify-center
                h-9 px-3 rounded-md
                
                border border-white/20
                bg-white/10
                text-sm font-medium
                hover:bg-white/30
                outline-none
              "
            >
              {language === "fr" ? "FR" : "EN"}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-32 bg-black border border-white/10 text-white shadow-lg"
          >
            <DropdownMenuLabel>{t.navbar.lang}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem
              onClick={() => setLanguage("en")}
              className="cursor-pointer"
            >
              English (EN)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage("fr")}
              className="cursor-pointer"
            >
              Français (FR)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notification Bell */}
        <button className="relative outline-none">
          <img src={BellIcon} className="h-7 w-7" alt="notifications" />

          {requestCount > 0 && (
            <span
              className="
                absolute
                -top-1
                -right-1
                min-w-[20px]
                h-[20px]
                px-1
                rounded-full
                bg-[#DF7B05]
                text-white
                text-[11px]
                font-semibold
                flex
                items-center
                justify-center
              "
            >
              {requestCount}
            </span>
          )}
        </button>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-none">
              <Avatar className="h-9 w-9 border border-white/20 hover:border-white transition">
                <AvatarFallback className="bg-neutral-800 text-white font-medium">
                  U
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-44 bg-black border border-white/10 text-white shadow-lg"
          >
            <DropdownMenuLabel>{t.navbar.account.header}</DropdownMenuLabel>

            <DropdownMenuItem disabled>User</DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/20" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-500 hover:bg-red-500/50 hover:text-white focus:bg-red-500/60 focus:text-white"
            >
              {t.navbar.account.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
