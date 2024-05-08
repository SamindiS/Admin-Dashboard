import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button } from "flowbite-react";
import LogoImage from "../images/logo.png"; // Import your logo image
import { signOut } from "../redux/user/userSlice";

export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOut());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#334155" }}>
      <div className="container-fluid d-flex justify-content-between align-items-center mx-auto p-1">
        <div className="d-flex align-items-center gap-1">
          <img src={LogoImage} alt="PTI TEXTILE Logo" className="w-20 h-10" />
          <h1 className="font-weight-bold text-white">TEXTILE</h1>
        </div>

        <ul className="d-flex gap-4 align-items-center">
          <Link to={currentUser?.isAdmin ? "/dashboard" : "/"} className="text-decoration-none text-white">
            <li>{currentUser?.isAdmin ? "Admin Home" : "Home"}</li>
          </Link>
          <Link to="/about" className="text-decoration-none text-white">
            <li>About</li>
          </Link>
          {currentUser ? (
            <div className="dropdown">
              <Link to="/profile" className="dropdown-toggle text-decoration-none text-white">
                <img src={currentUser.profilePicture} alt="user" className="rounded-circle" style={{ width: '3rem', height: '3rem' }} />
              </Link>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <span className="dropdown-item-text">
                    <span className="d-block text-sm">@{currentUser.username}</span>
                    <span className="d-block text-sm font-weight-medium overflow-hidden text-truncate">{currentUser.email}</span>
                  </span>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-dark" onClick={handleSignOut}>Sign Out</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/sign-in" className="text-decoration-none text-white">
              <li>Sign In</li>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
}