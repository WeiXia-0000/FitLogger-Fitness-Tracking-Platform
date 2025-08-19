import { Link } from 'react-router-dom'
import { initializeApp } from "firebase/app";
import { getAuth, signOut} from "firebase/auth";
import './userView.css'

const firebaseConfig = {
    apiKey: "AIzaSyC4vQuvO7NBuzxXDoLth59z8CQ1MhmGRWU",
    authDomain: "cs409-final-project.firebaseapp.com",
    projectId: "cs409-final-project",
    storageBucket: "cs409-final-project.appspot.com",
    messagingSenderId: "663281725811",
    appId: "1:663281725811:web:f2b0f610827996041bd506",
    measurementId: "G-2MKGQ4WF9H"
};

export default function UserView() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    return (
        <div className="userContainter">
            <form>
                <h3>My Account</h3>

                <Link to={`/user/changeMyUsername`} >
                    <button>Change My Username</button>
                </Link>

                <Link to={`/user/changeMyPassword`} >
                    <button>Change My Passward</button>
                </Link>

                <Link to={`/login`} >
                    <button onClick={
                        async () => {
                            try {
                                await signOut(auth);
                            } catch (err) {
                                alert(err);
                            }
                        }
                    }>Log out</button>
                </Link>
            </form>
        </div>
    )
}
