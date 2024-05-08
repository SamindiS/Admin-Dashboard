import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import backgroundImage from '/src/images/LOGIN.png';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(true);
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
  <h1 class="text-center text-4xl font-weight-bold my-7">Sign Up</h1>
  <form onSubmit={handleSubmit} class="d-flex flex-column gap-4">
    <input
      type="text"
      placeholder="Username"
      id="username"
      class="form-control bg-slate-100 p-3 rounded-lg"
      onChange={handleChange}
    />
    <input
      type="email"
      placeholder="Email"
      id="email"
      class="form-control bg-slate-100 p-3 rounded-lg"
      onChange={handleChange}
    />
    <input
      type="password"
      placeholder="Password"
      id="password"
      class="form-control bg-slate-100 p-3 rounded-lg"
      onChange={handleChange}
    />
    <button
      disabled={loading}
      class="btn btn-primary bg-slate-700 text-white p-3 rounded-lg text-uppercase"
    >
      {loading ? 'Loading...' : 'Sign Up'}
    </button>
    <OAuth />
  </form>
  <div class="d-flex gap-2 mt-5">
    <p>Have an account?</p>
    <Link to="/sign-in" class="text-blue-500">Sign in</Link>
  </div>
  <p class="text-danger mt-5">{error && 'Something went wrong!'}</p>
</div>
</div>

  );
}
