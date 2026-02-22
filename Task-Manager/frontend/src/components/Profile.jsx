import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  BACK_BUTTON,
  FULL_BUTTON,
  INPUT_WRAPPER,
  INPUTWRAPPER,
  personalFields,
  SECTION_WRAPPER,
} from "../assets/dummy.jsx";
import { ChevronLeft, Save, UserCircle } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function Profile({ setCurrentUser }) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { data } = await axios.get(
          `${API_URL}/api/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setProfile({
            name: data.user.name,
            email: data.user.email,
          });
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Unable to load profile.");
      }
    };

    fetchProfile();
  }, []);

  
  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        {
          name: profile.name,
          email: profile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev,
          name: profile.name,
          avatar: `https://ui-avatars.com/api/?name=${profile.name}&background=random`,
        }));

        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Profile update failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="max-w-4xl mx-auto p-6">
        <button
          className={BACK_BUTTON}
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Account Settings
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your profile information
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="text-blue-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h2>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(
                ({ name, type, placeholder, icon: Icon }) => (
                  <div key={name} className={INPUT_WRAPPER}>
                    <Icon className="text-purple-500 w-5 h-5 mr-2" />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={profile[name] || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          [name]: e.target.value,
                        })
                      }
                      className="w-full focus:outline-none text-sm"
                      required
                    />
                  </div>
                )
              )}

              <button
                type="submit"
                className={FULL_BUTTON}
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
