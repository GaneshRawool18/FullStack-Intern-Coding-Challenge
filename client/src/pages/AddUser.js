// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AddUser = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     role: 'user',
//     address: ''
//   });
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [loading, setLoading] = useState(false);
//   const [emailValid, setEmailValid] = useState(true);
//   const [errorMessages, setErrorMessages] = useState({});

//   const validateEmail = (email, role) => {
//     if (role === 'admin' && !email.endsWith('@admin.ratemystore.com')) {
//       return 'Admin accounts must use @admin.ratemystore.com domain';
//     }
    
//     if (role === 'store_owner' && !email.endsWith('@owner.ratemystore.com')) {
//       return 'Store owner accounts must use @owner.ratemystore.com domain';
//     }
    
//     return '';
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     // Validate email format when role or email changes
//     if (name === 'email' || name === 'role') {
//       const emailError = validateEmail(formData.email, name === 'role' ? value : formData.role);
//       setEmailValid(!emailError);
      
//       if (emailError) {
//         setErrorMessages({ ...errorMessages, email: emailError });
//       } else {
//         const newErrors = { ...errorMessages };
//         delete newErrors.email;
//         setErrorMessages(newErrors);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate email one more time
//     const emailError = validateEmail(formData.email, formData.role);
//     if (emailError) {
//       setEmailValid(false);
//       setErrorMessages({ ...errorMessages, email: emailError });
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       await axios.post('/api/admin/users', formData);
//       setMessage({ 
//         type: 'success', 
//         text: 'User created successfully!' 
//       });
      
//       // Clear form after successful submission
//       setFormData({
//         username: '',
//         email: '',
//         password: '',
//         role: 'user',
//         address: ''
//       });
      
//       // Redirect after 2 seconds
//       setTimeout(() => {
//         navigate('/admin/users');
//       }, 2000);
      
//     } catch (err) {
//       setMessage({ 
//         type: 'danger', 
//         text: err.response?.data?.message || 'Failed to create user' 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <div className="row justify-content-center">
//         <div className="col-md-8">
//           <div className="card">
//             <div className="card-header bg-primary text-white">
//               <h2 className="mb-0">Add New User</h2>
//             </div>
//             <div className="card-body">
//               {message.text && (
//                 <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
//                   {message.text}
//                   <button 
//                     type="button" 
//                     className="btn-close" 
//                     onClick={() => setMessage({ type: '', text: '' })}
//                     aria-label="Close"
//                   />
//                 </div>
//               )}
              
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="username" className="form-label">Username</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="username"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
                
//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label">Email</label>
//                   <input
//                     type="email"
//                     className={`form-control ${!emailValid ? 'is-invalid' : ''}`}
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                   {!emailValid && (
//                     <div className="invalid-feedback">
//                       {errorMessages.email}
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="mb-3">
//                   <label htmlFor="password" className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     minLength="6"
//                   />
//                   <div className="form-text">Password must be at least 6 characters</div>
//                 </div>
                
//                 <div className="mb-3">
//                   <label htmlFor="address" className="form-label">Address</label>
//                   <textarea
//                     className="form-control"
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     rows="2"
//                   />
//                 </div>
                
//                 <div className="mb-3">
//                   <label htmlFor="role" className="form-label">User Role</label>
//                   <select
//                     className="form-select"
//                     id="role"
//                     name="role"
//                     value={formData.role}
//                     onChange={handleChange}
//                   >
//                     <option value="user">Regular User</option>
//                     <option value="store_owner">Store Owner</option>
//                     <option value="admin">Administrator</option>
//                   </select>
//                   <div className="form-text">
//                     {formData.role === 'admin' && 'Admin users must have email ending with @admin.ratemystore.com'}
//                     {formData.role === 'store_owner' && 'Store owners must have email ending with @owner.ratemystore.com'}
//                   </div>
//                 </div>
                
//                 <div className="d-flex justify-content-between">
//                   <button 
//                     type="button" 
//                     className="btn btn-secondary"
//                     onClick={() => navigate('/admin/users')}
//                   >
//                     Cancel
//                   </button>
//                   <button 
//                     type="submit" 
//                     className="btn btn-primary"
//                     disabled={loading || !emailValid}
//                   >
//                     {loading ? 'Creating...' : 'Create User'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddUser; 