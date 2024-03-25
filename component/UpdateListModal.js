import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import tempData, { updateTodos } from "../tempData.min.js";
import Colors from "../Colors.min.js";
import {
  updateCardName,
  updateCardDesc,
  getCardsFromListName,
  getIdListByName,
  deleteCard,
} from "../functions.min.js";
import AssigneMemberToCard from "./AssignementMember";
export default class UpdateListModal extends React.Component {
  backgroundColors = [
    "#5CD859",
    "#24A6D9",
    "#595BD9",
    "#8022D9",
    "#D159D8",
    "#D85963",
    "#D88559",
  ];

  state = {
    name: this.props.list.name,
    color: this.props.list.color,
  };

  createTodo = async () => {
    const { name, color } = this.state;

    let result = null;

    this.props.closeModal();

    try {
      const idCard = this.props.list.id;

      nameResult = await updateCardName(idCard, name);

      descResult = await updateCardDesc(idCard, color);
      console.log(this.props.idBoard);
      this.refreshTodos();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }

    this.setState({ name: "" });

    this.props.closeUpdateModal();

    return result;
  };

  refreshTodos = async () => {
    const { projectId, title, idOrganization } = this.props;

    //réccupérer toute les cards de trello
    cards = await getCardsFromListName(title, idOrganization);
    //push toute les cards dans tempdata
    updateTodos(projectId, cards);
    //réeasygner tempdata à list
    this.props.updateList();
  };

  renderColors() {
    return this.backgroundColors.map((color) => {
      return (
        <TouchableOpacity
          key={color}
          style={[styles.colorSelect, { backgroundColor: color }]}
          onPress={() => this.setState({ color })}
        />
      );
    });
  }
  confirmDeleteCard = async () => {
    deleteCard(this.props.list.id).then(() => {
      this.refreshTodos();
    });
    this.props.closeModal;
  };

  handleDelete = () => {
    Alert.alert(
      "Delete Card",
      "Are you sure you want to delete this card?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => this.confirmDeleteCard() },
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TouchableOpacity
          style={{ position: "absolute", top: 64, right: 32 }}
          onPress={this.props.closeUpdateModal}
        >
          <AntDesign name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
        <ScrollView style={{ flex: 1, top: 80 }}>
          <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
            <Text style={styles.title}>Modify Card</Text>
            <TextInput
              style={styles.input}
              defaultValue={this.props.list.name}
              onChangeText={(text) => this.setState({ name: text })}
              selectionColor={this.state.color}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              {this.renderColors()}
            </View>

            <TouchableOpacity
              style={[styles.create, { backgroundColor: this.state.color }]}
              onPress={this.createTodo}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Modify!</Text>
            </TouchableOpacity>
            <AssigneMemberToCard
              idBoard={this.props.idBoard}
              idCard={this.props.list.id}
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "red" }]}
              onPress={this.handleDelete}
            >
              <View style={styles.buttonText}>
                <Text style={{ color: Colors.white }}>Delete this card</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    color: Colors.white,
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.white,
    alignSelf: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  create: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  button: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
});
