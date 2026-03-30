import './App.css';
import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import DocumentEditor from './pages/DocumentEditor';
import OrganizationWorkspaces from './pages/OrganizationWorkspaces';

import ProtectedRoute from './components/ProtectedRoute'; 
import { AuthContext } from './features/auth/context/AuthContext'; 

const AuthRoute = () => {
  const { user, isLoading } = useContext(AuthContext);
  
  if (isLoading) return <div>Loading...</div>;
  console.log('here');
  
  if (user) {
    console.log('user');
    
    return <Navigate to="/dashboard" replace/>;

  }
  return <Auth />;
};

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            
            <Route path="/" element={<AuthRoute />} />
            
           
            <Route 
              path="/organizations/:orgId" 
              element={
                <ProtectedRoute>
                  <OrganizationWorkspaces />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/workspace/:workspaceId" 
              element={
                <ProtectedRoute>
                  <Workspace />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/document/:documentId" 
              element={
                <ProtectedRoute>
                  <DocumentEditor />
                </ProtectedRoute>
              } 
            />

          </Routes>
        </BrowserRouter>
     
    </div>
  );
}

export default App;