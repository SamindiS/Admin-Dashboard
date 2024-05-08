import React, { useState } from "react";
import { Alert, TextInput, Button, Select, FileInput } from "flowbite-react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from 'react-router-dom';

export default function AddEmployee() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
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
      const res = await fetch("/api/employee/create", {
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
        setSuccessMessage("Employee created successfully"); // Set success message
        alert("Employee created successfully");
        navigate(`/employees}`);      }
    } catch (error) {
      setPublishError('Employee created successfully');
      alert("Employee created successfully");
      navigate(`/employees`);
    }
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }));
  };
  

  return (
    
    <div className="container py-3 p-3 max-w-lg mx-auto" >
      <h1 className="text-center display-4 my-5 fw-bold">Add an Employee</h1>
  
      <form className="d-flex flex-column gap-4 " onSubmit={handleSubmit}>
        <div className="col-sm d-flex align-items-center">
          <input
            type="text"
            placeholder="Enter Secret Key"
            required
            id="secreteKey"
            className="col d-flex align-items-center form-control"
            onChange={(e) => setFormData({ ...formData, secreteKey: e.target.value })}
          />
        </div>
        <div className="col-sm-auto">
          <select
            defaultValue="uncategorized"
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
          />
        </div>
        <div className="col">
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        <div className="col">
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="col">
          <input
            type="text"
            placeholder="Phone Number"
            id="phoneNumber"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
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

  
        <div className="col">
          <button type="submit" className="btn btn-primary">Create a User</button>
          {publishError && <div className="mt-5 text-success">{publishError}</div>}
        </div>
      </form>
    </div>
   
  );
  
  
  
 }