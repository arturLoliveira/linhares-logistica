import './index.css';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import Layout from './components/layout'; 
import ProtectedRoute from './components/protectedRoute'; 
import AdminLayout from './components/admin-layout'; 


import HomePage from './pages/HomePage';
import AreaCliente from './components/area-cliente';
import AdminLogin from './pages/adminLogin';


import AdminOverview from './pages/adminOverview';
import AdminColetas from './pages/adminColetas';
import AdminDevolucoes from './pages/adminDevolucoes';
import AdminClientes from './pages/adminClientes';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route path="/area-cliente" element={<AreaCliente />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="coletas" element={<AdminColetas />} />
          <Route path="devolucoes" element={<AdminDevolucoes />} />
          <Route path="clientes" element={<AdminClientes />} />
          
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;