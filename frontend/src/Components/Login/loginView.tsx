import { Link, useNavigate } from 'react-router-dom'
import './loginView.css'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';

const firebaseConfig = {
    apiKey: "AIzaSyC4vQuvO7NBuzxXDoLth59z8CQ1MhmGRWU",
    authDomain: "cs409-final-project.firebaseapp.com",
    projectId: "cs409-final-project",
    storageBucket: "cs409-final-project.appspot.com",
    messagingSenderId: "663281725811",
    appId: "1:663281725811:web:f2b0f610827996041bd506",
    measurementId: "G-2MKGQ4WF9H"
};

export default function LoginView() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const navigate = useNavigate();

    return (
        <div className="loginContainer">
            <div>
                <h3>Login Here</h3>

                <label>Email</label>
                <input type="text" placeholder="Email" id="username"
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <label>Password</label>
                <input type="password" placeholder="Password" id="password"
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <button onClick={
                    async () => {
                        try {
                            const userCredential = await signInWithEmailAndPassword(auth, email, password)
                            console.log(userCredential.user)
                            navigate('/library');
                        } catch (err) {
                            alert(err);
                        }
                    }
                }>Log In</button>

                <label>Not a member? &nbsp;
                    <Link to="/signup">Register</Link>
                </label>
            </div>
        </div>
    )
}
