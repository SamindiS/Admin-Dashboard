import React from 'react';
import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashSidebar() {
  return (
    <Sidebar>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/profile">
            <Sidebar.Item icon={HiUser} label="Profile" />
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} label="Sign Out" />
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
