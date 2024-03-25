import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";

import TodoModal from "./TodoModal";
import UpdateModal from "./UpdateListModal";

export default class TodoList extends React.Component {
  state = {
    showListVisible: false,
    showUpdateListVisible: false,
    projectId: this.props.projectId,
    title: this.props.title,
    boardId: this.props.boardId,
    idOrganization: this.props.idOrganization,
  };

  toggleListModal() {
    this.setState({ showListVisible: !this.state.showListVisible });
  }

  toggleUpdateListModal() {
    this.setState({ showUpdateListVisible: !this.state.showUpdateListVisible });
  }

  render() {
    const list = this.props.list;
    const completedCount = list.todos.filter((todo) => todo.completed).length;
    const remainingCount = list.todos.length - completedCount;

    return (
      <View>
        <Modal
          animationType="slide"
          visible={this.state.showListVisible}
          onRequestClose={() => this.toggleListModal()}
        >
          <TodoModal
            list={list}
            closeModal={() => this.toggleListModal()}
            closeUpdateModal={() => this.toggleUpdateListModal()}
            updateList={this.props.updateList}
            projectId={this.state.projectId}
            title={this.state.title}
            boardId={this.state.boardId}
            idOrganization={this.state.idOrganization}
          />
        </Modal>

        <Modal
          visible={this.state.showUpdateListVisible}
          onRequestClose={() => this.toggleUpdateListModal()}
        >
          <UpdateModal
            list={list}
            closeUpdateModal={() => this.toggleUpdateListModal()}
            closeModal={() => this.toggleListModal()}
            updateList={this.props.updateList}
            projectId={this.state.projectId}
            title={this.state.title}
            idBoard={this.state.boardId}
            idOrganization={this.state.idOrganization}
          />
        </Modal>

        <TouchableOpacity
          style={[styles.listContainer, { backgroundColor: list.color }]}
          onPress={() => this.toggleListModal()}
        >
          <Text style={styles.listTitle} numberOfLines={1}>
            {list.name}
          </Text>

          <View style={{ alignItems: "center" }}>
            <Text style={styles.count}>{remainingCount}</Text>
            <Text style={styles.subtitle}>Remaining</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.count}>{completedCount}</Text>
            <Text style={styles.subtitle}>Completed</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 12,
    alignItems: "center",
    width: 200,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 18,
  },
  count: {
    fontSize: 48,
    fontWeight: "200",
    color: "white",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
  },
});
