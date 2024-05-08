import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AddSuppliers() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const [publishError, setPublishError] = useState(null);
  const { supplierId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    try {
      const fetchSupplier = async () => {
        const res = await fetch(`/api/supplier/getsuppliers?supplierId=${supplierId}`);
        const data = await res.json();
        if(!res.ok){
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if(res.ok){
          setPublishError(null);
          setFormData(data.suppliers[0]);
        }
      };
      fetchSupplier();
      
    } catch (error) {
      
      console.log(error.message);
    }
    
  }, [supplierId]);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    const requiredFields = ['secreteKey', 'registerNumber', 'username', 'email', 'phoneNumber'];
    const isFormValid = requiredFields.every(field => formData[field]);
    if (!isFormValid) {
      setPublishError('Please fill all the fields');
      return;
    }

    try {
      const res = await fetch("/api/supplier/updatesupplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        setSuccessMessage("Supplier created successfully"); // Set success message
        navigate(`/suppliers}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  const handleUploadImage = async () => {
    // Implementation for handling image upload
  };

  return (
    <div className="container py-2 p-3 max-w-lg mx-auto">
      <h1 className="text-center display-4 my-5 fw-bold">Update Supplier</h1>
      <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
        <div className="col-sm d-flex align-items-center">
          <input
            type="text"
            placeholder="Enter Secret Key"
            required
            id="secreteKey"
            className="col d-flex align-items-center form-control"
            onChange={handleChange}
            value={formData.secreteKey}
          />
        </div>
        <div className="col-sm-auto">
          <select
            onChange={handleChange}
            value={formData.category}
            className="form-select"
            id="category"
          >
            <option value="uncategorized">Select a user category</option>
            <option value="fabricSupplier">Fabric Supplier</option>
            <option value="chemicalSupplier">Chemical Supplier</option>
            <option value="apparelManufacturers">Apparel Manufacturers</option>
            <option value="equipmentSuppliers">Equipment Suppliers</option>
          </select>
        </div>
        <div className="col">
          <input
            type="text"
            placeholder="Register Number"
            id="registerNumber"
            className="form-control"
            onChange={handleChange}
            value={formData.registerNumber}
          />
        </div>
        <div className="col">
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="form-control"
            onChange={handleChange}
            value={formData.username}
          />
        </div>
        <div className="col">
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="form-control"
            onChange={handleChange}
            value={formData.email}
          />
        </div>
        <div className="col">
          <input
            type="text"
            placeholder="Phone Number"
            id="phoneNumber"
            className="form-control"
            onChange={handleChange}
            value={formData.phoneNumber}
          />
        </div>
        <div className="row gap-4 align-items-center justify-content-between border border-4 border-primary border-dotted p-3">
          <div className="col">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleUploadImage}
              disabled={imageUploadProgress !== null}
            >
              {imageUploadProgress !== null ? (
                <div className="w-100 h-100" style={{ maxWidth: '4rem', maxHeight: '4rem' }}>
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                'Upload Image'
              )}
            </button>
          </div>
        </div>
        <div className="col">
          <button type="submit" className="btn btn-primary">Update Supplier</button>
          {publishError && <div className="mt-5 text-danger">{publishError}</div>}
        </div>
      </form>
    </div>
  );
}
