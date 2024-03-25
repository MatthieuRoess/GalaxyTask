import "react-native-gesture-handler";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./component/AppScreen";
import DetailsScreen from "./component/DetailsScreen";
import Galaxy from "./component/Galaxie";
import Astronaut from "./component/Astronaut";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Astronaut">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Galaxy" component={Galaxy} />
        <Stack.Screen name="Astronaut" component={Astronaut} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
