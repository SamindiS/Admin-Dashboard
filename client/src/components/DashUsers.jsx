

import React, { useEffect, useRef, useState } from 'react';
import { Modal, Table, Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import {useReactToPrint} from 'react-to-print';


export default function DashUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    

    if (currentUser.isAdmin) {
      fetchUsers(); 
    }
  }, [currentUser._id]);


  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
        const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
            setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
            setShowModal(false);
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error.message);
    }
  };

  //print report
const ComponentsRef=useRef();
const handlePrint=useReactToPrint({
  content:()=>ComponentsRef.current,
  documentTitle:'Users Report',
  onAfterPrint:()=>alert('Report Successfully Downloaded!'),
})



return (
  <div className='container-fluid p-3'>
    {currentUser.isAdmin && users.length > 0 ? (
      <>
        <div ref={ComponentsRef} className="overflow-auto">
          <table className='table table-hover shadow'>
            <thead>
              <tr>
                <th>Date created</th>
                <th>User image</th>
                <th>Username</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className='bg-white'>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className='w-100 h-auto rounded-circle'
                        style={{ maxWidth: '50px' }}
                      />
                    </div>
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                  {user.isAdmin ? (
  <FaCheck className='text-success' />
) : (
  <FaTimes className='text-danger' />
)}
                  </td>
                  <td>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className='font-medium text-danger cursor-pointer'
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showMore && (
          <button
            onClick={handleShowMore}
            className='btn btn-primary w-full text-uppercase py-3'
          >
            Show more
          </button>
        )}
        <button className='btn btn-primary btn-block mt-3' onClick={handlePrint}>
          Download Report
        </button>

        
          
      </>
    ) : (
      <p className='text-center'>You have no users yet!</p>
    )}
    <Modal
      show={showModal}
      onClose={() => setShowModal(false)}
      popup
      size='md'
    >
      <Modal.Header />
      <Modal.Body>
        <div className='text-center'>
          <i className='bi bi-exclamation-circle text-gray-400 mb-4 display-4'></i>
          <h3 className='mb-5 text-secondary'>
            Are you sure you want to delete this user?
          </h3>
          <div className='d-flex justify-content-center gap-4'>
            <button className='btn btn-danger' onClick={handleDeleteUser}>
              Yes, I'm sure
            </button>
            <button className='btn btn-secondary' onClick={() => setShowModal(false)}>
              No, cancel
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </div>
);

}
