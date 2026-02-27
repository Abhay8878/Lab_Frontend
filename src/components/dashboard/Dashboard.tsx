import LabDashboard from "./LabDashboard";
import { App_config } from "../../../tailwind.config";
import { useLanguage } from "../../language/useLanguage";
import strings from "../../language";
export default function Dashboard() {
   const { language } = useLanguage();
  const t = strings[language];
  return (
    <div>
      <LabDashboard />
      <div className="mt-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()}  {App_config.brandname} {t.app.footer}
      </div>
    </div>
  );
}
