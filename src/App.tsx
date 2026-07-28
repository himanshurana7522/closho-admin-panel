import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Stores } from '@/pages/Stores';
import { Products } from '@/pages/Products';
import { ProductCreate } from '@/pages/ProductCreate';
import { Stock } from '@/pages/Stock';
import { Orders } from '@/pages/Orders';
import { OrderDetail } from '@/pages/OrderDetail';
import { Reels } from '@/pages/Reels';
import { Coupons } from '@/pages/Coupons';
import { Customers } from '@/pages/Customers';
import { Settings } from '@/pages/Settings';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="stores" element={<Stores />} />
              
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProductCreate />} />
              <Route path="products/:id/edit" element={<ProductCreate />} />
              
              <Route path="stock" element={<Stock />} />
              
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              
              <Route path="reels" element={<Reels />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="customers" element={<Customers />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster theme="dark" position="top-right" richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
