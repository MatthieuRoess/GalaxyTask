import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const starImage = require("../assets/starAnimation.png");

const Particle = ({ color, size, startX, startY }) => {
  const x = useRef(new Animated.Value(startX)).current;
  const y = useRef(new Animated.Value(startY)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(x, {
        toValue: Math.random() * 400 - 200, // Déplacer horizontalement de manière aléatoire
        duration: 3000, // Durée de l'animation
        useNativeDriver: true,
      }),
      Animated.timing(y, {
        toValue: Math.random() * 400 - 200, // Déplacer verticalement de manière aléatoire
        duration: 3000, // Durée de l'animation
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.Image
      source={starImage}
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          transform: [{ translateX: x }, { translateY: y }],
        },
      ]}
    />
  );
};

const ParticleEffect = () => {
  return (
    <View style={styles.container}>
      {[...Array(50).keys()].map((_, index) => (
        <Particle
          key={index}
          color="white"
          size={Math.random() * 10 + 23} // Taille de la particule aléatoire
          startX={200} // Position de départ horizontale
          startY={200} // Position de départ verticale
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  particle: {
    position: "absolute",
  },
});

export default ParticleEffect;
