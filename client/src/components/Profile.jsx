import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';
import { Link,useLocation } from 'react-router-dom';
import {Button} from 'flowbite-react';
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";


export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const path= useLocation().pathname;
  
  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{backgroundColor: '#F2FAFF'}}>
    <div className="p-3 mx-auto" style={{ maxWidth: '32rem', backgroundColor: '#CBCDCF' }}>
      <h1 className='text-center text-3xl font-weight-bold my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='d-flex flex-column gap-4'>
        <input type='file' ref={fileRef} hidden accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt='profile'
          className="align-self-center rounded-circle"
          style={{ width: '10rem', height: '10rem', objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => fileRef.current.click()}
        />
        <p className='text-center'>
          {imageError ? (
            <span className='text-danger'>Error uploading image (file size must be less than 2 MB)</span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-secondary'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-success'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type='text'
          id='username'
          placeholder='Username'
          className='form-control bg-light rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          className='form-control bg-light rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          className='form-control bg-light rounded-lg p-3'
          onChange={handleChange}
        />
        <button className='btn btn-primary bg-slate-700 text-white rounded-lg text-uppercase'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        {!currentUser.isAdmin && (
          <Link to={'/'}>
            <Button type='button' className='w-100 btn btn-primary'>
              Back to User DashBoard
            </Button>
          </Link>
        )}
        {currentUser.isAdmin && (
          <Link to={'/dashboard'}>
            <Button type='button' className='w-100 btn btn-primary'>
              Back to Admin DashBoard
            </Button>
          </Link>
        )}
      </form>
      <div className='d-flex justify-content-between mt-5'>
        <span onClick={handleDeleteAccount} className='text-danger cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-danger cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-danger mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-success mt-5'>
        {updateSuccess && 'User is updated successfully!'}
      </p>
    </div>
    </div>
  );
}