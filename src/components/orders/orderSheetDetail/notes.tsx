import strings from "../../../language";
import { useLanguage } from "../../../language/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

type notes = {
  note: string;
};

export default function Notes({ note }: notes) {
  const { language } = useLanguage();
  const t = strings[language];
  return (
    <Card className="h-full border-1 border-[#BABABA]">
      <CardHeader className="pb-2">
        <CardTitle
          className="text-sm font-semibold uppercase
            text-slate-700"
        >
          {t.orderReqSheet.card6.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="max-h-30 rounded-md px-3 py-1 text-sm text-gray-800 leading-relaxed overflow-y-auto">
          {note ? (
            note
          ) : (
            <span className="text-gray-400 italic">
              {t.orderReqSheet.card6.alt}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
