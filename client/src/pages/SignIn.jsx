import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import backgroundImage from '/src/images/LOGIN.png'; // Import your background image

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
const {currentUser}=useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
        // navigate('/');
        if (currentUser && currentUser.isAdmin) {
          navigate('/dashboard');
           // Redirect to dashboard if user is admin
        } else {
          navigate('/'); // Redirect to home page for regular users
        }
        

     
      
      
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: '',
    backgroundPosition: 'center',
    height: '110vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(8px)',
  };
  
  return (
    <div style={backgroundStyle}>
      <div className="container p-1 max-w-md mx-auto rounded-lg shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
  
        <h1 className="text-center text-4xl font-bold my-9">Sign In</h1>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          
          <div className="input-group">
            <span className="input-group-text">@</span>
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="form-control p-4 rounded-lg"
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <span className="input-group-text">🔒</span>
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="form-control p-4 rounded-lg"
              onChange={handleChange}
            />
          </div>
          <button
            disabled={loading}
            className="btn btn-primary p-3 rounded-lg text-uppercase"
            style={{
              background: 'linear-gradient(to right, #6a11cb, #2575fc)',
              border: 'none'
            }}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <OAuth />
        </form>
        <div className="d-flex gap-2 mt-5 justify-content-center">
          <p>Don't have an account?</p>
          <Link to="/sign-up" className="text-blue-500">Sign up</Link>
        </div>
        <p className="text-danger text-center mt-5">
          {error ? error.message || 'Something went wrong!' : ''}
        </p>
      </div>
    </div>
  );
}
