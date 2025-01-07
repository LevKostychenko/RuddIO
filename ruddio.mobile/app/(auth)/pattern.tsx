import { Point } from "@/types/point";
import React, { useState } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const PatternScreen = () => {
  const [pattern, setPattern] = useState<Point[]>([]);
  const [completed, setCompleted] = useState(false);

  const handleGesture = (event: any) => {
    const { x, y } = event.nativeEvent;
    setPattern((prevPattern) => [...prevPattern, { x, y }]);
  };

  const handleFinish = () => {
    if (pattern.length < 5) {
      alert("Draw a longer pattern!");
      return;
    }

    setCompleted(true);
    alert("Pattern saved successfully!");
    console.log("Pattern:", pattern);
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Text style={styles.title}>Draw Your Pattern</Text>
        <PanGestureHandler onGestureEvent={handleGesture}>
          <View style={styles.canvas}>
            <Text style={styles.text}>
              {completed ? "Pattern saved!" : "Draw your pattern on this area"}
            </Text>
          </View>
        </PanGestureHandler>
        <Button title="Finish" onPress={handleFinish} />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  canvas: {
    width: 300,
    height: 300,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
});

export default PatternScreen;
