import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdDriveFileRenameOutline, MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { saveUserToDb } from '../../Shared/SaveUser/saveUserToDb';
import API from '../../../services/api';

const generateUserId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `U-${timestamp}-${random}`;
};

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: "onBlur" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    setErrorMessage("");
    try {
      // Register on server (creates hashed password)
      await API.post("/auth/register", { name: data.name, email: data.email, password: data.password });

      // Save public profile similarly to old flow (optional)
      await saveUserToDb({ name: data.name, email: data.email, authProvider: "email" });

      reset();
      Swal.fire({ icon: "success", title: "Welcome to CityNet Family", toast: true, timer: 1500, showConfirmButton: false, position: "top-end" });
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Registration failed";
      setErrorMessage(msg);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-rose-100 px-4">
      <div className="max-w-6xl w-full bg-base-100 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gradient-to-tr from-purple-400 to-pink-300 flex items-center justify-center">
          <img src="https://i.ibb.co/chd8KCCB/signup-image.jpg" alt="Signup Visual" className="object-cover h-full w-full" />
        </div>

        <div className="md:w-1/2 p-8 md:p-12 space-y-6">
          <h2 className="text-3xl font-bold">
            Welcome to <span className="text-4xl font-extrabold text-primary">CityNet</span> <span className="text-secondary">Sign Up</span> Today!
          </h2>
          <p className="text-gray-600 text-sm">Join CityNet today and enjoy high-speed internet with unmatched reliability.</p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control relative">
              <label className="label"><span className="label-text">Full Name</span></label>
              <MdDriveFileRenameOutline className="absolute top-8 left-2 text-slate-900 text-2xl" />
              <input type="text" placeholder="Enter your name" className="input w-full pl-10 bg-transparent border-0 border-b-2 border-gray-300" {...register("name", { required: true })} />
              {errors.name && <span className="font-semibold text-xs text-fuchsia-600">This field is required</span>}
            </div>

            <div className="form-control relative">
              <label className="label"><span className="label-text">Email Address</span></label>
              <MdEmail className="absolute top-9 left-3 text-slate-900 text-xl" />
              <input type="email" placeholder="Enter your email" className="input w-full pl-10 bg-transparent border-0 border-b-2 border-gray-300" {...register("email", { required: true })} />
              {errors.email && <span className="font-semibold text-xs text-fuchsia-600">This field is required!</span>}
            </div>

            <div className="form-control relative">
              <label className="label"><span className="label-text">Password</span></label>
              <FaLock className="absolute top-8 left-3 text-slate-900 text-xl" />
              <input type={showPassword ? "text" : "password"} placeholder="Create a strong password" className="input w-full pl-10 pr-10 bg-transparent border-0 border-b-2 border-gray-300" {...register("password", { required: true })} />
              <div className="absolute top-8 right-3 text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </div>
              {errors.password && <span className="font-semibold text-xs text-fuchsia-600">This field is required!</span>}
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4">Sign Up</button>
            {errorMessage && <div role="alert" className="alert alert-error"><span>{errorMessage}</span></div>}
          </form>

          <div className='text-center'>
            <button type="button" onClick={() => Swal.fire({ icon: "info", title: "Google Sign-In", text: "Google sign-in is not configured in this build.", toast: true, position: "top-end", showConfirmButton: false, timer: 2000 })} className="btn btn-outline btn-primary flex items-center justify-center gap-2">
              <FcGoogle /> Sign in with Google
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <Link to="/login" className="link link-secondary">Log in</Link></p>
        </div>
      </div>
    </section>
  );
}
