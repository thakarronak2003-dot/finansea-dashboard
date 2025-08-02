import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import RequireAuth  from "../services/RequireAuth"
import OrderExecution from "./pages/OrderExecution";
import Portfolio from "./pages/Portfolio";
import Charts from "./pages/Charts";
import News from "./pages/News";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* App routes with layout */}
            <Route path="/*" element={
              <RequireAuth>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/orders" element={<OrderExecution />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/charts" element={<Charts />} />
                    <Route path="/reports" element={<Charts />} />
                    <Route path="/news" element={<News />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
              </RequireAuth>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
