import React, { Component } from "react";
import { View, Image, Animated } from "react-native";

export default class LevitatingAstronaut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translateY: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.translateY, {
          toValue: 20,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.translateY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }

  render() {
    return (
      <View>
        <Animated.Image
          source={require("../assets/astronaute.png")}
          style={{
            width: 50,
            height: 50,
            transform: [{ translateY: this.state.translateY }],
          }}
        />
      </View>
    );
  }
}
