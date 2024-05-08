import { Modal } from 'flowbite-react';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useReactToPrint } from 'react-to-print';

const Supplier = React.forwardRef((props, ref) => {
  const { currentUser } = useSelector((state) => state.user);
  const [userSuppliers, setUserSuppliers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [supplierIdToDelete, setSupplierIdToDelete] = useState('');
  const [printingError, setPrintingError] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("/api/supplier/getsuppliers");
        const data = await res.json();
        if (res.ok) {
          setUserSuppliers(data.suppliers);
          setShowMore(data.suppliers.length >= 9);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchSuppliers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const startIndex = userSuppliers.length;
      const res = await fetch(`/api/supplier/getsuppliers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserSuppliers((prev) => [...prev, ...data.suppliers]);
        setShowMore(data.suppliers.length >= 9);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteSupplier = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/supplier/deletesupplier/${supplierIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserSuppliers((prev) =>
          prev.filter((supplier) => supplier._id !== supplierIdToDelete)
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
    documentTitle: 'Supplier Report',
    onAfterPrint: () => {
      // Reset printing error after successful print
      setPrintingError(null);
      alert('Report Successfully Downloaded!');
    },
    onError: (error) => {
      console.error('Printing Error:', error);
      setPrintingError(error);
    },
  });

  return (
    <div ref={ref} className="container-fluid py-3" style={{ backgroundColor: '#F2FAFF ' }}>
      <div className="row">
        <div className="col-12">
          <h3 className="text-center text-3xl font-semibold">Supplier List</h3>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12 text-center">
          <Link to="/addsupplier">
            <button className="btn btn-primary btn-lg rounded-pill">
              Add Supplier
            </button>
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {currentUser.isAdmin && userSuppliers.length > 0 ? (
            <>
              <div className="table-responsive" ref={componentsRef}>
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
                    {userSuppliers.map((supplier) => (
                      <tr key={supplier._id}>
                        <td>{new Date(supplier.createdAt).toLocaleDateString()}</td>
                        <td>{supplier.category}</td>
                        <td>{supplier.registerNumber}</td>
                        <td>{supplier.username}</td>
                        <td>{supplier.email}</td>
                        <td>{supplier.phoneNumber}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={supplier.image}
                              alt={supplier.username}
                              className='w-100 h-auto rounded-circle image-container'
                              style={{ maxWidth: '50px',maxHeight: '50px' }}
                            />
                          </div>
                        </td>
                        <td>
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setSupplierIdToDelete(supplier._id);
                            }}
                            className="text-danger cursor-pointer"
                          >
                            Delete
                          </span>
                        </td>
                        <td>
                          <Link
                            className="text-teal-500 hover:underline"
                            to={`/update-supplier/${supplier._id}`}
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
            <p className="text-center">You have no suppliers yet!</p>
          )}
        </div>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-gray-400 mb-4 display-4" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete this Supplier?
            </h3>
            <div className="d-flex justify-content-center gap-4">
              <button className="btn btn-danger" onClick={handleDeleteSupplier}>
                Yes, I'm sure
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                No, cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
});

export default Supplier;
