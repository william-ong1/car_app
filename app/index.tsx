import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Feather from '@expo/vector-icons/Feather';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.mainContainer}>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync({ base64: true });
    const uri = photo?.uri || ""
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    setUri(uri);
  };

  const renderPicture = () => {
    return (
      <View style={styles.pictureContainer}>
        <Image source={{ uri }} contentFit="contain" style={styles.image} />
        <Pressable onPress={() => setUri(null)} style={styles.retryBtnContainer}>
          <View style={styles.retryBtn}><Feather name="x" size={32} color="white" /></View>
        </Pressable>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        facing="back"
      >
        <Pressable onPress={takePicture} style={styles.cameraBtnContainer}>
          <View style={styles.cameraBtn}></View>
        </Pressable>
      </CameraView>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "black",
    paddingVertical: 60,
    paddingHorizontal: 15,
  },
  camera: {
    flex: 1,
    borderRadius: 30,
    overflow: "hidden",
  },
  cameraBtnContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -42.5 }],
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBtn: {
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 42.5, 
    alignItems: "center",
    justifyContent: "center",
  },
  pictureContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    borderRadius: 30,
    overflow: "hidden",
  },
  retryBtnContainer: {
    position: "absolute",
    top: "2%",
    right: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  retryBtn: {
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
