import { useState } from 'react';
import DashboardHeader from '../features/dashboard/components/DashboardHeader';
import WorkspacesTab from '../features/dashboard/components/WorkspacesTab';
import OrganizationsTab from '../features/organizations/components/OrganizationsTab';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('workspaces');

  const baseTabClass = "px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] border-r border-border transition-colors duration-150";

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

        <div className="px-8 flex gap-0 border-t border-border">
        {['workspaces','organizations'].map((tab)=>(
           <button

          key={`${tab}-tab`}
          onClick={() => setActiveTab(tab)}
          className={`${baseTabClass} ${activeTab === tab ? 'bg-text-primary text-white' : 'bg-white text-text-secondary hover:bg-surface'}`}
        >
          {tab}
        </button>
        ))}
      </div>

      <main className="p-8">
        {activeTab === 'workspaces' && <WorkspacesTab />}
        
        {activeTab === 'organizations' && (
          <OrganizationsTab />
        )}  
      </main>  
    </div>
  );
};

export default Dashboard;