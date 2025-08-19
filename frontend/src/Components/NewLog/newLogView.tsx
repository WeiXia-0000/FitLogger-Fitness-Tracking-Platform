import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "./newLog.css";
import axios from 'axios';
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

interface ExerciseData {
  _id: string,
  name: string,
  description: string,
  picURL: string,
  vidURL: string,
  bodyParts: [string]
  userId: string | null
}

function NewLogView() {
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const [query, setQuery] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [exercisesData, setExercisesData] = useState<ExerciseData[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [active, setActive] = useState(-1);

  const createLog = () => {
    if (reps === 0 || weight === 0) {
      return;
    }
    if (exercisesData.length !== 0 && reps !== 0 && weight !== 0) {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const user = auth.currentUser;
      axios.get(`https://cs409-fp.herokuapp.com/api/users?where={"uid": "${user?.uid}"}`)
        .then(function (response) {
          return response.data.data[0]._id;
        })
        .then(userId => {
          axios.post('https://cs409-fp.herokuapp.com/api/logs', {
            exerciseId: selectedExerciseId,
            userId: userId,
            reps: reps,
            weight: weight
          }).then(function (response) {
            console.log(response);
            setShowNotif(true);
          })
            .catch(function (error) {
              console.log(error);
            });
        })
    }
  };

  const selectExercise = (exerciseId: any, idx: number) => {
    setSelectedExerciseId(exerciseId);
    setActive(idx === active ? -1 : idx);
  }

  useEffect(() => {
    axios.create({
      baseURL: "https://cs409-fp.herokuapp.com/api/exercises"
    }).get('?limit=484').then(
      (res) => {
        setExercisesData(res.data.data);
      })
  }, []);

  return (
    <div>
      {!showNotif &&
        <div className="newlog">
          <div id="opsNewLog">
            <div id="labelsNewLog">
              <label id="labelExercise">Exercise:</label>
              <label id="labelWeight">Weight:</label>
              <label id="labelReps">Reps:</label>
            </div>
            <div id="testFields">
              <TextField
                onChange={(e) => { setExercise(e.target.value) }}
                variant="standard"
                fullWidth
                id="textExercise"
              />
              <TextField
                onChange={(e) => { setWeight(parseInt(e.target.value)) }}
                variant="standard"
                fullWidth
                id="textWeight"
              />
              <TextField
                onChange={(e) => { setReps(parseInt(e.target.value)) }}
                variant="standard"
                fullWidth
                id="textReps"
              />
            </div>
            <div className="col3">
              <button id="search" onClick={() => { setQuery(exercise); }}>Search</button>
              <button id="createLog" onClick={createLog}>Create Log</button>
            </div>
            <div>
              <button id="reset" onClick={() => { setQuery(""); }}>Reset</button>
            </div>

          </div>
          <div className="results">
            {query.length !== 0 &&
              exercisesData.filter(
                exerciseData => {
                  const q = query.toLowerCase();
                  return (exerciseData.userId === "") && (exerciseData.name.toLowerCase().includes(q) ||
                    exerciseData.description.toString().includes(q) ||
                    exerciseData.bodyParts.toString().includes(q))
                }
              ).map((exerciseData, idx) => (
                <div
                  style={{ backgroundColor: active === idx ? "#FFDEE9" : 'transparent' }}
                  onClick={() => selectExercise(exerciseData._id, idx)}>
                  <img src={exerciseData.picURL} alt=""/>
                  <p>{exerciseData.name}</p>
                  <p>{exerciseData.bodyParts}</p>
                </div>

              ))}
          </div>
        </div>
      }
      {
        showNotif &&
        <div>
          <h2>Exercise Created!</h2>
          <p>Exercise: {exercisesData.filter((exerciseData => exerciseData._id === selectedExerciseId))[0].name}</p>
          <p>Reps: {reps}</p>
          <p>Weight: {weight}</p>
          <button onClick={() => { setShowNotif(false) }}>Back</button>
        </div>
      }
    </div>
  );
}

export default NewLogView;
