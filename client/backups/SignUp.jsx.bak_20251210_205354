import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdDriveFileRenameOutline, MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Providers/AuthProvider";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { saveUserToDb } from "../../Shared/SaveUser/saveUserToDb";

// Helper to create a simple user ID
const generateUserId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `U-${timestamp}-${random}`;
};

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: "onBlur" });

    const { createUserWithEmailPass, signInWithGoogle, user } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const onSubmit = (data) => {
        setErrorMessage(""); // reset error

        createUserWithEmailPass(data.email, data.password)
            .then((userCredential) => {
                const newUserInfo = {
                    name: data.name,
                    email: data.email,
                    authProvider: "email"
                };

                saveUserToDb(newUserInfo)
                    .then(() => {
                        reset();
                        Swal.fire({
                            icon: "success",
                            title: "Welcome to CityNet Family",
                            toast: true,
                            timer: 1500,
                            showConfirmButton: false,
                            position: "top-end"
                        });
                        navigate(from, { replace: true });
                    })
            .catch((error) => {
                setErrorMessage(error.message);
            });
        });
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-rose-100 px-4">
            <div className="max-w-6xl w-full bg-base-100 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                {/* Left */}
                <div className="md:w-1/2 bg-gradient-to-tr from-purple-400 to-pink-300 flex items-center justify-center">
                    <img
                        src="https://i.ibb.co/chd8KCCB/signup-image.jpg"
                        alt="Signup Visual"
                        className="object-cover h-full w-full"
                    />
                </div>

                {/* Right */}
                <div className="md:w-1/2 p-8 md:p-12 space-y-6">
                    <h2 className="text-3xl font-bold">
                        Welcome to{" "}
                        <span className="text-4xl font-extrabold text-primary">CityNet</span>{" "}
                        <span className="text-secondary">Sign Up</span> Today!
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Join CityNet today and enjoy high-speed internet with unmatched reliability.
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Full Name */}
                        <div className="form-control relative">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <MdDriveFileRenameOutline className="absolute top-8 left-2 text-slate-900 text-2xl" />
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="input w-full pl-10 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-b-2 focus:border-primary focus:shadow-[0px_2px_10px_-2px_rgba(99,102,241,0.7),0px_2px_15px_-2px_rgba(236,72,153,0.7)] transition duration-300"
                                {...register("name", { required: true })}
                            />
                            {errors.name && (
                                <span className="font-semibold text-xs text-fuchsia-600">
                                    This field is required
                                </span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="form-control relative">
                            <label className="label">
                                <span className="label-text">Email Address</span>
                            </label>
                            <MdEmail className="absolute top-9 left-3 text-slate-900 text-xl" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input w-full pl-10 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-b-2 focus:border-primary focus:shadow-[0px_2px_10px_-2px_rgba(99,102,241,0.7),0px_2px_15px_-2px_rgba(236,72,153,0.7)] transition duration-300"
                                {...register("email", { required: true })}
                            />
                            {errors.email && (
                                <span className="font-semibold text-xs text-fuchsia-600">
                                    This field is required!
                                </span>
                            )}
                        </div>

                        {/* Password */}
                        <div className="form-control relative">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <FaLock className="absolute top-8 left-3 text-slate-900 text-xl" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                className="input w-full pl-10 pr-10 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-primary focus:shadow-[0px_2px_10px_-2px_rgba(99,102,241,0.7),0px_2px_15px_-2px_rgba(236,72,153,0.7)] transition duration-300"
                                {...register("password", { required: true })}
                            />
                            <div
                                className="absolute top-8 right-3 text-gray-500 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible size={22} />
                                ) : (
                                    <AiOutlineEye size={22} />
                                )}
                            </div>
                            {errors.password && (
                                <span className="font-semibold text-xs text-fuchsia-600">
                                    This field is required!
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary w-full mt-4">
                            Sign Up
                        </button>

                        {/* Error Message */}
                        {errorMessage && (
                            <div role="alert" className="alert alert-error">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>{errorMessage}</span>
                            </div>
                        )}
                    </form>

                     {/* Sign in with google */}
                                            <div className='text-center'>
                                                <div className="text-center mt-4"></div>
                                                <button
                            onClick={() => {
                                signInWithGoogle()
                                    .then(userCredential => {
                                        const user = userCredential.user;

                                        // Construct user object
                                        const googleUser = {
                                            userId: generateUserId(),
                                            name: user.displayName,
                                            email: user.email,
                                            createdAt: new Date().toISOString(),
                                            role: "customer",
                                            authProvider: "google"
                                        };

                                        // Send to MongoDB
                                        fetch("http://localhost:5000/users", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(googleUser)
                                        })
                                            .then(res => {
                                                if (res.status === 409) {
                                                    // User already exists
                                                    console.log("User already exists in DB");
                                                }
                                                return res.json();
                                            })
                                            .then(() => {
                                                Swal.fire({
                                                    icon: "success",
                                                    title: "Signed in with Google successfully",
                                                    toast: true,
                                                    position: "top-end",
                                                    timer: 1500,
                                                    showConfirmButton: false
                                                });
                                                navigate(from, { replace: true });
                                            })
                                            .catch(err => {
                                                console.error("MongoDB Google user save failed:", err);
                                            });
                                    })
                                    .catch(error => {
                                        console.error("Google Sign-In Error:", error);
                                    });
                            }}

                            className="btn btn-outline btn-primary flex items-center justify-center gap-2"
                        >
                            <FcGoogle />
                            Sign in with Google
                        </button>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="link link-secondary">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default SignUp;
