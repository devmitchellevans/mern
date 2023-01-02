import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios  from "axios";

 
export default function Create() {
 const [form, setForm] = useState({
   name: "",
   photo: '',
   position: "",
   level: "",
 });

 const navigate = useNavigate();
 
 // These methods will update the state properties.
 function updateForm(value) {
  console.log(value);
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 const handlePhoto = (e) => {
   setForm({ ...form, photo: e.target.files[0]});
    console.log(form.photo);
  }
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.   
  //  const newPerson = { ...form };
    const formData = new FormData();
    formData.append('photo', form.photo);
    formData.append('name', form.name);
    formData.append('position', form.position);
    formData.append('level', form.level);

    console.log(formData.photo);
   axios.post("https://mern-service.onrender.com/record/add/", formData)
   .catch(error => {
     window.alert(error);
     return;
   });
 
   setForm({ name: "", photo: "", position: "", level: "" });
   navigate("/");
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div style={{"padding": '20px'}}>
     <h3>Create New Record</h3>
     <form onSubmit={onSubmit} encType="multipart/form-data">

       <div className="form-group">
         <label htmlFor="name">Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="position">Position</label>
         <input
           type="text"
           className="form-control"
           id="position"
           value={form.position}
           onChange={(e) => updateForm({ position: e.target.value })}
         />
       </div>
       <div className="form-group">
         <div className="form-check form-check-inline">
           <input
             className="form-check-input"
             type="radio"
             name="positionOptions"
             id="positionIntern"
             value="Intern"
             checked={form.level === "Intern"}
             onChange={(e) => updateForm({ level: e.target.value })}
           />
           <label htmlFor="positionIntern" className="form-check-label">Intern</label>
         </div>
         <div className="form-check form-check-inline">
           <input
             className="form-check-input"
             type="radio"
             name="positionOptions"
             id="positionJunior"
             value="Junior"
             checked={form.level === "Junior"}
             onChange={(e) => updateForm({ level: e.target.value })}
           />
           <label htmlFor="positionJunior" className="form-check-label">Junior</label>
         </div>
         <div className="form-check form-check-inline">
           <input
             className="form-check-input"
             type="radio"
             name="positionOptions"
             id="positionSenior"
             value="Senior"
             checked={form.level === "Senior"}
             onChange={(e) => updateForm({ level: e.target.value })}
           />
           <label htmlFor="positionSenior" className="form-check-label">Senior</label>
         </div>
       </div>
       <div className="form-group">
         <label htmlFor="photo">Photo</label>
         <input
           type="file"
           accept=".png, .jpg, .jpeg"
           className="form-control"
           name="photo"
           onChange={handlePhoto}
         />
       </div>
       <br />
       <div className="form-group">
         <input
           type="submit"
           value="Create person"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}