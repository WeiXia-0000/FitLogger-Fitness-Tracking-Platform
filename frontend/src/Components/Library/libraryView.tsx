import { useEffect, useState, Component} from "react"
import axios from "axios"
import { Link } from 'react-router-dom'
import './libraryView.css'
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

class ExerciseSelector extends Component<ExerciseData, {}> {
    render() {
        return (
            <Link to={`/exercise/${this.props._id}`} >
                <button className="iconButton">
                    <div className="iconPicture">
                        <img src={ this.props.picURL } alt=""/>
                    </div>
                    <div className="iconInfo">
                        <div className="iconInfoName">{ this.props.name}</div>
                        <div className="iconInfoBodyPart">{ this.props.bodyParts.join(", ")}</div>
                    </div>
                </button>
            </Link>
        )
    }
}

export default function LibraryView() {
    const api = axios.create ( {
        baseURL: "https://cs409-fp.herokuapp.com/api/exercises"
    })
    const exerciseData = api.get('?limit=484')

    const [bodyPart, setBodyPart] = useState("")
    const [exerciseList, setExerciseList] = useState<ExerciseData[]>([])
    const [filterExerciseList, setFilterExerciseList] = useState<ExerciseData[]>([])
    const bodyParts = ["All", "Arms", "Abs", "Back", "Butt/Hips", "Chest", "Legs - Thighs", "Full Body/Integrated", "Shoulders"]
    const fb_app = initializeApp(firebaseConfig);
    const auth = getAuth(fb_app);
    const user = auth.currentUser;


    useEffect(() => {
        try {
            if (exerciseList.length === 0) {
                exerciseData.then(
                    async (res) => {
                        res.data.data.forEach((exerciseData: ExerciseData) => {
                            let _id = exerciseData._id
                            let name = exerciseData.name
                            let picURL = exerciseData.picURL
                            let description = exerciseData.description
                            let vidURL = exerciseData.vidURL
                            let bodyParts = exerciseData.bodyParts
                            let userId = exerciseData.userId
                            setExerciseList(cur => [...cur, {_id, name, description, picURL, vidURL, bodyParts, userId}])
                        })
                    }
                )
            }
        } catch (e) {
            console.log(e)
        }

        if (bodyPart === "" || bodyPart === "all") {
            setFilterExerciseList(exerciseList.filter(el => el.userId === "" || (user && user.uid === el.userId)))
        } else {
            setFilterExerciseList(
                exerciseList.filter(
                    el => el.bodyParts.some(
                        el => el.toLowerCase() === bodyPart.toLowerCase()) && (el.userId === "" || (user && user.uid === el.userId))
                )
            )
        }
    }, [exerciseList, bodyPart])

    return (
        <div className="LibraryContainer">
            <div className="typeFilter">
                { bodyParts.map((type:string) => (
                    <button key={type} className="typeButton" onClick={()=>setBodyPart(type.toLocaleLowerCase())}>{type}</button>
                    ))
                }
            </div>
            <div className="exerciseGallery">
                {
                    filterExerciseList.map(
                        ({_id, name, description, picURL, vidURL, bodyParts, userId}: ExerciseData) => {
                            return <ExerciseSelector
                                _id={_id}
                                name={name}
                                description={description}
                                picURL={picURL}
                                vidURL={vidURL}
                                bodyParts={bodyParts}
                                userId={userId}
                            />
                        }
                    )
                }
            </div>
        </div>
    )
}
