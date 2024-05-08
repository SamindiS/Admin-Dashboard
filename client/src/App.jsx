import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './components/Profile';
import AdminHome from './pages/AdminHome';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
 //import CreateUser from './pages/CreateUser';
import DashUsers from './components/DashUsers';
import Employee from './components/Employee';
import AddEmployee from './pages/AddEmployee';
import UpdateEmployee from './pages/UpdateEmployee';
import AddSuppliers from './pages/AddSuppliers';
import Supplier from './components/Supplier';
import UpdateSupplier from './pages/UpdateSupplier';



export default function App() {
  return (
    <BrowserRouter>
      {/* header */}
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/dashboard' element={<AdminHome />} />

        <Route path='/getusers' element={<DashUsers />} />
        
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          {/* <Route path='/create-user' element={<CreateUser />} /> */}
          <Route path='/employees' element={<Employee />} />
          <Route path='/addemployee' element={<AddEmployee />} />
          <Route path='/update-employee/:employeeId' element={<UpdateEmployee />} />
          <Route path='/update-supplier/:supplierId' element={<UpdateSupplier />} />
          <Route path='/suppliers' element={<Supplier />} />
          <Route path='/addsupplier' element={<AddSuppliers />} />

          
        </Route>
      </Routes>
    </BrowserRouter>
  );}