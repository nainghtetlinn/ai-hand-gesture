import victory from "../assets/victory-hand.svg"
import thumbs_up from "../assets/thumbs-up.svg"
import love_you from "../assets/love-you.svg"

import {
  GestureDescription,
  GestureEstimator,
  Gestures,
  FingerCurl,
  Finger,
} from "fingerpose"

const LoveYouGesture = new GestureDescription("love_you")
LoveYouGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl)
LoveYouGesture.addCurl(Finger.Index, FingerCurl.NoCurl)
LoveYouGesture.addCurl(Finger.Middle, FingerCurl.FullCurl)
LoveYouGesture.addCurl(Finger.Ring, FingerCurl.FullCurl)
LoveYouGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl)

export const GE = new GestureEstimator([
  Gestures.VictoryGesture,
  Gestures.ThumbsUpGesture,
  LoveYouGesture,
])

export type TypeHandGestures = "victory" | "thumbs_up" | "love_you"

export const handGestures = {
  victory,
  thumbs_up,
  love_you,
}
