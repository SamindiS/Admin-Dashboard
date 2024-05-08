import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateEmployee() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    try {
      const fetchEmployee = async () => {
        const res = await fetch(`/api/employee/getemployees?employeeId=${employeeId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.employees[0]);
        }
      };
      fetchEmployee();
    } catch (error) {
      console.log(error.message);
    }
  }, [employeeId]);

  const handleUploadImage = async () => {
    // Implementation for handling image upload
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
      console.log("test");
      const res = await fetch(`/api/employee/updateemployee/${formData._id}`, {
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
        setSuccessMessage("Employee updated successfully"); // Set success message
        navigate(`/employees`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    
    <div className="container py-3 p-3 max-w-lg mx-auto">
    <h1 className="text-center display-4 my-5 fw-bold">Update an Employee</h1>
    <form className="d-flex flex-column gap-4" onSubmit={handleSubmit}>
        <div className="col-sm d-flex align-items-center">
          <input
            type="text"
            placeholder="Enter Secret Key"
            required
            id="secreteKey"
            className="col d-flex align-items-center form-control"
            onChange={(e) => setFormData({ ...formData, secreteKey: e.target.value })}
            value={formData.secreteKey}
          />
        </div>
        <div className="col-sm-auto">
          <select
            defaultValue="uncategorized"
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            value={formData.category}
            className="form-select"
          >
            <option value="uncategorized">Select a user category</option>
            <option value="operator">Operator</option>
            <option value="supervisor">Supervisor</option>
            <option value="textileArtist">Textile Artist</option>
          </select>
        </div>
  
        <div className="col">
          <input
            type="text"
            placeholder="Register Number"
            id="registerNumber"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
            value={formData.registerNumber}
          />
        </div>
        <div className="col">
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            value={formData.username}
          />
        </div>
        <div className="col">
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            value={formData.email}
          />
        </div>
        <div className="col">
          <input
            type="text"
            placeholder="Phone Number"
            id="phoneNumber"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            value={formData.phoneNumber}
          />
         
        </div>
  
        <div class="row gap-4 align-items-center justify-content-between border border-4 border-primary border-dotted p-3">
  <div class="col">
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
        <div class="w-100 h-100" style={{maxWidth: '4rem', maxHeight: '4rem'}}>
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

  
<button type="submit" className="btn btn-primary">Update Employee</button>
        {publishError && <div className="mt-5 text-danger">{publishError}</div>}
      </form>
    </div>
   
  );
  
  
  
 }