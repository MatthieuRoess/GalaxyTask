import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import TodoList from "./TodoList";
import tempData from "../tempData.min.js";
import AddListModal from "./AddListModal";
import colors from "../Colors.min.js";
import LevitatingAstronaut from "./LevitatingAstronaut";
import Fusee from "./Fusee";

export default class App extends React.Component {
  state = {
    addTodoVisible: false,
    list: tempData,
    projectId: this.props.route.params.projectId,
    title: this.props.route.params.title,
    boardId: this.props.route.params.boardId,
    idOrganization: this.props.route.params.idOrganization,
  };

  toggleAddTodoModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  }

  renderList = (list) => {
    return (
      <TodoList
        list={list}
        updateList={this.updateList}
        projectId={this.state.projectId}
        title={this.state.title}
        boardId={this.state.boardId}
        idOrganization={this.state.idOrganization}
      />
    );
  };

  updateList = () => {
    this.setState({ list: tempData });
  };

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          visible={this.state.addTodoVisible}
          onRequestClose={() => this.toggleAddTodoModal()}
        >
          <AddListModal
            closeModal={() => this.toggleAddTodoModal()}
            addList={this.addList}
            projectId={this.state.projectId}
            title={this.state.title}
            boardId={this.state.boardId}
            updateList={this.updateList}
            idOrganization={this.state.idOrganization}
          />
        </Modal>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.divider} />
          <Text style={styles.title}>
            Todo{" "}
            <Text style={{ fontWeight: "300", color: colors.white }}>
              Lists
            </Text>
          </Text>
          <View style={styles.divider} />
        </View>
        <Fusee />
        <LevitatingAstronaut />
        <View style={{ marginVertical: 48 }}>
          <TouchableOpacity
            style={styles.addList}
            onPress={() => this.toggleAddTodoModal()}
          >
            <AntDesign name="plus" size={32} color={colors.lightGray} />
          </TouchableOpacity>

          <Text style={styles.add}>Add Card</Text>
        </View>

        <View style={{ height: 275, paddingLeft: 32 }}>
          <FlatList
            data={this.state.list}
            keyExtractor={(item) => item.name}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => this.renderList(item)}
            keyboardShouldPersistTaps="always"
            boardId={this.state.boardId}
            idOrganization={this.state.idOrganization}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.black,
  },
  divider: {
    backgroundColor: colors.lightGray,
    height: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.white,
    paddingHorizontal: 64,
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: colors.lightGray,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
});
