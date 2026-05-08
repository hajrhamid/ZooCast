import { createBrowserRouter } from "react-router-dom";

import { Login } from "./components/Login";

import { DashboardLayout } from "./components/staff/DashboardLayout";
import { DashboardOverview } from "./components/staff/DashboardOverview";
import { CurrentMonitoring } from "./components/staff/CurrentMonitoring";
import { HistoricalData } from "./components/staff/HistoricalData";
import { AlertsNotifications } from "./components/staff/AlertsNotifications";
import { WeatherReports } from "./components/staff/WeatherReports";

import { Dashboard } from "./components/admin/Dashboard";

import { HistoricalLogger } from "./components/HistoricalLogger";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },

  {
    path: "/dashboard",
    Component: () => (
      <>
        <HistoricalLogger />
        <DashboardLayout />
      </>
    ),

    children: [
      { index: true, Component: DashboardOverview },
      { path: "monitoring", Component: CurrentMonitoring },
      { path: "historical", Component: HistoricalData },
      { path: "alerts", Component: AlertsNotifications },
      { path: "reports", Component: WeatherReports },
    ],
  },

  {
    path: "/admin",
    Component: () => <Dashboard onLogout={() => {}} />,
  },
]);