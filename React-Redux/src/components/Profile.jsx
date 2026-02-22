import { useDispatch, useSelector } from "react-redux";
import { updateProfileField, toggleEdit } from "../store/userSlice.js";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, isEditing } = useSelector((state) => state.user);
  const { rules, messages } = useSelector((state) => state.validation);

  const handleChange = (field, value) => {
    dispatch(updateProfileField({ field, value }));
  };

  const validateProfile = () => {
    for (let field in profile) {
      if (rules[field] && !rules[field].test(profile[field])) {
        alert(messages[field]);
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (validateProfile()) {
      dispatch(toggleEdit());
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      <div className="profile-form">
        {Object.keys(profile).map((key) => (
          <input
            key={key}
            className="profile-input"
            value={profile[key]}
            disabled={!isEditing}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={key}
          />
        ))}
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <button className="profile-btn" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button
            className="profile-btn"
            onClick={() => dispatch(toggleEdit())}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
