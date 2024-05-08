// AdminHome.jsx
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//sidebar
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight,HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie ,HiArrowNarrowUp} from "react-icons/hi";
  import { Button, Table } from 'flowbite-react';

import { Link ,useLocation} from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import {useDispatch} from 'react-redux';
export default function AdminHome() {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees]=useState([]);
  const [suppliers,setSuppliers]=useState([]);
  const [totalUsers,setTotalUsers]=useState(0);
  const [totalEmployees,setTotalEmployees]=useState(0);
  const [totalSuppliers,setTotalSuppliers]=useState(0);
  const [lastMonthUsers,setLastMonthUsers]=useState(0);
  const [lastMonthEmployees,setLastMonthEmployees]=useState(0);
  const [lastMonthSuppliers,setLastMonthSuppliers]=useState(0);
  const {currentUser}=useSelector((state)=>state.user);
  const path= useLocation().pathname;
  const dispatch=useDispatch();
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axios.get('/api/user/users'); // Make sure the endpoint matches your backend route
  //       setUsers(response.data.users);
  //     } catch (error) {
  //       console.error('Error fetching users:', error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res=await fetch ('/api/user/getusers?limit=5');
        const data=await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
    } 
  } catch (error) {
    console.log(error.message);
  }
}
const fetchEmployees = async () => {
  try {
    const res=await fetch ('/api/employee/getemployees?limit=5');
    const data=await res.json();
    if (res.ok) {
      setEmployees(data.employees);
      setTotalEmployees(data.totalEmployees);
      setLastMonthEmployees(data.lastMonthEmployees);
    }
  } catch (error) {
    console.log(error.message);
  }
  
};
const fetchSuppliers = async () => {
  try {
    const res=await fetch ('/api/supplier/getsuppliers?limit=5');
    const data=await res.json();
    if (res.ok) {
      setSuppliers(data.suppliers);
      setTotalSuppliers(data.totalSuppliers);
      setLastMonthSuppliers(data.lastMonthSuppliers);
    }
  } catch (error) {
    console.log(error.message);
  }
};
if(currentUser.isAdmin){
  fetchUsers();
  fetchEmployees();
  fetchSuppliers();
}},[currentUser]

);

  return (
    <div class="d-flex flex-col">
    <div class="min-vh-100 d-flex flex-md-row flex-column " >
      <Sidebar  class="col-md-100 text-gray-400 w-full" style={{backgroundColor:'lightgrey'}}>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
          <Link to='/profile'>
  <Sidebar.Item
    active={path === '/profile'}
    icon={HiUser}
    labelColor="dark"
    class="btn btn-outline-primary border-2 border-primary " style={{borderColor:"#007bff",width:"180px"}}
  >
    <span>Profile</span> {/* Text outside button */}
  </Sidebar.Item>
</Link>

            <Link to='/getusers'>
              <Sidebar.Item
                active={true}
                icon={HiAnnotation}

                labelColor="blue"
                class="btn btn-outline-primary border-2 border-primary" style={{borderColor:"#007bff",width:"180px"}}

              >
                Users
              </Sidebar.Item>
            </Link>
            <Link to='#'>
              <Sidebar.Item
                active={true}
                icon={HiUser}
                labelColor="blue"
                class="btn btn-outline-primary border-2 border-primary" style={{borderColor:"#007bff",width:"180px"}}

              >
                Admins
              </Sidebar.Item>
            </Link>

            <Link to='/employees'>
              <Sidebar.Item
                active={true}
                icon={HiOutlineUserGroup}
                labelColor="blue"
                class="btn btn-outline-primary border-2 border-primary" style={{borderColor:"#007bff",width:"180px"}}

              >
                Employees
              </Sidebar.Item>
            </Link>

            <Link to='/suppliers'>
              <Sidebar.Item
                active={true}
                icon={HiDocumentText}
                labelColor="blue"
                class="btn btn-outline-primary border-2 border-primary" style={{borderColor:"#007bff",width:"180px"}}

              >
                Suppliers
              </Sidebar.Item>
            </Link>
<Link to='/sign-in'>
            <Sidebar.Item
              active={true}
              icon={HiArrowSmRight}
              labelColor="blue"
              class="btn btn-outline-primary border-2 border-primary" style={{borderColor:"#007bff",width:"180px"}}

              onClick={handleSignOut}
            >
              Sign Out
            </Sidebar.Item></Link>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>






    {/* dashboard */}
    <div className="container">
  <div className="row">
    <div className='col-md-10 mx-auto p-3'>
      <div class="d-flex flex-wrap gap-4 justify-content-center">
        <div class="d-flex flex-column p-3   gap-3 col-md-3 col-12 rounded-md shadow-md" style={{backgroundColor:'lightblue',boxShadow:'0 0 10px 0 rgba(0, 0, 0, 0.3)'}}>
          <div class="d-flex justify-content-between">
            <div className=''>
              <h3 class="text-gray-500 text-uppercase" style={{fontSize:'1.25rem'}}>Total Users</h3>
              <p class="display-4">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup class="bg-teal text-dark rounded-circle display-1 p-3 shadow-lg" style={{backgroundColor:'teal'}} />
          </div>
          <div class="d-flex gap-2 small">
            <span class="text-success d-flex align-items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div class="text-secondary">Last month</div>
          </div>
        </div>
        <div class="d-flex flex-column p-3  gap-4 col-md-3 col-12 rounded-md shadow-md" style={{backgroundColor:'lightblue',boxShadow:'0 0 10px 0 rgba(0, 0, 0, 0.3)'}}>
          <div class="d-flex justify-content-between">
            <div className=''>
              <h3 class="text-gray-500 text-uppercase" style={{fontSize:'1.25rem'}}>
                Total Employees
              </h3>
              <p class="display-4">{totalEmployees}</p>
            </div>
            <HiUser class="bg-teal text-dark rounded-circle display-1 p-3 shadow-lg" style={{backgroundColor:'green'}}  />
          </div>
          <div class="d-flex gap-2 small">
            <span class="text-success d-flex align-items-center">
              <HiArrowNarrowUp />
              {lastMonthEmployees}
            </span>
            <div class="text-secondary">Last month</div>
          </div>
        </div>
        <div class="d-flex flex-column p-3  gap-4 col-md-3 col-12 rounded-md shadow-md" style={{backgroundColor:'lightblue',boxShadow:'0 0 10px 0 rgba(0, 0, 0, 0.3)'}}>
          <div class="d-flex justify-content-between">
            <div className=''>
              <h3 class="text-gray-500 text-uppercase" style={{fontSize:'1.25rem'}}>Total Suppliers</h3>
              <p class="display-4">{totalSuppliers}</p>
            </div>
            <HiDocumentText class="bg-teal text-dark rounded-circle display-1 p-3 shadow-lg" style={{backgroundColor:'orange'}}  />
          </div>
          <div class="d-flex gap-2 small">
            <span class="text-success d-flex align-items-center">
              <HiArrowNarrowUp />
              {lastMonthSuppliers}
            </span>
            <div class="text-secondary">Last month</div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      <div class="d-flex flex-wrap gap-4 py-3 mx-auto justify-content-center">
      <div class="d-flex flex-column w-96  shadow-md p-2 rounded-md " style={{backgroundColor:'lightgray'}}>
          <div class="d-flex justify-content-between p-1 font-weight-bold text-small">
            <h1 class="text-center p-2">Recent users</h1>
            <a href="/getusers" class="btn btn-outline-secondary" style={{linearGradient:'linear-gradient(90deg, blue, 0%, purple 100%)'}}>See all</a>

          </div>
          <Table hoverable>
            <Table.Head >
              <Table.HeadCell class="p-4">User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} class="border-bottom">
                  <Table.Row class="bg-light border border-dark">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt='user'
                        class="rounded-circle bg-secondary"
                        style={{width:'40px',height:'40px'}}
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>

        </div>
        <div class="d-flex flex-column w-96 md:w-auto shadow-md p-2 rounded-md " style={{backgroundColor:'lightgray'}}>
          <div class="d-flex justify-content-between p-1 text-sm font-weight-bold">
            <h1 class='text-center p-2'>Recent employees</h1>
            <a href="/employees" class="btn btn-outline-secondary" style={{linearGradient:'linear-gradient(90deg, blue, 0%, purple 100%)'}}>See all</a>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell class="p-4">Employee image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {employees &&
              employees.map((employee) => (
                <Table.Body key={employee._id} class="border-bottom">
                  <Table.Row class="bg-light border border-dark">
                  <Table.Cell>
                      <img
                        src={employee.image}
                        alt='employee'
                        class="rounded-circle bg-secondary"
                        style={{width:'40px',height:'40px'}}
                      />
                    </Table.Cell>
                    <Table.Cell>{employee.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div class="d-flex flex-column w-96 md:w-auto shadow-md p-2 rounded-md " style={{backgroundColor:'lightgray'}}>
          <div class="d-flex justify-content-between p-3 text-sm font-weight-bold">
            <h1 class='text-center p-2'>Recent suppliers</h1>
            <a href="/suppliers" class="btn btn-outline-secondary" style={{linearGradient:'linear-gradient(90deg, blue, 0%, purple 100%)'}}>See all</a>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell class="p-4">supplier Image</Table.HeadCell>
              <Table.HeadCell class="p-4">Username</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {suppliers &&
              suppliers.map((supplier) => (
                <Table.Body key={supplier._id} class="border-bottom">
                  <Table.Row class="bg-light border border-dark">
                    <Table.Cell>
                      <img
                        src={supplier.image}
                        alt='supp'
                        class="rounded-circle bg-secondary"
                        style={{width:'40px',height:'40px'}}
                      />
                    </Table.Cell>
                    <Table.Cell className='w-96'>{supplier.username}</Table.Cell>
                    <Table.Cell className='w-5'>{supplier.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>


  );
}
