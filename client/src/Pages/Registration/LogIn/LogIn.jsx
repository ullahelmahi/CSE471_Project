import React, { useContext, useState } from "react";
import LoginPage, { Reset, Title, Logo, Email, Banner, ButtonAfter, Password } from '@react-login-page/page2';
import defaultBannerImage from '@react-login-page/page2/banner-image';
import { BsUnlockFill } from "react-icons/bs";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { saveUserToDb } from '../../Shared/SaveUser/saveUserToDb';
import API from '../../../services/api';

export default function LogIn() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const Toast = Swal.mixin({
    toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true,
    didOpen: (toast) => { toast.onmouseenter = Swal.stopTimer; toast.onmouseleave = Swal.resumeTimer; }
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await API.post("/auth/login", { email, password });
      const token = res.data.token;
      const userObj = res.data.user;
      // Save auth state
      login(token, userObj);
      Toast.fire({ icon: "success", title: "Signed in successfully" });
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Login failed";
      Swal.fire({ icon: "error", title: "Login failed", text: msg, toast: true, position: "top-end", timer: 2500, showConfirmButton: false });
    }
  };

  return (
    <div className='my-32'>
      <form onSubmit={handleLogin}>
        <LoginPage className='rounded-xl' style={{ height: 680 }}>
          <Title className='font-bold '>Welcome back! Please log in.</Title>
          <Logo className="text-3xl"><BsUnlockFill /></Logo>
          <Email name="email" type='email' index={2} placeholder="Username" />
          <Password name="password" type='password' index={3} />

          <Banner>
            <img src={defaultBannerImage} alt="banner" />
          </Banner>

          <ButtonAfter>
            <div>
              <h2>New Here! Please <Link className='link link-secondary text-lg ' to={'/register'}>create an Account</Link></h2>
            </div>
            Forgot <Link to="#">Username / Password?</Link>

            <div className='text-center'>
              <div className="text-center mt-4"></div>
              <button
                type="button"
                onClick={() => Swal.fire({ icon: "info", title: "Google Sign-In", text: "Google sign-in is not configured. Use email/password.", toast: true, position: "top-end", showConfirmButton: false, timer: 2500 })}
                className="btn btn-outline btn-primary flex items-center justify-center gap-2"
              >
                <FcGoogle />
                Sign in with Google
              </button>
            </div>
          </ButtonAfter>
        </LoginPage>
      </form>
    </div>
  );
}
