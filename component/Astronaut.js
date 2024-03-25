import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Button,
} from "react-native";
import {
  getAllOrganisations,
  postNewOrganisation,
  deleteOrganisation,
  updateOrganisation,
} from "../functions.min.js";

// Import your images
const astronautImages = [
  require("../assets/astronaut.png"),
  require("../assets/astronaut1.png"),
  require("../assets/astronaut2.png"),
  require("../assets/astronaut3.png"),
  require("../assets/astronaut4.png"),
];

const { width, height } = Dimensions.get("window");
const backgroundImage = require("../assets/indexPhoto.png");
const title = require("../assets/indexTitle.png");
const add = require("../assets/add.png");

const Astronaut = ({ navigation }) => {
  const [astronauts, setAstronauts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [astronautName, setAstronautName] = useState("");
  const [astronautId, setAstronautId] = useState("");

  const handleAstronautSelect = (astronaut) => {
    navigation.navigate("Galaxy", {
      idOrganization: astronaut.id,
    });
  };

  const handleAstronautLongSelect = (astronaut) => {
    setEditModalVisible(true);
    setAstronautName(astronaut.displayName);
    setAstronautId(astronaut.id);
  };

  const addAstronaut = () => {
    if (astronauts.length <= 4 && astronautName !== "") {
      postNewOrganisation(astronautName) // Use the astronautName here
        .then((newAstronaut) => {
          setAstronauts([...astronauts, newAstronaut]);
          setModalVisible(false);
          alert("Workspace added");
        })
        .catch(console.error);
    } else {
      alert("You can only have 5 Workspace");
      setModalVisible(false);
    }
  };

  const editAstronaut = () => {
    updateOrganisation(astronautId, astronautName)
      .then((updatedAstronaut) => {
        setAstronauts(
          astronauts.map((astronaut) =>
            astronaut.id === astronautId ? updatedAstronaut : astronaut
          )
        );
        setEditModalVisible(false);
        alert("Workspace edited");
      })
      .catch(console.error);
  };

  const deleteAstronaut = () => {
    Alert.alert(
      "Delete Workspace",
      "Are you sure you want to delete this workspace?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            deleteOrganisation(astronautId)
              .then(() => {
                setAstronauts(
                  astronauts.filter((astronaut) => astronaut.id !== astronautId)
                );
                setEditModalVisible(false);
                alert("Workspace deleted");
              })
              .catch(console.error);
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    getAllOrganisations()
      .then((organisations) => {
        setAstronauts(organisations);
      })
      .catch(console.error);
  }, []);

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.image}
    >
      {/* Add the addModal here */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 30,
                marginBottom: 20,
                fontWeight: "bold",
              }}
            >
              New Workspace
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                width: 200,
                marginBottom: 20,
                textAlign: "center",
                backgroundColor: "#f8f8f8",
                borderRadius: 5,
                paddingHorizontal: 10,
              }}
              placeholder="Enter workspace name"
              onChangeText={(text) => setAstronautName(text)}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: 200,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "green",
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  marginRight: 10,
                  alignItems: "center",
                }}
                onPress={addAstronaut}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  marginLeft: 10,
                  alignItems: "center",
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* add the editModal here */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 30,
                marginBottom: 20,
                fontWeight: "bold",
              }}
            >
              Edit Workspace
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                width: 200,
                marginBottom: 20,
                textAlign: "center",
                backgroundColor: "#f8f8f8",
                borderRadius: 5,
                paddingHorizontal: 10,
              }}
              placeholder="Enter workspace name"
              value={astronautName}
              onChangeText={(text) => setAstronautName(text)}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: 200,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "green",
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  marginRight: 10,
                  alignItems: "center",
                }}
                onPress={editAstronaut}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "gray",
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  alignItems: "center",
                }}
                onPress={deleteAstronaut}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  marginLeft: 10,
                  alignItems: "center",
                }}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add the title image here */}
      <Image source={title} style={styles.title} resizeMode="contain" />

      {/* Add the add button here */}
      <TouchableOpacity
        style={styles.add}
        onPress={() => setModalVisible(true)}
      >
        <Image source={add} style={{ width: 50, height: 50 }} />
      </TouchableOpacity>

      {/* Add the astronauts here */}
      {astronauts.map((astronaut, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleAstronautSelect(astronaut)}
          onLongPress={() => handleAstronautLongSelect(astronaut)}
          style={[styles[`astronaut${index}`], { width: 50 }]}
        >
          <Image
            source={astronautImages[index]}
            style={styles.astronautImage}
            resizeMode="contain"
          />
          <Text style={styles.astronautName}>{astronaut.displayName}</Text>
        </TouchableOpacity>
      ))}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  add: {
    top: height * -0.074,
    left: width * 0.06,
  },
  astronaut0: {
    top: height * 0.24,
    left: width * 0.4,
  },
  astronaut1: {
    top: height * -0.1,
    left: width * 0.1,
  },
  astronaut2: {
    top: height * -0.15,
    left: width * 0.8,
  },
  astronaut3: {
    top: height * 0.12,
    left: width * 0.05,
  },
  astronaut4: {
    top: height * 0.01,
    left: width * 0.7,
  },
  astronautImage: {
    width: width * 0.2,
    height: height * 0.1,
  },
  astronautName: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  title: {
    width: width * 0.8,
    height: height * 0.1,
    top: height * 0.001,
    left: width * 0.12,
  },
  image: {
    flex: 1,
  },
});

export default Astronaut;
