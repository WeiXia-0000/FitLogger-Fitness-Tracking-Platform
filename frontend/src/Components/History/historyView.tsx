import { useState, useEffect } from "react";
import axios from 'axios';
import TextField from "@mui/material/TextField";
import "./history.css";

interface LogData {
  exerciseId: string,
  userId: string,
  dateCreated: Date,
  sets: number,
  reps: number,
  weight: number,
  notes: string,
  restTime: number,
}

interface ExerciseData {
  _id: string,
  name: string,
  description: string,
  picURL: string,
  vidURL: string,
  bodyParts: [string]
  userId: string | null
}

function HistoryView() {
  const [exercise, setExercise] = useState("");
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [date, setDate] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [showMode, setShowMode] = useState("");
  const [logsData, setLogsData] = useState<LogData[]>([]);
  const [exercisesData, setExercisesData] = useState<ExerciseData[]>([]);

  useEffect(() => {
    axios.get('https://cs409-fp.herokuapp.com/api/logs')
      .then(
        (res) => {
          setLogsData(res.data.data);
          console.log(logsData);
        })
      .catch(
        (error) => {
          console.log(error);
        });
    axios.get("https://cs409-fp.herokuapp.com/api/exercises")
      .then(
        (res) => {
          setExercisesData(res.data.data);
          console.log(exercisesData);
        })
      .catch(
        (error) => {
          console.log(error);
        });
  }, []);

  return (
    <div>
      {showMode.length === 0 &&
        <div className="page">
          <div id="opsHistory">
            <div id="labelsHistory">
              <label id="labelDate">Date:</label>
              <label id="labelExercise">Exercise:</label>
            </div>
            <div id="textFields">
              <TextField
                onChange={(e) => { setDate(e.target.value) }}
                variant="standard"
                fullWidth
                id="inputDate"
              />
              <TextField
                onChange={(e) => { setExercise(e.target.value) }}
                variant="standard"
                fullWidth
                id="inputExercise"
              />
            </div>
            <div className="col3History">
              <button id="searchDate" onClick={
                () => {
                  setDateQuery(date);
                  setShowMode("date");
                }}>Search
              </button>
              <button id="searchExercise" onClick={
                () => {
                  setExerciseQuery(exercise);
                  setShowMode("exercise");
                }}>
                Search
              </button>
            </div>
            <div className="col4History">
              <button id="resetDate" onClick={() => {
                setDateQuery("");
              }}>Reset
              </button>
              <button id="resetExercise" onClick={
                () => {
                  setExerciseQuery("");
                }}>Reset
              </button>
            </div>
          </div>
        </div>
      }
      {showMode.length !== 0 && showMode === "date" &&
        <div>
          <table>
            <tr>
              <th>Date</th>
              <th>Exercise</th>
              <th>Weight (pounds)</th>
              <th>Sets</th>
              <th>Reps</th>
            </tr>
            {logsData.filter(
              logData => {
                const q = dateQuery.toLowerCase();
                return logData.dateCreated.toLocaleString().includes(q)
              }
            ).map((matchedLogData) => (
              <tr>
                <td>{matchedLogData.dateCreated.toLocaleString().split('T')[0]}</td>
                <td>{exercisesData.find((exerciseData) => {
                  return exerciseData._id === matchedLogData.exerciseId;
                })?.name}</td>
                <td>{matchedLogData.weight}</td>
                <td>{matchedLogData.sets}</td>
                <td>{matchedLogData.reps}</td>
              </tr>
            ))
            }
          </table>
          <button onClick={() => { setShowMode("") }}>Back</button>
        </div>
      }
      {showMode.length !== 0 && showMode === "exercise" &&
        <div>
          <table>
            <tr>
              <th>Date</th>
              <th>Exercise</th>
              <th>Weight (pounds)</th>
              <th>Sets</th>
              <th>Reps</th>
            </tr>
            {
              logsData.filter(
                logData => {
                  const q = exerciseQuery.toLowerCase();
                  const exerciseName = exercisesData.find((exerciseData) => exerciseData._id === logData.exerciseId)?.name;
                  console.log(q);
                  console.log(exerciseName);
                  return exerciseName?.includes(q);
                }
              ).map((matchedLogData) => {
                console.log(matchedLogData);
                return (<tr>
                  <td>{matchedLogData.dateCreated.toLocaleString().split('T')[0]}</td>
                  <td>{exercisesData.find((exerciseData) => exerciseData._id === matchedLogData.exerciseId)?.name}</td>
                  <td>{matchedLogData.weight}</td>
                  <td>{matchedLogData.sets}</td>
                  <td>{matchedLogData.reps}</td>
                </tr>)
              })
            }
          </table>
          <button onClick={() => { setShowMode("") }}>Back</button>
        </div>
      }
    </div>
  );
}

export default HistoryView;
