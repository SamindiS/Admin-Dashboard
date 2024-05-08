import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiDatabase } from "react-icons/hi";
import { Link ,useLocation} from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import {useDispatch,useSelector} from 'react-redux';


export default function Home() {

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
  return (
    <div className="d-flex flex-col">
      <div className="min-vh-100 d-flex flex-md-row flex-column">
        <Sidebar className="col-md-100 text-gray-400 w-full" style={{ backgroundColor: 'lightgrey' }}>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Link to="/profile">
                <Sidebar.Item
                  active={path === "/profile"}
                  icon={HiUser}
                  labelColor="dark"
                  className="btn btn-outline-primary border-2 border-primary"
                  style={{ borderColor: "#007bff", width: "180px" }}
                >
                  Profile
                </Sidebar.Item>
              </Link>
              {currentUser.isAdmin && (
                <Link to="/dashboard">
                  <Sidebar.Item
                    active={path === "/dashboard"}
                    icon={HiDatabase}
                    labelColor="dark"
                    className="btn btn-outline-primary border-2 border-primary"
                    style={{ borderColor: "#007bff", width: "180px" }}
                  >
                    Dashboard
                  </Sidebar.Item>
                </Link>
              )}
              <Link to='/sign-in'>
                <Sidebar.Item
                  active={path === '/sign-in'}
                  icon={HiArrowSmRight}
                  labelColor="blue"
                  className="btn btn-outline-primary border-2 border-primary"
                  style={{ borderColor: "#007bff", width: "180px" }}
                  onClick={handleSignOut}
                >
                  Sign Out
                </Sidebar.Item>
              </Link>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
      {currentUser.isAdmin && (
        <div><h1 className="text-center" style={{ color: "blue", textAlign: "center" }}>Welcome Admin</h1></div>
      )}
    </div>
  );
}