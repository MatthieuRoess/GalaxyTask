import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
  Modal,
  Pressable,
  TextInput,
  Alert,
  Keyboard,
} from "react-native";
import GifImage from "@lowkey/react-native-gif";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useEffect, useState } from "react";
import ViewPager from "react-native-pager-view";
import ParticleEffect from "./ParticleEffect";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  getAllListNames,
  getCardsFromListName,
  postNewList,
  archiveList,
  getIdListByName,
  UpdateList,
} from "../functions.min.js";
import tempData, { updateTodos } from "../tempData.min.js";
const backgroundImage = require("../assets/indexPhoto.png");
const { width, height } = Dimensions.get("window");
const title = require("../assets/indexTitle.png");
const planetImages = [
  require("../assets/indexPlanetNew.png"),
  require("../assets/indexPlanet.png"),
  require("../assets/indexPlanet1.png"),
  require("../assets/indexPlanet2.png"),
  require("../assets/indexPlanet3.png"),
  require("../assets/indexPlanet4.png"),
  require("../assets/indexPlanet5.png"),
];
const gifModal = require("../assets/gifModal.gif");

const App = ({ route }) => {
  const {
    planetNames: initialPlanetNames,
    boardId: boardId,
    idOrganization: idOrganization,
  } = route.params || {};
  const [planetNames, setPlanetNames] = useState(initialPlanetNames || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [UpdateModalVisible, setUpdateModalVisible] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [keyboardStatus, setKeyboardStatus] = useState("Keyboard Hidden");
  const [selectedListId, setSelectedListId] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [updateListName, setUpdateListName] = useState("");
  const scrollPosition = useRef(new Animated.Value(0)).current;
  const allPlanetNames = ["Create New List", ...planetNames];
  const [zoomValues, setZoomValues] = useState(
    Array(allPlanetNames.length)
      .fill()
      .map(() => new Animated.Value(1))
  );

  useEffect(() => {
    if (!initialPlanetNames) {
      getAllListNames(boardId)
        .then((names) => {
          setPlanetNames(names);
        })
        .catch((error) => console.error(error));
    }
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleNewListPress = () => {
    setModalVisible(true);
  };

  const handleUpdateListPress = (index) => {
    const listName = planetNames[index - 1];
    getIdListByName(listName, boardId)
      .then((listId) => {
        setSelectedListId(listId);
        setUpdateModalVisible(true);
      })
      .catch((error) => console.error(error));
  };

  const handleLongPress = (index) => {
    if (index === 0) {
      return;
    }
    const listName = planetNames[index - 1];
    getIdListByName(listName, boardId)
      .then((listId) => {
        setSelectedListId(listId);
        setDeleteModalVisible(true);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const allPlanetNames = ["Create New List", ...planetNames];
    setZoomValues(
      Array(allPlanetNames.length)
        .fill()
        .map(() => new Animated.Value(1))
    );
  }, [planetNames]);

  const spin = scrollPosition.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    if (isFocused) {
      // Reset the zoom values here
      zoomValues.forEach((value) => {
        Animated.timing(value, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [isFocused]);

  const handlePress = async (index) => {
    const adjustedIndex = index - 1;
    const listName = planetNames[adjustedIndex];
    if (zoomValues[index]) {
      Animated.timing(zoomValues[index], {
        toValue: 8,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }

    if (!planetNames[adjustedIndex]) {
      console.error(`No data found at index ${adjustedIndex}`);
      return;
    }

    // Start the animation immediately when the user clicks
    Animated.timing(zoomValues[index], {
      toValue: 8,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    getCardsFromListName(listName, idOrganization)
      .then((cards) => {
        // Update the todos in tempData with the real card IDs and names
        updateTodos(index, cards);
        // Check if tempData[index] is defined
        if (!tempData) {
          console.error(`No data found in tempData at index ${index}`);
          return;
        }
        navigation.navigate("Details", {
          projectId: index,
          title: listName,
          boardId: boardId,
          idOrganization: idOrganization,
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  if (selectedListId) {
                    Alert.alert(
                      "Confirmation",
                      "Are you sure you want to archive this list?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => {
                            archiveList(selectedListId)
                              .then(() => {
                                setDeleteModalVisible(!deleteModalVisible);
                                // Refresh the list of planet names
                                getAllListNames(boardId)
                                  .then((names) => {
                                    const allNames = [
                                      "Create New List",
                                      ...names,
                                    ];
                                    setPlanetNames(names);
                                    setZoomValues(
                                      Array(allNames.length)
                                        .fill()
                                        .map(() => new Animated.Value(1))
                                    );
                                  })
                                  .catch((error) => console.error(error));
                              })
                              .catch((error) => console.error(error));
                          },
                        },
                      ]
                    );
                  }
                }}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setDeleteModalVisible(!deleteModalVisible)}
              >
                <Text style={styles.textStyle}>Leave</Text>
              </Pressable>
            </View>
            {keyboardStatus === "Keyboard Hidden" && (
              <GifImage
                source={gifModal}
                style={{
                  width: 150,
                  height: 150,
                }}
                resizeMode={"cover"}
              />
            )}
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              onChangeText={setNewListName}
              value={newListName}
              placeholder="Create a new list"
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  if (newListName.trim() === "") {
                    Alert.alert("Error", "Please enter a list name");
                  } else {
                    postNewList(boardId, newListName)
                      .then(() => {
                        setModalVisible(!modalVisible);
                        setNewListName("");
                        getAllListNames(boardId)
                          .then((names) => {
                            setPlanetNames(names);
                          })
                          .catch((error) => console.error(error));
                      })
                      .catch((error) => console.error(error));
                  }
                }}
              >
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Leave</Text>
              </Pressable>
            </View>
            {keyboardStatus === "Keyboard Hidden" && (
              <GifImage
                source={gifModal}
                style={{
                  width: 150,
                  height: 150,
                }}
                resizeMode={"cover"}
              />
            )}
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={UpdateModalVisible}
        onRequestClose={() => {
          setUpdateModalVisible(!UpdateModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              onChangeText={setUpdateListName}
              value={updateListName}
              placeholder="Update list"
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  if (selectedListId) {
                    if (updateListName.trim() === "") {
                      Alert.alert("Error", "Please enter a new list name");
                    } else {
                      UpdateList(selectedListId, updateListName)
                        .then(() => {
                          setUpdateModalVisible(!UpdateModalVisible);
                          setUpdateListName("");
                          // Refresh the list of planet names
                          getAllListNames(boardId)
                            .then((names) => {
                              setPlanetNames(names);
                            })
                            .catch((error) => console.error(error));
                        })
                        .catch((error) => console.error(error));
                    }
                  }
                }}
              >
                <Text style={styles.textStyle}>Update</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setUpdateModalVisible(!UpdateModalVisible)}
              >
                <Text style={styles.textStyle}>Leave</Text>
              </Pressable>
            </View>
            {keyboardStatus === "Keyboard Hidden" && (
              <GifImage
                source={gifModal}
                style={{
                  width: 150,
                  height: 150,
                }}
                resizeMode={"cover"}
              />
            )}
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <ImageBackground
          source={backgroundImage}
          resizeMode="cover"
          style={styles.image}
        >
          {isFocused && <ParticleEffect />}
          <Image source={title} style={styles.title} resizeMode="contain" />
          <ViewPager
            style={{ width: "100%", height: "100%" }}
            initialPage={0}
            onPageScroll={({ nativeEvent }) => {
              scrollPosition.setValue(
                nativeEvent.offset + nativeEvent.position
              );
            }}
          >
            {allPlanetNames.map((planetName, index) => {
              const imageIndex =
                index === 0 ? 0 : (index % (planetImages.length - 2)) + 1;
              const planetImage = planetImages[imageIndex];

              //Allows to hide the names of the list when zooming.
              const opacity = zoomValues[index]
                ? zoomValues[index].interpolate({
                    inputRange: [1, 5],
                    outputRange: [1, 0],
                  })
                : 1;

              return (
                <View key={index} style={styles.page}>
                  <TouchableOpacity
                    onPress={
                      index === 0
                        ? handleNewListPress
                        : () => handlePress(index)
                    }
                    onLongPress={() => handleLongPress(index)}
                  >
                    <Animated.Image
                      source={planetImage}
                      style={[
                        styles.planet,
                        {
                          transform: [
                            { rotate: spin },
                            {
                              scale: zoomValues[index] ? zoomValues[index] : 1,
                            },
                          ],
                        },
                      ]}
                      resizeMode="contain"
                    />
                    <Animated.View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: opacity,
                      }}
                    >
                      <Text style={styles.planetName}>
                        {index === 0
                          ? "Create New List"
                          : planetNames[index - 1]}
                      </Text>
                      {index !== 0 && (
                        <TouchableOpacity
                          onPress={() => handleUpdateListPress(index)}
                        >
                          <MaterialCommunityIcons
                            name="pencil-box-outline"
                            size={30}
                            color={colors.white}
                            style={{ marginLeft: 5 }}
                          />
                        </TouchableOpacity>
                      )}
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ViewPager>
        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  planet: {
    width: width * 0.4,
    height: height * 0.5,
    top: height * 0.1,
    left: width * 0.3,
  },
  title: {
    width: width * 0.8,
    height: height * 0.1,
    top: height * 0.001,
    left: width * 0.12,
  },
  planetName: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
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
    height: "50%",
    width: "70%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    marginRight: 10,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginLeft: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
  },
});

export default App;
