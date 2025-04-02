import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUpErrorType, signUpFormType } from "../types/formTypes";
import axios from "axios";

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState<signUpErrorType>({});
  const [formData, setFormData] = useState<signUpFormType>({
    name: "",
    email: "",
    password: "",
  });

  const validate = () => {
    const errors: signUpErrorType = {};

    if (!formData.name || formData.name.trim() === "") {
      errors.name = "please enter name!";
    }

    if (typeof formData.email !== "string" || formData.email.trim() === "") {
      errors.email = "Please enter email!";
    } else {
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Invalid email format!";
      }
    }

    if (!formData.password || formData.password.trim() === "") {
      errors.password = "Please enter password!";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // console.log(name, value)
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    try {
      e.preventDefault();
      if (!validate()) return;
      const response = await axios.post("http://localhost:8000", formData);
      console.log(response);
      navigate("/SignIn");
    } catch (error) {
      console.log("error while registering user!", error);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-linear-to-r from-blue-200 to-white">
      {/* <img src={login} alt="" className='w-auto h-screem'/> */}
      <div className="shadow-2xl p-12 rounded-3xl" style={{ width: "400px" }}>
        <form action="" onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter name"
            name="name"
            onChange={(e) => {
              handlechange(e);
            }}
          />
          <p className="text-red-500 text-sm">{error.name}</p>
          <input
            type="email"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter email"
            name="email"
            onChange={(e) => {
              handlechange(e);
            }}
          />
          <p className="text-red-500 text-sm">{error.email}</p>

          <input
            type="Password"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter password"
            name="password"
            onChange={(e) => {
              handlechange(e);
            }}
          />
          <p className="text-red-500 text-sm">{error.password}</p>

          <div className="text-center">
            <button className="mt-5 mb-2 border rounded bg-blue-500 px-4 py-2 font-bold text-white text-xl w-full" type="submit">
              SignUp
            </button>
            <br />
          </div>
          <small className="font-bold text-gray-400">
            Already Have Account?{" "}
            <Link to="/auth/login" className="text-blue-500 font-bold underline">
              Login!
            </Link>
          </small>
        </form>
      </div>
    </div>
  );
}
