import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiMail } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { authAPI } from "../routes";
import { setAuthUser } from "../redux/userSlice";
import { IoText } from "react-icons/io5";
import statesAndCities from "../sampleData";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const profileImgRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [credentials, setCredentials] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    state: "",
    city: "",
  });
  const [cities, setCities] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setCredentials({ ...credentials, state, city: "" });
    setCities(statesAndCities[state] || []);
  };

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (state === "profilePhoto") setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setIsError(false);
    setErrorMessage("");

    try {
      const res = await axios.post(`${authAPI}/register`, {
        ...credentials,
        profilePhoto: profilePhoto.length > 0 ? profilePhoto : null,
      });

      console.log(res.data);
      dispatch(setAuthUser(res.data));
      toast.success("Register successful!");
    } catch (err) {
      setIsError(true);
      setErrorMessage(
        err.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex gap-2 items-center justify-center absolute left-6 top-6">
        <img src={"/chitchatLogo.svg"} alt="logo.svg" className="w-9" />
        <p className="text-xl text-white font-semibold">ChitChat</p>
      </div>

      <div className="flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col w-[350px]" onSubmit={handleSubmit}>
          <div className="avatar mx-auto">
            <div
              className="w-36 h-36 rounded-full ring ring-[#FC852E] ring-offset-base-100 ring-offset-1 cursor-pointer"
              onClick={() => profileImgRef.current.click()}
            >
              <img
                src={profilePhoto || "/avatar-placeholder.jpg"}
                alt="profile-photo"
              />
            </div>
          </div>
          <input
            type="file"
            hidden
            accept="image/*"
            ref={profileImgRef}
            onChange={(e) => handleImgChange(e, "profilePhoto")}
          />
          <label className="input input-bordered rounded flex items-center gap-2">
            <IoText size={20} />
            <input
              type="text"
              className="grow"
              placeholder="Name"
              name="fullName"
              value={credentials.fullName}
              onChange={handleInputChange}
              style={{ fontSize: "16px" }}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <AiOutlineUser size={20} />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              style={{ fontSize: "16px" }}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <FiMail size={20} />
            <input
              type="text"
              className="grow"
              placeholder="Email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              style={{ fontSize: "16px" }}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <RiLockPasswordLine size={22} />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              style={{ fontSize: "16px" }}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <select
              className="grow"
              name="state"
              value={credentials.state}
              onChange={handleStateChange}
              style={{ fontSize: "16px", backgroundColor: "#1D232A" }}
            >
              <option value="">Select a state</option>
              {Object.keys(statesAndCities).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          {/* City Dropdown */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <select
              className="grow"
              name="city"
              value={credentials.city}
              onChange={handleInputChange}
              disabled={!credentials.state}
              style={{ fontSize: "16px", backgroundColor: "#1D232A" }}
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="btn rounded-md text-xl text-white"
            style={{ backgroundColor: "#FC852E", color: "white" }}
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Register"}
          </button>
          {isError && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
        </form>
        <div className="mt-2">
          <p className="text-white text-lg">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FC852E] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
