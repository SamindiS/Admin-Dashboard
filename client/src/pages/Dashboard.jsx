import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import React from 'react';

import DashUsers from '../components/DashUsers';
import Profile from '../components/Profile';
import DashboardComp from '../components/DashboardComp';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>  
      
      {/* Profile */}
      {tab === 'profile' && <Profile />}
      
      {/* Users */}
      {tab === 'users' && <DashUsers />}

      {/*dashboard */}
      {tab==='dash' && <DashboardComp/>}
    </div>
  );
}
