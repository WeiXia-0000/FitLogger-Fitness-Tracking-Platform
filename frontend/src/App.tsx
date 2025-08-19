import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from "react-router-dom"
import { useState, useEffect } from 'react'

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged} from "firebase/auth";

import NewLogView from './Components/NewLog/newLogView';
import LibraryView from './Components/Library/libraryView';
import HistoryView from './Components/History/historyView';
import LoginView from './Components/Login/loginView';
import SignupView from './Components/Signup/signupView';
import DetailView from './Components/Detail/detailView';
import UserView from './Components/User/userView';
import UsernameView from './Components/ChangeUsername/usernameView';
import PasswordView from './Components/ChangePassword/passwordView';

const firebaseConfig = {
  apiKey: "AIzaSyC4vQuvO7NBuzxXDoLth59z8CQ1MhmGRWU",
  authDomain: "cs409-final-project.firebaseapp.com",
  projectId: "cs409-final-project",
  storageBucket: "cs409-final-project.appspot.com",
  messagingSenderId: "663281725811",
  appId: "1:663281725811:web:f2b0f610827996041bd506",
  measurementId: "G-2MKGQ4WF9H"
};

function App() {
  const fb_app = initializeApp(firebaseConfig);
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = getAuth(fb_app);
    const listener = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user);
    });

    return () => {
      listener();
    };
  }, [])
  return (
    <Router>
      <div className="App">
        <div className="NavBar">
          <Link to="/new">
            <button className="ViewButton">New</button>
          </Link>
          <Link to="/library">
            <button className="ViewButton">Library</button>
          </Link>
          <Link to="/history">
            <button className="ViewButton">History</button>
          </Link>
          {
            isAuthenticated ? 
            <Link to="/user">
              <button className="LoginButton">User</button>
            </Link> :
            <Link to="/login">
              <button className="LoginButton">Login</button>
            </Link>   
          }
        </div>
        <Routes>
          <Route path="/"></Route>
          <Route path="/new" element={<NewLogView></NewLogView>}></Route>
          <Route path="/history" element={<HistoryView></HistoryView>}></Route>
          <Route path="/library" element={<LibraryView></LibraryView>}></Route>
          <Route path="/login" element={<LoginView></LoginView>}></Route>
          <Route path="/user" element={<UserView></UserView>}></Route>
          <Route path="/signup" element={<SignupView></SignupView>}></Route>
          <Route path="/exercise/:id" element={<DetailView></DetailView>}></Route>
          <Route path="/user/changeMyUsername" element={<UsernameView></UsernameView>}></Route>
          <Route path="/user/changeMyPassword" element={<PasswordView></PasswordView>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
