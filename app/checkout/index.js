import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FaceDetector from "expo-face-detector";
import { Camera, CameraType } from "expo-camera";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { useUser, useUserDispatch } from "../../lib/contexts/userContext";
import { router } from "expo-router";

const { width: windowWidth } = Dimensions.get("window");

const PREVIEW_SIZE = 400;
const PREVIEW_RECT = {
  minX: (windowWidth - PREVIEW_SIZE) / 2,
  minY: 50,
  width: PREVIEW_SIZE,
  height: PREVIEW_SIZE,
};

const THRESHOLD = 0.8; // the ratio of face area to preview area to take an image
const FILL_DURATION = 2000; // duration of the fill animation in milliseconds

export default function FaceDetection() {
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [faces, setFaces] = useState([]);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [fillAnimation, setFillAnimation] = useState(0);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const cameraRef = useRef(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const dispatch = useUserDispatch();

  useEffect(() => {
    if (isFaceDetected) {
      setFillAnimation(100);
    } else if (!isFaceDetected) {
      setFillAnimation(0);
    }
  }, [isFaceDetected]);

  function handleChangeName({ first_name, last_name }) {
    dispatch({ type: "SET_FIRST_NAME", payload: first_name });
    dispatch({ type: "SET_LAST_NAME", payload: last_name });
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to access the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0 && !isRequestInProgress) {
      const face = faces[0]; // assume only one face is detected
      const faceWidth = face.bounds.size.width;
      const faceHeight = face.bounds.size.height;
      const faceArea = faceWidth * faceHeight;
      const previewArea = PREVIEW_SIZE * PREVIEW_SIZE;
      const ratio = Math.min(1, faceArea / previewArea); // Ensure the ratio does not exceed 1
      const fillPercentage = ratio * 100;

      setIsFaceDetected(true);
      setFaces(faces);

      // Calculate the fill animation percentage based on the face area ratio
      let fillAnimationPercentage = fillPercentage;

      if (fillPercentage >= 45) {
        // Gradually increase fillAnimationPercentage to 100% over time
        fillAnimationPercentage = 45 + (fillPercentage - 45) * 2;
      }

      setFillAnimation(fillAnimationPercentage); // Set the fill animation based on the face area ratio

      if (fillAnimationPercentage >= 100) {
        capturePhotoAndNavigate(); // Capture photo when face fills 100% of the mask
        console.log("Image taken!");
      }
    } else {
      setIsFaceDetected(false);
      setFaces([]);
      setFillAnimation(0); // Reset the fill animation if no face is detected
    }
  };

  const capturePhotoAndNavigate = async () => {
    if (cameraRef.current && isFaceDetected && !isRequestInProgress) {
      setIsRequestInProgress(true);
      const photo = await cameraRef.current.takePictureAsync();
      const localUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`;

      await FileSystem.copyAsync({
        from: photo.uri,
        to: localUri,
      });

      let form = new FormData();
      form.append("image", {
        uri: localUri,
        name: "image.jpg",
        type: "image/jpg",
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      try {
        const response = await axios.post(apiUrl + "/checkout/", form, config);
        console.log(
          `Response Exists: ${JSON.stringify(response.data, null, 2)}`
        );
        if (response && response.data) {
          handleChangeName({
            first_name: response.data.first_name,
            last_name: response.data.last_name,
          });

          router.push("/goodbye");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            console.log("Error: ", error.response.status);
            alert("Please Check-in first before Checking out!");
            router.push("/welcome");
          } else {
            console.error("Status Code: ", error.response.status);
          }
        }
      } finally {
        setIsRequestInProgress(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={<View style={styles.mask} />}
      >
        <Camera
          ref={cameraRef}
          style={{ ...StyleSheet.absoluteFill }}
          ratio="16:9"
          type={type}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.accurate,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 2000,
            tracking: true,
          }}
        >
          <AnimatedCircularProgress
            style={styles.circularProgress}
            size={PREVIEW_SIZE}
            width={10}
            backgroundWidth={7}
            fill={fillAnimation}
            tintColor="#010089"
            backgroundColor="#e8e8e8"
          />
        </Camera>
      </MaskedView>
      <View style={styles.instructionsContainer}>
        <Text style={styles.action}>
          Move Closer to the Camera Until the Circle is Fully Filled!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 6,
  },
  mask: {
    borderRadius: PREVIEW_SIZE / 2,
    height: PREVIEW_SIZE,
    width: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    alignSelf: "center",
    backgroundColor: "white",
  },
  circularProgress: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    marginLeft: PREVIEW_RECT.minX,
  },
  instructions: {
    fontSize: 20,
    textAlign: "center",
    top: 25,
    position: "absolute",
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: PREVIEW_RECT.minY + PREVIEW_SIZE,
  },
  action: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
});
