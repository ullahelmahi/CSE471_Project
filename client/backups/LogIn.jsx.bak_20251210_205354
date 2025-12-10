import React, { useContext } from 'react';
import LoginPage, { Reset, Title, Logo, Email, Banner, ButtonAfter, Password, Input } from '@react-login-page/page2';
import defaultBannerImage from '@react-login-page/page2/banner-image';
import { BsUnlockFill } from "react-icons/bs";
import { AuthContext } from '../../../Providers/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FcGoogle } from "react-icons/fc";
import { saveUserToDb } from '../../Shared/SaveUser/saveUserToDb';


const LogIn = () => {

    const { signInWithEmailPass, signInWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";
    
    // Login confirmation alert
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });



    const handleLogin = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        
        console.log(`Email: ${email}, Pass: ${password}`)

        signInWithEmailPass(email, password)
            .then(userCredential => {
                const user = userCredential.user
                // sign in here
                Toast.fire({
                    icon: "success",
                    title: "Signed in successfully"
                });
                console.log(user);
                navigate(from, { replace: true });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    }

    return (
        <div className='my-32'>
            <form onSubmit={handleLogin}>
                <LoginPage className='rounded-xl' style={{ height: 680 }}>

                    <Title className='font-bold '>
                        Welcome back! Please log in.
                    </Title>

                    <Logo className="text-3xl">
                        <BsUnlockFill />
                    </Logo>
                    <Email type='email' index={2}  placeholder="Username" />
                    <Password type='password' index={3} />

                    {/* <Input name="phone" index={1} placeholder="Phone number">
                    <div>xx</div>
                </Input> */}

                    <Banner>
                        <img src={defaultBannerImage} />
                    </Banner>

                    <ButtonAfter>
                        <div>
                            <h2>New Here! Please <Link className='link link-secondary text-lg ' to={'/signup'}>create an Account</Link> </h2>
                        </div>
                        Forgot <Link to="#">Username / Password?</Link>

                        {/* Sign in with google */}
                        <div className='text-center'>
                            <div className="text-center mt-4"></div>
                            <button
                                onClick={() => {
                                    signInWithGoogle()
                                        .then(userCredential => {
                                            const googleUserInfo = {
                                                name: userCredential.user.displayName,
                                                email: userCredential.user.email,
                                                authProvider: "google"
                                            };

                                            saveUserToDb(googleUserInfo)
                                                .then(() => {
                                                    Toast.fire({
                                                        icon: "success",
                                                        title: "Signed in with Google successfully"
                                                    });
                                                    navigate(from, { replace: true });
                                                })
                                                .catch(error => {
                                                    console.error("Database Save Error:", error);
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

                    </ButtonAfter>
                </LoginPage>
                
            </form>

            
            
            
        </div>
    );
};

export default LogIn;