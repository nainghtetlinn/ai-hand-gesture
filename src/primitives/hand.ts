import { AnnotatedPrediction } from "@tensorflow-models/handpose"
import Point from "./point"
import Segment from "./segment"

// const fingerJoints = {
//   thumb: [0, 1, 2, 3, 4],
//   indexFinger: [0, 5, 6, 7, 8],
//   middleFinger: [0, 9, 10, 11, 12],
//   ringFinger: [0, 13, 14, 15, 16],
//   pinky: [0, 17, 18, 19, 20],
// }

const fingers: number[][] = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
  [17, 18, 19, 20],
]

export default class Hand {
  prediction: AnnotatedPrediction
  points: Point[]
  segments: Segment[]
  constructor(prediction: AnnotatedPrediction) {
    this.prediction = prediction
    this.points = []
    this.segments = []

    this.#generateHand()
  }

  #generateHand() {
    const landmarks = this.prediction.landmarks
    const palmPoint = new Point(landmarks[0][0], landmarks[0][1])
    this.points.push(palmPoint)

    // loop through fingers
    fingers.forEach(finger => {
      const jointPoints: Point[] = []

      // loop through joint
      finger.forEach((joint, j) => {
        const currentJoint = new Point(landmarks[joint][0], landmarks[joint][1])
        jointPoints.push(currentJoint)

        /****************** */
        const isFirstJoint = j === 0
        if (isFirstJoint) {
          const segment = new Segment(palmPoint, currentJoint)
          this.segments.push(segment)
        } else {
          const segment = new Segment(jointPoints[j - 1], currentJoint)
          this.segments.push(segment)
        }
      })

      this.points.push(...jointPoints)
    })
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const seg of this.segments) {
      seg.draw(ctx)
    }

    for (const point of this.points) {
      point.draw(ctx, { fill: true })
    }
  }
}
