import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import colors from "../Colors.min.js";
import {
  updateCardState,
  getChecklistId,
  deleteTaskOfCard,
  getCardsFromListName,
  addCheckListItem,
} from "../functions.min.js";
import SwipeGesture from "react-native-swipe-gestures";
import AssignementMember from "./AssignementMember";
import tempData, { updateTodos } from "../tempData.min.js";

export default class TodoList extends React.Component {
  state = {
    newTodo: "",
    dialogVisible: false,
    isModalVisible: false,
  };

  toggleTodoCompleted = async (index) => {
    let list = this.props.list;
    const idCard = list.id;
    const idCheckList = await getChecklistId(idCard);

    //id de la task selectionnée dans la list todo
    const idTask = list.todos[index].idCheckItem;

    const stateValue = list.todos[index].completed;
    let state = "";
    if (stateValue) {
      state = "incomplete";
    } else {
      state = "complete";
    }
    await updateCardState(idCard, idCheckList, idTask, state);

    this.refreshTodos();
  };

  addTodo = async () => {
    const list = this.props.list;
    const idCard = list.id;
    const idCheckList = await getChecklistId(idCard);
    const newItemCheckList = await addCheckListItem(
      this.state.newTodo,
      idCheckList
    );

    //récupère la nouvelle list depuis trello
    this.refreshTodos();
    //vide l'input
    this.setState({ newTodo: "" });
    //désactive le clavier
    Keyboard.dismiss();
  };

  deleteTodo = (index) => {
    Alert.alert(
      "Delete Todo",
      "Are you sure you want to delete this todo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => this.confirmDeleteTodo(index) },
      ],
      { cancelable: false }
    );
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

  confirmDeleteTodo = async (index) => {
    let list = this.props.list;

    //id de la task selectionnée dans la list todo
    idTask = list.todos[index].idCheckItem;
    //id de la checklist de la card de la task selectionnée
    idChecklist = list.todos[index].idChecklist;

    deleteTaskOfCard(idChecklist, idTask).then(() => {
      this.refreshTodos();
    });
  };

  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  renderTodo = (todo, index) => {
    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
          <Ionicons
            name={todo.completed ? "square" : "square-outline"}
            size={24}
            color={colors.gray}
            style={{ width: 32 }}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.todo,
            { textDecorationLine: todo.completed ? "line-through" : "none" },
            { color: todo.completed ? colors.gray : colors.white },
          ]}
          onLongPress={() => this.deleteTodo(index)}
        >
          {todo.title}
        </Text>
      </View>
    );
  };
  render() {
    const list = this.props.list;
    const taskCount = list.todos.length;
    const completedCount = list.todos.filter((todo) => todo.completed).length;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            style={{ position: "absolute", top: 64, right: 32, zIndex: 10 }}
            onPress={this.props.closeModal}
          >
            <AntDesign name="close" size={24} color={colors.white} />
          </TouchableOpacity>
          <View
            style={[
              styles.section,
              styles.header,
              { borderBottomColor: list.color },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.title}>{list.name}</Text>
              <TouchableOpacity onPress={this.props.closeUpdateModal}>
                <MaterialCommunityIcons
                  name="pencil-box-outline"
                  size={30}
                  color={colors.white}
                  style={{ marginLeft: 10, marginTop: 5 }}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.taskCount}>
              {completedCount} of {taskCount} tasks
            </Text>
          </View>
          <View style={[styles.section, { flex: 3 }]}>
            <FlatList
              data={list.todos}
              renderItem={({ item, index }) => this.renderTodo(item, index)}
              keyExtractor={(item) => item.title}
              contentContainerStyle={{
                paddingHorizontal: 32,
                paddingVertical: 64,
              }}
              extraData={list.todos}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View style={[styles.section, styles.footer]}>
            <TextInput
              style={[styles.input, { borderColor: list.color }]}
              onChangeText={(text) => this.setState({ newTodo: text })}
              value={this.state.newTodo}
              selectionColor={list.color}
            />
            <TouchableOpacity
              style={[styles.addTodo, { backgroundColor: list.color }]}
              onPress={() => this.addTodo()}
            >
              <AntDesign name="plus" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
  },
  section: {
    alignSelf: "stretch",
    flex: 1,
  },
  header: {
    justifyContent: "flex-end",
    marginLeft: 64,
    borderBottomWidth: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.white,
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: colors.gray,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.white,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  todoContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  todo: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  pickerItem: {
    color: "red",
  },
});
