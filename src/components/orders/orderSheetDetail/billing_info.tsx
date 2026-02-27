import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../../language/useLanguage";
import strings from "../../../language";

type iBillingPrope = {
  price?: string;
};

export default function Billing_info({ price }: iBillingPrope) {
  const { language } = useLanguage();
  const t = strings[language];
  return (
    <Card
      className="
        
      border-1 border-[#BABABA]
      shadow-sm
      h-full
      "
    >
      <CardHeader>
        <CardTitle
          className="
            text-sm font-semibold uppercase
            text-gray-800
          "
        >
          <div className="flex flex-1 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="h5 w-5"
            >
              <path d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240zM192 448L192 384C192 366.3 206.3 352 224 352L416 352C433.7 352 448 366.3 448 384L448 448C448 465.7 433.7 480 416 480L224 480C206.3 480 192 465.7 192 448zM216 128L264 128C277.3 128 288 138.7 288 152C288 165.3 277.3 176 264 176L216 176C202.7 176 192 165.3 192 152C192 138.7 202.7 128 216 128zM216 224L264 224C277.3 224 288 234.7 288 248C288 261.3 277.3 272 264 272L216 272C202.7 272 192 261.3 192 248C192 234.7 202.7 224 216 224z" />
            </svg>
            <p>{t.orderReqSheet.card4.title}</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-6 text-sm">
        {/* Payment Status */}
        <div className="space-y-1">
          <div className="flex flex-1 gap-2">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="h-5 w-5"
            >
              <path d="M320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z" />
            </svg> */}
            <p className="font-medium text-gray-800">
              {t.orderReqSheet.card4.h1}
            </p>
          </div>
          <Badge
            className="
              bg-amber-100 border-amber-400 text-amber-600 uppercase
            "
          >
            {t.orderReqSheet.card4.pendingStatus}
          </Badge>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <div className="flex flex-1 gap-2">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="h-5 w-5"
            >
              <path d="M96.5 160L96.5 309.5C96.5 326.5 103.2 342.8 115.2 354.8L307.2 546.8C332.2 571.8 372.7 571.8 397.7 546.8L547.2 397.3C572.2 372.3 572.2 331.8 547.2 306.8L355.2 114.8C343.2 102.7 327 96 310 96L160.5 96C125.2 96 96.5 124.7 96.5 160zM208.5 176C226.2 176 240.5 190.3 240.5 208C240.5 225.7 226.2 240 208.5 240C190.8 240 176.5 225.7 176.5 208C176.5 190.3 190.8 176 208.5 176z" />
            </svg> */}
            <p className="font-medium text-emerald-700 dark:text-emerald-300">
              {t.orderReqSheet.card4.h2}
            </p>
          </div>
          <p className="text-emerald-900/80 dark:text-emerald-200 text-base font-semibold">
            ${"200"} <span className="text-sm font-normal">{t.orderReqSheet.card4.usd}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
