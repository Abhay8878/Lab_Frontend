
import type { ReactNode } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import GeneralInfo from "../../../components/orders/orderSheetDetail/general_info";
import Requirments_info from "../../../components/orders/orderSheetDetail/requirements_info";
import File_info from "../../../components/orders/orderSheetDetail/file_info";
import Billing_info from "../../../components/orders/orderSheetDetail/billing_info";
import Shipping from "../../../components/orders/orderSheetDetail/shipping_info";
import Notes from "../../../components/orders/orderSheetDetail/notes";
import Photos from "../../../components/orders/orderSheetDetail/images";
import { useLanguage } from "../../../language/useLanguage";
import strings from "../../../language";
import type { iOrderDetail, Order } from "./OrderReqTable"

interface OrderReqDetailsProps {
  order: Order;
  ordersDetail?: iOrderDetail | null;
  openOrderId: string | null;
  setOpenOrderId: (id: string | null) => void;
  onReject: (orderId: string) => void;
  onAccept: (orderId: string) => void;
  children: ReactNode; // The full <TableRow> including the SheetTrigger cell
}

export default function OrderReqDetails({
  order,
  ordersDetail,
  openOrderId,
  setOpenOrderId,
  onReject,
  onAccept,
  children,
}: OrderReqDetailsProps) {
  const { language } = useLanguage();
  const t = strings[language];

  return (
    <Sheet
      open={openOrderId === order.order_id}
      onOpenChange={(open) => {
        if (open) setOpenOrderId(order.order_id);
        else setOpenOrderId(null);
      }}
    >
      {/* Full TableRow with SheetTrigger button inside last cell */}
      {children}

      <SheetContent
        side="bottom"
        className="
          w-full h-[85vh] max-w-none
          rounded-t-2xl
          animate-in slide-in-from-bottom
          bg-white dark:bg-neutral-950
          border-l
          flex flex-col overflow-hidden"
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white rounded-t-2xl dark:bg-neutral-950 border-b px-6 py-1">
          <div className="flex items-center justify-between gap-3">
            <SheetHeader className="space-y-1">
              <SheetTitle className="text-lg font-semibold">
                {t.orderReqSheet.title}
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                {t.orderReqSheet.orderId}: {order.order_id}
              </SheetDescription>
            </SheetHeader>

            {/* Buttons row */}
            <div className="mt-2 flex justify-end gap-2">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="border-brand-button border text-brand-button hover:bg-brand-button/70 hover:text-white dark:border-[#B84836]/90 dark:text-[#B84836] w-30"
                  onClick={() => {
                    setOpenOrderId(null);
                    onReject(order.order_id);
                  }}
                >
                  {t.reject}
                </Button>
              </SheetClose>

              <Button
                variant="outline"
                className="border-brand-button bg-brand-button text-white hover:bg-brand-button/70 hover:text-white dark:border-[#348641] dark:text-[#348641] w-30"
                onClick={() => {
                  setOpenOrderId(null);
                  onAccept(order.order_id);
                }}
              >
                {t.accept}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-4 mt-2 overflow-hidden">
          <div className="flex gap-5 h-full">
            <div className="flex-1 overflow-y-auto pr-1 no-scrollbar">
              <div className="grid grid-cols-2 gap-5 items-stretch auto-rows-auto pb-4">
                <section className="h-full">
                  <GeneralInfo
                    order_id={order.order_id}
                    case_type={order.product_type}
                    priority={order.priority.toUpperCase()}
                    status={order.status}
                  />
                </section>

                <section className="h-full">
                  <Requirments_info
                    materials={ordersDetail?.materials}
                    shade={order.shade}
                    tooth_numbers={order.tooth_numbers}
                  />
                </section>

                <section className="h-full">
                  <Billing_info price={ordersDetail?.billing?.price} />
                </section>

                <section className="h-full">
                  <Shipping address={order.address} />
                </section>

                <section className="h-full">
                  <Notes note={order?.design_notes ? order.design_notes : ""} />
                </section>

                <section className="h-full">
                  <Photos data={order.image ?? undefined} imageRepositoryUrls={order?.image_repository_urls} />
                </section>
              </div>
            </div>

            <div className="w-full md:w-[32%] lg:w-[28%] xl:w-[40%] h-full overflow-y-auto">
              <div className="">
                <File_info
                  pathToFile={order?.image_3d_urls?.[0]}
                  imageRepositoryUrls={order.image_repository_urls}
                  imageRepositoryIds={order.image_repository_ids}
                  orderId={order.order_id}
                  patientId={order.patient_id}
                  orderStatus={order.status}
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}