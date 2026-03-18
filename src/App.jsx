import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import OrderBoard from './components/OrderBoard';
import CreateOrder from './pages/CreateOrder';
import OrderManagement from './pages/OrderManagement';
import Products from './pages/Products';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pantalla pública – sin sidebar */}
        <Route path="/board" element={<OrderBoard />} />

        {/* Panel admin – con sidebar */}
        <Route element={<Layout />}>
          <Route path="/orders/new" element={<CreateOrder />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/products" element={<Products />} />
        </Route>

        {/* Redirect root */}
        <Route path="*" element={<Navigate to="/orders" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
