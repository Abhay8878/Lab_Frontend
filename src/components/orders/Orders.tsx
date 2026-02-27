import strings from "../../language";
import { useLanguage } from "../../language/useLanguage";
import OrdersTable from "./OrderTable";
import { App_config } from "../../../tailwind.config";
export default function Orders() {
  const { language } = useLanguage();
  const t = strings[language];
  return (
    <div className="space-y-4 ">
      <h2 className="text-2xl font-semibold">{t.orderList.title}</h2>

      <div className="rounded-xl border-2 border-gray-100 overflow-hidden bg-background ">
        <OrdersTable />
            <div className="mt-8 text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()}  {App_config.brandname} All rights Reserved
              </div>
      </div>
    </div>
  );
}
