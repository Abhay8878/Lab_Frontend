import LabDashboard from "./LabDashboard";
import { App_config } from "../../../tailwind.config";
export default function Dashboard() {
  return (
    <div>
      <LabDashboard />
      <div className="mt-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()}  {App_config.brandname} All rights Reserved
      </div>
    </div>
  );
}
