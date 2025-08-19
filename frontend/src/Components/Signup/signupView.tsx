import { useState } from 'react';
import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import './signupView.css'
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyC4vQuvO7NBuzxXDoLth59z8CQ1MhmGRWU",
    authDomain: "cs409-final-project.firebaseapp.com",
    projectId: "cs409-final-project",
    storageBucket: "cs409-final-project.appspot.com",
    messagingSenderId: "663281725811",
    appId: "1:663281725811:web:f2b0f610827996041bd506",
    measurementId: "G-2MKGQ4WF9H"
};

export default function SignupView() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const navigate = useNavigate();

    // Initialize Firebase
    const fb_app = initializeApp(firebaseConfig);
    const auth = getAuth(fb_app);

    axios.create({
        baseURL: "https://cs409-fp.herokuapp.com/api/users"
    })

    return (
        <div className="signupContainter">
            <div>
                <h3>Join In Us Here</h3>

                <label>Email</label>
                <input type="text" placeholder="Email" id="email"
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <label>Username</label>
                <input type="text" placeholder="Username" id="username"
                    onChange={(e)=>setUsername(e.target.value)}
                />

                <label>Password</label>
                <input type="password" placeholder="Password" id="password"
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <label>Repeat your Password</label>
                <input type="password" placeholder="Password" id="password"
                    onChange={(e)=>setRePassword(e.target.value)}
                />

                <button onClick={
                    async () => {
                        if (password !== rePassword) {
                            alert("Passwords did not match!")
                        } else {
                            try {
                                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                                console.log(userCredential.user)

                                const data = {
                                    name: username,
                                    email: email,
                                    uid: userCredential.user.uid
                                }
                                console.log(data)

                                const userData = await axios.post("https://cs409-fp.herokuapp.com/api/users", data)
                                console.log(userData)

                                navigate("/library");
                            } catch (err) {
                                alert(err);
                            }
                        }
                    }
                }>Signup</button>

                <label>Already have an account? &nbsp;
                    <Link to="/login">Login</Link>
                </label>
            </div>
        </div>
    )
}
