import { Animated, Dimensions } from "react-native";
import React, { Component } from "react";
import { View, Image } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default class Fusee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: new Animated.Value(-300), // Initial position off the left edge of the screen
    };
  }

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    Animated.timing(this.state.position, {
      toValue: screenWidth, // Final position off the right edge of the screen
      duration: 5000, // Duration of the animation in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  render() {
    return (
      <View>
        <Animated.Image
          source={require("../assets/fusee.png")}
          style={{
            width: 50,
            height: 50,
            transform: [
              { translateX: this.state.position },
              { rotate: "45deg" },
            ],
          }}
        />
      </View>
    );
  }
}
