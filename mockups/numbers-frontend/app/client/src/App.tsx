import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import VipPortal from "./pages/VipPortal";
import SharedSheet from "./pages/SharedSheet";
import CatalogueBuilder from "./pages/CatalogueBuilder";
import IntakeWizard from "./pages/IntakeWizard";
import LiveRoom from "./pages/LiveRoom";
import SellSheet from "./pages/SellSheet";
import BuySheet from "./pages/BuySheet";
import CashSheet from "./pages/CashSheet";
import ReceiveSheet from "./pages/ReceiveSheet";
import PaySheet from "./pages/PaySheet";
import {
  SalesSheet, InventorySheet, ProcurementSheet,
  FinanceSheet, RelationshipsSheet, CreditSheet, AdminSheet,
  TableBrowser,
} from "./pages/SheetRoutes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      {/* The 7 primary sheets */}
      <Route path="/sales" component={SalesSheet} />
      <Route path="/inventory" component={InventorySheet} />
      <Route path="/procurement" component={ProcurementSheet} />
      <Route path="/finance" component={FinanceSheet} />
      <Route path="/relationships" component={RelationshipsSheet} />
      <Route path="/credit" component={CreditSheet} />
      <Route path="/admin" component={AdminSheet} />

      {/* Reports + VIP */}
      <Route path="/reports" component={Reports} />
      <Route path="/vip" component={VipPortal} />

      {/* Shared (public) catalogue view */}
      <Route path="/s/:token" component={SharedSheet} />

      {/* Ritual sheets — the everyday work */}
      <Route path="/sell/new" component={SellSheet} />
      <Route path="/buy/new" component={BuySheet} />
      <Route path="/cash/new" component={CashSheet} />
      <Route path="/receive/new" component={ReceiveSheet} />
      <Route path="/pay/new" component={PaySheet} />

      {/* Tools */}
      <Route path="/catalogues/:id" component={CatalogueBuilder} />
      <Route path="/intake/new" component={IntakeWizard} />
      <Route path="/live/:id" component={LiveRoom} />

      {/* Generic table browser — every DocType is still accessible */}
      <Route path="/t/:slug" component={TableBrowser} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
