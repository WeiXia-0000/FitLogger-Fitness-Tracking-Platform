import './passwordView.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { initializeApp } from "firebase/app";
import { getAuth, updatePassword} from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyC4vQuvO7NBuzxXDoLth59z8CQ1MhmGRWU",
    authDomain: "cs409-final-project.firebaseapp.com",
    projectId: "cs409-final-project",
    storageBucket: "cs409-final-project.appspot.com",
    messagingSenderId: "663281725811",
    appId: "1:663281725811:web:f2b0f610827996041bd506",
    measurementId: "G-2MKGQ4WF9H"
};

export default function PasswordView() {
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const navigate = useNavigate();

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const user = auth.currentUser;

    return (
        <div className="passwordContainter">
            <div>
                <h3>Change My Password</h3>

                <label>My new password</label>
                <input placeholder="New password" onChange={(e)=>setPassword(e.target.value)}/>

                <label>Repeat the password</label>
                <input placeholder="Repeat password" onChange={(e)=>setPassword2(e.target.value)}/>

                <button onClick={
                    async () => {
                        if (password !== password2) {
                            alert("Passwords did not match!")
                        } else {
                            try {
                                if (user) {
                                    console.log(user.uid)
                                    await updatePassword(user, password);
                                    navigate('/user');
                                }

                            } catch (err) {
                                alert(err);
                            }
                        }
                    }
                }>Confirm</button>

            </div>
        </div>
    )
}
