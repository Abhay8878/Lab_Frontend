import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useLanguage } from "../../../language/useLanguage";
import strings from "../../../language";
import ThreeDimensionalViewer from "./stlviewer";
import { X, Plus, Loader2, Layers, ExternalLink } from "lucide-react";

export interface ApiBuffer {
  data: number[];
  type: string;
}

export interface ImageRepoUrl {
  id: string;
  url: string;
  file_type: string | null;
}

const DEXIS_VIEWER_BASE_URL =
  (import.meta as any).env?.VITE_IOS_VIEWER_BASE_URL ||
  "https://meshviewer.cloud.dexis.com//?";

export default function File_info({
  pathToFile,
  imageRepositoryUrls,
  imageRepositoryIds,
  orderId,
  patientId,
  orderStatus,
  onImagesUpdated,
}: {
  data?: ApiBuffer;
  pathToFile?: string;
  imageRepositoryUrls?: ImageRepoUrl[];
  imageRepositoryIds?: string[] | null;
  orderId?: string;
  patientId?: string;
  orderStatus?: string;
  onImagesUpdated?: (newUrls: ImageRepoUrl[]) => void;
}) {
  const { language } = useLanguage();
  const t = strings[language];

  // Local state for displayed images (allows removing from view)
  const [displayedImages, setDisplayedImages] = useState<ImageRepoUrl[]>([]);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isAddingImages, setIsAddingImages] = useState(false);
  const [availableImages, setAvailableImages] = useState<ImageRepoUrl[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [updatingImages, setUpdatingImages] = useState(false);

  // Sync displayed images when props change
  useEffect(() => {
    if (imageRepositoryUrls && imageRepositoryUrls.length > 0) {
      setDisplayedImages(imageRepositoryUrls);
      setRemovedIds(new Set());
      setSelectedIndex(0);
    }
  }, [imageRepositoryUrls]);

  const isRejected = orderStatus?.toUpperCase() === "REJECTED";

  // Visible images = displayed minus removed
  const visibleImages = displayedImages.filter(
    (img) => !removedIds.has(img.id)
  );

  // Keep selectedIndex in bounds
  useEffect(() => {
    if (selectedIndex >= visibleImages.length && visibleImages.length > 0) {
      setSelectedIndex(visibleImages.length - 1);
    }
  }, [visibleImages.length, selectedIndex]);

  // =========================
  // FILE TYPE DETECTION for 3D
  // =========================
  const fileType = useMemo<"stl" | "ply">(() => {
    if (!pathToFile) return "stl";
    const clean = pathToFile.split("?")[0].toLowerCase();
    if (clean.endsWith(".ply")) return "ply";
    return "stl";
  }, [pathToFile]);

  // =========================
  // Open in DEXIS IS Viewer
  // =========================
  const openInViewer = (presignedUrl: string, ft: string | null) => {
    const urlPath = presignedUrl.split("?")[0];
    const lastDot = urlPath.lastIndexOf(".");
    const extensionWithoutDot =
      lastDot >= 0 ? urlPath.substring(lastDot + 1).toLowerCase() : "";

    const projectFormat =
      extensionWithoutDot === "stl" || extensionWithoutDot === "ply"
        ? extensionWithoutDot
        : ft || "image";

    const viewerUrl = `${DEXIS_VIEWER_BASE_URL}projectFormat=${projectFormat}&url=${encodeURIComponent(presignedUrl)}`;
    window.open(
      viewerUrl,
      "_blank",
      "width=1200,height=800,scrollbars=yes,resizable=yes"
    );
  };

  // =========================
  // Remove image handler
  // =========================
  const handleRemoveImage = async (imageId: string) => {
    setRemovedIds((prev) => new Set([...prev, imageId]));
    const newIds = (imageRepositoryIds || []).filter((id) => id !== imageId);

    if (orderId && isRejected) {
      try {
        setUpdatingImages(true);
        const res = await fetch("http://localhost:3000/ordersReq/updateImages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, image_repository_ids: newIds }),
        });
        if (res.ok) {
          const updatedUrls = await res.json();
          if (onImagesUpdated) onImagesUpdated(updatedUrls.data || updatedUrls);
        }
      } catch (e) {
        console.error("Failed to update images:", e);
        setRemovedIds((prev) => {
          const next = new Set(prev);
          next.delete(imageId);
          return next;
        });
      } finally {
        setUpdatingImages(false);
      }
    }
  };

  // =========================
  // Fetch available patient images (for Add)
  // =========================
  const fetchAvailableImages = async () => {
    if (!patientId) return;
    setLoadingAvailable(true);
    try {
      const res = await fetch(
        `http://localhost:3000/ordersReq/patientImages?patientId=${patientId}`
      );
      if (res.ok) {
        const json = await res.json();
        const allImages: ImageRepoUrl[] = json.data || json;
        const currentIds = new Set(
          (imageRepositoryIds || []).filter((id) => !removedIds.has(id))
        );
        setAvailableImages(allImages.filter((img) => !currentIds.has(img.id)));
      }
    } catch (e) {
      console.error("Failed to fetch patient images:", e);
    } finally {
      setLoadingAvailable(false);
    }
  };

  // =========================
  // Add image handler
  // =========================
  const handleAddImage = async (image: ImageRepoUrl) => {
    const currentIds = (imageRepositoryIds || []).filter(
      (id) => !removedIds.has(id)
    );
    const newIds = [...currentIds, image.id];

    setDisplayedImages((prev) => [...prev, image]);
    setAvailableImages((prev) => prev.filter((img) => img.id !== image.id));

    if (orderId && isRejected) {
      try {
        setUpdatingImages(true);
        const res = await fetch("http://localhost:3000/ordersReq/updateImages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, image_repository_ids: newIds }),
        });
        if (res.ok) {
          const updatedUrls = await res.json();
          if (onImagesUpdated) onImagesUpdated(updatedUrls.data || updatedUrls);
        }
      } catch (e) {
        console.error("Failed to add image:", e);
        setDisplayedImages((prev) => prev.filter((img) => img.id !== image.id));
      } finally {
        setUpdatingImages(false);
      }
    }
  };

  // Get the filename from a presigned URL
  const getFileName = (url: string) => {
    return url.split("/").pop()?.split("?")[0] || "Image";
  };

  const selectedImage = visibleImages[selectedIndex];

  return (
    <>
      <Card className="h-auto shadow-sm border border-[#BABABA] ">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase text-gray-800">
            <div className="flex gap-2 pb-2 items-center justify-between">
              <p>{t.orderReqSheet.card3.title}</p>
              {isRejected && (
                <button
                  onClick={() => {
                    setIsAddingImages(!isAddingImages);
                    if (!isAddingImages) fetchAvailableImages();
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={updatingImages}
                >
                  <Plus className="h-4 w-4" />
                  {t.orderReqSheet.card3.addImage || "Add Image"}
                </button>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 px-5 pb-4">
          {/* ========================= */}
          {/* IMAGE REPOSITORY SECTION */}
          {/* ========================= */}
       {visibleImages.length > 0 && (
  <div>
    <h1 className="mb-3 font-semibold text-slate-700">
      {t.orderReqSheet.card3.imageRepo || "Images"}
    </h1>

    {/* ── One button per image, opens directly ── */}
    <div className="flex flex-col gap-2">
      {visibleImages.map((img) => (
        <div key={img.id} className="relative group flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
          
          {/* Filename */}
          <div className="flex items-center gap-2 min-w-0">
            <Layers className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-[11px] text-gray-600 truncate">
              {getFileName(img.url)}
            </span>
          </div>

          {/* Right side: Open button + Remove */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button
              onClick={() => openInViewer(img.url, img.file_type)}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md py-1 px-2 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              {t.orderReqSheet.card3.openUrl}
            </button>

            {isRejected && (
              <button
                onClick={() => handleRemoveImage(img.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
                disabled={updatingImages}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

          {visibleImages.length === 0 && !pathToFile && (
            <p className="text-xs text-muted-foreground">No images available</p>
          )}

          {/* ========================= */}
          {/* ADD IMAGE PICKER */}
          {/* ========================= */}
          {isAddingImages && isRejected && (
            <div className="border-t pt-3">
              <h2 className="text-sm font-semibold text-slate-700 mb-2">
                {(t.orderReqSheet.card3 as any).availableImages || "Available Patient Images"}
              </h2>
              {loadingAvailable ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : availableImages.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  {(t.orderReqSheet.card3 as any).noMoreImages || "No more images available for this patient"}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {availableImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => handleAddImage(img)}
                      className="px-2.5 py-1.5 rounded border border-dashed border-gray-300 flex items-center gap-1.5 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all"
                      disabled={updatingImages}
                    >
                      <Plus className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] font-medium text-gray-500 truncate max-w-[100px]">
                        {getFileName(img.url)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================= */}
          {/* 3D MODEL SECTION */}
          {/* ========================= */}
          {pathToFile && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h1 className="font-semibold text-slate-700">3D Scan</h1>
              </div>
              <div className="rounded-lg border bg-white overflow-hidden w-full">
                <ThreeDimensionalViewer
                  pathToFile={pathToFile}
                  fileType={fileType}
                  width={520}
                  height={360}
                  backgroundColor={0x111111}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
