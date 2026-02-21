import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import OpenAccount from './pages/OpenAccount';
import TransferFunds from './pages/TransferFunds';
import Transactions from './pages/Transactions';
import Admin from './pages/Admin';
import LoanRequest from './pages/LoanRequest';
import Settings from './pages/Settings';
import BillPay from './pages/BillPay';
import AdminLogin from './pages/AdminLogin';
import AccountDetails from './pages/AccountDetails';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 mt-16">
          {/* Main Content Area */}
          <main className="flex-1 p-6 z-10 w-full max-w-7xl mx-auto">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div className="flex w-full gap-6">
                    <Sidebar className="hidden md:block w-64 flex-shrink-0" />
                    <div className="flex-1">
                      <Dashboard />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/accounts/:id" element={
                <ProtectedRoute>
                  <div className="flex w-full gap-6">
                    <Sidebar className="hidden md:block w-64 flex-shrink-0" />
                    <div className="flex-1">
                      <AccountDetails />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/open-account" element={
                <ProtectedRoute>
                  <div className="flex w-full gap-6">
                    <Sidebar className="hidden md:block w-64 flex-shrink-0" />
                    <div className="flex-1">
                      <OpenAccount />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/transfer" element={
                <ProtectedRoute>
                  <div className="flex w-full gap-6">
                    <Sidebar className="hidden md:block w-64 flex-shrink-0" />
                    <div className="flex-1">
                      <TransferFunds />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/bill-pay" element={
                <ProtectedRoute>
                  <div className="flex w-full gap-6">
                    <Sidebar className="hidden md:block w-64 flex-shrink-0" />
                    <div className="flex-1">
                      <BillPay />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/transactions" element={
                <ProtectedRoute>
                  <div className="flex w-full gap-6">
                    <Sidebar className="hidden md:block w-64 flex-shrink-0" />
                    <div className="flex-1">
                      <Transactions />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/loan-request" element={
                <ProtectedRoute>
                  <div className="flex w-full gap-6">
                    <Sidebar className="hidden md:block w-64 flex-shrink-0" />
                    <div className="flex-1">
                      <LoanRequest />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute>
                  <div className="flex w-full gap-6">
                    <Sidebar className="hidden md:block w-64 flex-shrink-0" />
                    <div className="flex-1">
                      <Settings />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
