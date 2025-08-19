import { useState } from "react"
import { useParams } from "react-router"
import axios from "axios"
import './detailView.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

interface ExerciseData {
    _id: string,
    name: string,
    description: string,
    picURL: string,
    vidURL: string,
    bodyParts: [string]
    userId: string | null
}

export default function DetailView() {
    const { id } = useParams()
    const api = axios.create ( {
        baseURL: "https://cs409-fp.herokuapp.com/api/exercises"
    })
    const exerciseData = api.get('?limit=484')
    const [picURL, setPicURL] = useState("")
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")
    const [bodyParts, setBodyParts] = useState([""])

    exerciseData.then(
        async (res) => {
            res.data.data.forEach((exerciseData: ExerciseData) => {
                if (exerciseData._id === id) {
                    setPicURL(exerciseData.picURL)
                    setDescription(exerciseData.description)
                    setName(exerciseData.name)
                    setBodyParts(exerciseData.bodyParts)
                }
            })
        }
    )

    return (
        <div className="DetailViewContainer">
            <div className="pictureContainer">
                <img src={picURL} alt=""/>
            </div>
            <div className="descriptionContainer">
                <p>Exercise Name: {name}</p>
                <p>Body Parts: {bodyParts.join(', ')}</p>
                <p>Description: {description}</p>
            </div>
            {/* <Card className="card" style={{ width: 600 }}>
                <Card.Img src={picURL}/>
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Body Parts: {bodyParts.join(', ')}</Card.Subtitle>
                    <Card.Text>
                        Description: {description}
                    </Card.Text>
                </Card.Body>
            </Card> */}
        </div>


    )
}
