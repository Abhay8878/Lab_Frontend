import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useLanguage } from "../../language/useLanguage";
import strings from "../../language";

interface ChangeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newStatus: string;
  onStatusChange: (status: string) => void;
  provider: string;
  onProviderChange: (provider: string) => void;
  trackingId: string;
  onTrackingIdChange: (id: string) => void;
  isOkDisabled: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onOk: () => void;
}

export default function ChangeStatusDialog({
  open,
  onOpenChange,
  newStatus,
  onStatusChange,
  provider,
  onProviderChange,
  trackingId,
  onTrackingIdChange,
  isOkDisabled,
  isSubmitting,
  onCancel,
  onOk,
}: ChangeStatusDialogProps) {
  const { language } = useLanguage();
  const t = strings[language];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t.ifChangeStatus.heading}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {t.ifChangeStatus.desc}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Status dropdown */}
        <div className="mt-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            {t.ifChangeStatus.status}{" "}
            <span className="text-red-600">*</span>
          </label>

          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            value={newStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">
              {t.ifChangeStatus.selectStatus}
            </option>

            <option value="SHIPPED">
              {t.ifChangeStatus.shipped}
            </option>
          </select>
        </div>

        {/* Shipping details */}
        {newStatus === "SHIPPED" && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {t.ifChangeStatus.provider}{" "}
                <span className="text-red-600">*</span>
              </label>

              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                value={provider}
                onChange={(e) => onProviderChange(e.target.value)}
              >
                <option value="">
                  {t.ifChangeStatus.selectProvider}
                </option>

                <option value="FedEx">
                  {t.ifChangeStatus.FedEx}
                </option>

                <option value="UPS">
                  UPS
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {t.ifChangeStatus.trackingId}{" "}
                <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                value={trackingId}
                onChange={(e) =>
                  onTrackingIdChange(e.target.value)
                }
                placeholder={
                  t.ifChangeStatus.enterTrackingId
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        )}

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={onCancel}>
            {t.cancel}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onOk}
            disabled={isOkDisabled}
          >
            {isSubmitting ? t.saving : t.ok}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}