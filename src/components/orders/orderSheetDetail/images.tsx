import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useLanguage } from "../../../language/useLanguage";
import strings from "../../../language";
import { ExternalLink, Layers } from "lucide-react";

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

export default function Photos({
  data,
  imageRepositoryUrls,
}: {
  data?: ApiBuffer;
  imageRepositoryUrls?: ImageRepoUrl[];
}) {
  const { language } = useLanguage();
  const t = strings[language];

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // =========================
  // PHOTO LOGIC (from bytea data)
  // =========================
  useState(() => {
    if (!data || !data.data?.length) {
      setPhotoUrl(null);
      return;
    }
    const bytes = new Uint8Array(data.data);
    const blob = new Blob([bytes], { type: data.type || "image/png" });
    setPhotoUrl(URL.createObjectURL(blob));
  });

  // =========================
  // Open in DEXIS IS Viewer
  // =========================
  const openInViewer = (presignedUrl: string, ft: string | null) => {
    const urlPath = presignedUrl.split("?")[0];
    const lastDot = urlPath.lastIndexOf(".");
    const ext = lastDot >= 0 ? urlPath.substring(lastDot + 1).toLowerCase() : "";

    const projectFormat =
      ext === "stl" || ext === "ply" ? ext : ft || "image";

    const viewerUrl = `${DEXIS_VIEWER_BASE_URL}projectFormat=${projectFormat}&url=${encodeURIComponent(presignedUrl)}`;
    window.open(viewerUrl, "_blank", "width=1200,height=800,scrollbars=yes,resizable=yes");
  };

  const getFileName = (url: string) =>
    url.split("/").pop()?.split("?")[0] || "Image";

  const urls = imageRepositoryUrls || [];

  return (
    <>
      <Card className="h-full shadow-sm border border-[#BABABA]">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase text-gray-800">
            <div className="flex gap-2 pb-2 items-center">
              <p>{t.orderReqSheet.card3.title}</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 px-5 pb-4">
          {/* ── Uploaded Photo (bytea) ── */}
          {photoUrl && (
            <div>
              <h1 className="mb-2 font-semibold text-slate-700">{(t.orderReqSheet.card3 as any).uploadedPhoto || "Uploaded Photo"}</h1>
              <button onClick={() => setPreview(photoUrl)} className="group text-left">
                <div className="aspect-square w-24 rounded border overflow-hidden bg-white">
                  <img
                    src={photoUrl}
                    alt="preview"
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              </button>
            </div>
          )}

          {/* ── Image Repository URLs (2×2 grid) ── */}
     {/*     {urls.length > 0 && (
            <div>
              <h1 className="mb-2 font-semibold text-slate-700">{(t.orderReqSheet.card3 as any).imageRepo || "Images"}</h1>
              <div className="grid grid-cols-2 gap-2">
                {urls.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedIndex(selectedIndex === idx ? null : idx)}
                    className={`px-2.5 py-2 rounded border flex items-center gap-1.5 bg-white transition-all text-left
                      ${selectedIndex === idx
                        ? "border-blue-400 bg-blue-50 ring-1 ring-blue-300"
                        : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <span className="text-[10px] font-medium text-gray-600 truncate">
                      {getFileName(img.url)}
                    </span>
                  </button>
                ))}
              </div> 

              {selectedIndex !== null && urls[selectedIndex] && (
                <div className="mt-3 flex items-center justify-between rounded-lg border bg-white p-2.5">
                  <span className="text-[11px] text-gray-500 truncate max-w-[55%]">
                    {getFileName(urls[selectedIndex].url)}
                  </span>
                  <button
                    onClick={() =>
                      openInViewer(
                        urls[selectedIndex!].url,
                        urls[selectedIndex!].file_type
                      )
                    }
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md py-1.5 px-3 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {(t.orderReqSheet.card3 as any).openUrl || "Open URL"}
                  </button>
                </div>
              )}
            </div>
          )} */}

          {/* ── Empty state ── */}
          {!photoUrl && urls.length === 0 && (
            <p className="text-xs text-muted-foreground">
              {t.orderReqSheet.card3.alt}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Full-screen preview overlay ── */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setPreview(null)}
        >
          <div className="max-w-3xl max-h-[80vh] p-2 bg-white rounded shadow">
            <img
              src={preview}
              alt="Full Preview"
              className="max-h-[75vh] w-auto rounded"
            />
          </div>
        </div>
      )}
    </>
  );
}
