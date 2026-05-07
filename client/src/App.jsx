import './App.css';
import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import WorkspacePage from './pages/Workspace';
import WorkspaceSettingsPage from './pages/WorkspaceSettings';
import DocumentEditor from './pages/DocumentEditor';
import OrganizationWorkspaces from './pages/Organization';

import ProtectedRoute from './components/ProtectedRoute'; 
import { AuthContext } from './features/auth/context/AuthContext'; 
import {OrganizationSettingsPage} from './features/organizations/pages/OrganizationSettingPage';
import { WorkspaceProvider } from './features/workspace/context/WorkspaceContext.jsx';
import WorkspaceLayout from './features/workspace/layout/WorkspaceLayout.jsx';

const AuthRoute = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Loading...</div>;

  if (user) {
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
            path="/organizations/:orgId/settings" 
            element={
            <ProtectedRoute>
              <OrganizationSettingsPage />
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
                <WorkspaceProvider>
                  <WorkspaceLayout />
                </WorkspaceProvider>
              </ProtectedRoute>
            }
          >     
            <Route index element={<WorkspacePage />} />
            <Route path="settings" element={<WorkspaceSettingsPage />} />
          </Route>

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