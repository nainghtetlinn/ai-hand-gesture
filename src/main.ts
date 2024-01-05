import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"

import Hand from "./primitives/hand"
import { handGestures, GE, TypeHandGestures } from "./primitives/gestures"

const loading = document.getElementById("loading")
const gesture = document.getElementById("gesture")
const warning = document.getElementById("warning")
const gestureImg = document.createElement("img")
gestureImg.width = 100
gestureImg.height = 100

const video = document.getElementById("webcam") as HTMLVideoElement
const canvas = document.getElementById("canvas") as HTMLCanvasElement
canvas.width = video.width
canvas.height = video.height
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

let model: handpose.HandPose | null = null

tf.ready()
  .then(() => handpose.load())
  .then(loadedModel => {
    model = loadedModel
    console.log("Model loaded.")

    loading?.remove()

    if (getUserMediaSupported()) {
      enableCam()
      gesture?.classList.remove("hidden")
    } else {
      console.warn("getUserMedia() is not supported by your browser")
      warning?.classList.remove("hidden")
    }
  })
  .catch(err => {
    console.log("Something went wrong", err)
  })

function enableCam() {
  const constraints = {
    video: true,
  }

  navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    video.srcObject = stream
    video.addEventListener("loadeddata", predictWebcam)
  })
}

function predictWebcam() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  model?.estimateHands(video).then(predictions => {
    if (predictions.length > 0) {
      predictions.forEach(prediction => {
        const hand = new Hand(prediction)
        const { gestures } = GE.estimate(prediction.landmarks as any, 8.5)
        console.log(gestures)

        if (gestures.length > 0) {
          const confidence = gestures.map(p => p.score)

          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          )

          putGesture(gestures[maxConfidence].name as any)
        }

        hand.draw(ctx)
      })
    }
  })

  requestAnimationFrame(predictWebcam)
}

function putGesture(pose: TypeHandGestures) {
  console.log(pose)
  const keys = Object.keys(handGestures)
  if (keys.includes(pose)) {
    gestureImg.src = handGestures[pose]
    gesture?.appendChild(gestureImg)
  }
}

// Check if webcam access is supported.
function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}
