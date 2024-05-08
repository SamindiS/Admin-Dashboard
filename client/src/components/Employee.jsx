import { Modal } from 'flowbite-react';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useReactToPrint } from 'react-to-print';

const Employee = React.forwardRef((props, ref) => {
  const { currentUser } = useSelector((state) => state.user);
  const [userEmployees, setUserEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/employee/getemployees");
        const data = await res.json();
        if (res.ok) {
          setUserEmployees(data.employees);
          if (data.employees.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchEmployees();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userEmployees.length;
    try {
      const res = await fetch(`/api/employee/getemployees?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserEmployees((prev) => [...prev, ...data.employees]);
        if (data.employees.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteEmployee = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/employee/deleteemployee/${employeeIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserEmployees((prev) =>
          prev.filter((employee) => employee._id !== employeeIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Print report
  const componentsRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentsRef.current,
    documentTitle: 'Employee Report',
    onAfterPrint: () => alert('Report Successfully Downloaded!'),
  });

  return (
    <div ref={ref} className="container-fluid py-3" style={{ backgroundColor: '#F2FAFF ' }}>
      <div className="row">
        <div className="col-12">
          <h3 className="text-center text-3xl font-semibold mb-4">Employee List</h3>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12 text-center">
          <Link to="/addemployee">
            <button className="btn btn-primary btn-lg rounded-pill">
              Add Employee
            </button>
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {currentUser.isAdmin && userEmployees.length > 0 ? (
            <>
              <div className='table-responsive' ref={componentsRef}>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date Created</th>
                      <th>Category</th>
                      <th>Register Number</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Image</th>
                      <th>Delete</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userEmployees.map((employee) => (
                      <tr key={employee._id}>
                        <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                        <td>{employee.category}</td>
                        <td>{employee.registerNumber}</td>
                        <td>{employee.username}</td>
                        <td>{employee.email}</td>
                        <td>{employee.phoneNumber}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={employee.image}
                              alt={employee.username}
                              className='w-100 h-auto rounded-circle image-container'
                              style={{ maxWidth: '50px',maxHeight: '50px' }}
                            />
                          </div>
                        </td>
                        <td>
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setEmployeeIdToDelete(employee._id);
                            }}
                            className='text-danger cursor-pointer'
                          >
                            Delete
                          </span>
                        </td>
                        <td>
                          <Link
                            className='text-teal-500 hover:underline'
                            to={`/update-employee/${employee._id}`}
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {showMore && (
                <button
                  onClick={handleShowMore}
                  className="btn btn-primary btn-lg btn-block"
                >
                  Show more
                </button>
              )}
              <button className='btn btn-primary btn-block mt-3' onClick={handlePrint}>
                Download Report
              </button>
            </>
          ) : (
            <p className="text-center">You have no employees yet!</p>
          )}
        </div>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='text-gray-400 mb-4 display-4' />
            <h3 className='mb-5 text-lg text-gray-500'>
              Are you sure you want to delete this Employee?
            </h3>
            <div className='d-flex justify-content-center gap-4'>
              <button className='btn btn-danger' onClick={handleDeleteEmployee}>
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
});

export default Employee;
