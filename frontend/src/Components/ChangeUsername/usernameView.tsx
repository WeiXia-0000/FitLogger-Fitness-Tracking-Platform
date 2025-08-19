import './usernameView.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyC4vQuvO7NBuzxXDoLth59z8CQ1MhmGRWU",
    authDomain: "cs409-final-project.firebaseapp.com",
    projectId: "cs409-final-project",
    storageBucket: "cs409-final-project.appspot.com",
    messagingSenderId: "663281725811",
    appId: "1:663281725811:web:f2b0f610827996041bd506",
    measurementId: "G-2MKGQ4WF9H"
};

export default function UsernameView() {
    const [username, setUsername] = useState("");
    const [username2, setUsername2] = useState("");

    const navigate = useNavigate();

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const user = auth.currentUser;

    return (
        <div className="usernameContainter">
            <div>
                <h3>Change My Username</h3>

                <label>My new username</label>
                <input placeholder="New username" onChange={(e)=>setUsername(e.target.value)}/>

                <label>Repeat the username</label>
                <input placeholder="Repeat username" onChange={(e)=>setUsername2(e.target.value)}/>

                <button onClick={
                    async () => {
                        if (username !== username2) {
                            alert("Passwords did not match!")
                        } else {
                            console.log(user?.uid);
                            try {
                                if (user) {
                                    const res = await axios.get(`https://cs409-fp.herokuapp.com/api/users?where={"uid": "${user.uid}"}`);
                                    // const res = await axios.get(`http://localhost:4000/api/users?where={"uid": "${user.uid}"}`);
                                    console.log("here");
                                    if (res) {
                                        const _id = res.data.data[0]._id;
                                        console.log(_id, username)
                                        const update = await axios.put(`https://cs409-fp.herokuapp.com/api/users/${_id}`, {name: username});
                                        // const update = await axios.put(`http://localhost:4000/api/users/${_id}`, {name: username});
                                        console.log(update);
                                    };
                                }
                                navigate('/library');
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
