import strings from "../../../language";
import { useLanguage } from "../../../language/useLanguage";
import OrdersReqTable from "./OrderReqTable";
import { OrdersRequestProvider } from "../../../utils/OrderReqContex";

export default function OrdersRequest() {
  const { language } = useLanguage();
  const t = strings[language];
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{t.orderReq.title}</h2>

      <div className="rounded-xl border-2 border-gray-100 overflow-hidden bg-background">
        <OrdersReqTable />
      </div>
    </div>
  );
}
