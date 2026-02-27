import strings from "../../../language";
import { useLanguage } from "../../../language/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import shipping from "../../../assets/shipping.svg";

interface Address {
  address_type: string;
  entity_type: string;
  house_no: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  id: number;
  user_id: string;
}

type ShippingProps = {
  address?: Address;
};

export default function Shipping({ address }: ShippingProps) {
  const formattedAddress = address
    ? `${address.house_no}, ${address.street}\n${address.city}, ${address.state} - ${address.zipCode}\n${address.country}`
    : "—";
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
          className=" h-full
            text-sm font-semibold uppercase
            text-slate-700 dark:text-slate-300
          "
        >
          <div className="flex flex-1 gap-2">
            <img src={shipping} className="h-5 w-5 brightness-0" alt="track" />
            <p>{t.orderReqSheet.card5.title}</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
        <div>
          <div className="flex flex-1 gap-2">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 640 640"
            >
              <path d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z" />
            </svg> */}
            <p className="font-medium text-slate-600 dark:text-slate-400">
              {t.orderReqSheet.card5.h1}
            </p>
          </div>
          <p className="text-slate-900 dark:text-slate-200">{t.orderReqSheet.card5.courrier}</p>
        </div>
        <div>
          <div className="flex flex-1 gap-2">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="h-4 w-4"
            >
              <path d="M197.8 100.3C208.7 107.9 211.3 122.9 203.7 133.7L147.7 213.7C143.6 219.5 137.2 223.2 130.1 223.8C123 224.4 116 222 111 217L71 177C61.7 167.6 61.7 152.4 71 143C80.3 133.6 95.6 133.7 105 143L124.8 162.8L164.4 106.2C172 95.3 187 92.7 197.8 100.3zM197.8 260.3C208.7 267.9 211.3 282.9 203.7 293.7L147.7 373.7C143.6 379.5 137.2 383.2 130.1 383.8C123 384.4 116 382 111 377L71 337C61.6 327.6 61.6 312.4 71 303.1C80.4 293.8 95.6 293.7 104.9 303.1L124.7 322.9L164.3 266.3C171.9 255.4 186.9 252.8 197.7 260.4zM288 160C288 142.3 302.3 128 320 128L544 128C561.7 128 576 142.3 576 160C576 177.7 561.7 192 544 192L320 192C302.3 192 288 177.7 288 160zM288 320C288 302.3 302.3 288 320 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L320 352C302.3 352 288 337.7 288 320zM224 480C224 462.3 238.3 448 256 448L544 448C561.7 448 576 462.3 576 480C576 497.7 561.7 512 544 512L256 512C238.3 512 224 497.7 224 480zM128 440C150.1 440 168 457.9 168 480C168 502.1 150.1 520 128 520C105.9 520 88 502.1 88 480C88 457.9 105.9 440 128 440z" />
            </svg> */}
            <p className="font-medium text-slate-600 dark:text-slate-400 mb-1">
              {t.orderReqSheet.card5.h2}
            </p>
          </div>
          <p className="text-slate-900 dark:text-slate-200">
            {formattedAddress}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
