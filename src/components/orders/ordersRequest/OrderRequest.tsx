import strings from "../../../language";
import { useLanguage } from "../../../language/useLanguage";
import OrdersReqTable from "./OrderReqTable";
// import { OrdersRequestProvider } from "../../../utils/OrderReqContex";
import { App_config } from "../../../../tailwind.config";
export default function OrdersRequest() {
  const { language } = useLanguage();
  const t = strings[language];
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{t.orderReq.title}</h2>

      <div className="rounded-xl   overflow-hidden bg-background">
        <OrdersReqTable />
            <div className="mt-8 text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()}  {App_config.brandname} {t.app.footer}
              </div>
      </div>
    </div>
  );
}
