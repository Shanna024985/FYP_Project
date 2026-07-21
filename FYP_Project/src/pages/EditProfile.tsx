import "./EditProfile.css";

export default function EditProfile() {
  return (
    <div className="page">
      {/* TOP BAR */}
      <div className="topBar">
        <h2 className="title">Edit Profile</h2>

        <button className="saveButton">
          Save
        </button>
      </div>

      {/* PROFILE PHOTO */}
      <div className="center">
        <div className="avatarPlaceholder">Profile Picture</div>
        <button className="uploadButton">Upload Photo</button>
      </div>

      {/* NAME */}
      <div className="formGroup">
        <label>First Name *</label>
        <input className="input" type="text" />
      </div>

      <div className="formGroup">
        <label>Last Name *</label>
        <input className="input" type="text" />
      </div>

      <div className="formGroup">
        <label>Email *</label>
        <input className="input" type="email" />
      </div>

      <div className="divider" />

      {/* LINK PROFILES */}
      <h3 className="sectionTitle">Link Profiles</h3>

      <div className="buttonRow">
        <button className="linkButton">Link LinkedIn</button>
        <button className="linkButton">Link GitHub</button>
      </div>

      <div className="divider" />

      {/* EDUCATION */}
      <div className="sectionHeader">
        <h3>Education</h3>
        <button className="circleAddButton">+</button>
      </div>

      <div className="cardPlaceholder">No education added yet</div>

      <div className="divider" />

      {/* RESUME */}
      <div className="sectionHeader">
        <h3>Resume</h3>
        <button className="circleAddButton">+</button>
      </div>

      <div className="cardPlaceholder">No resume uploaded yet</div>
    </div>
  );
}