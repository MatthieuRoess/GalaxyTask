import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../Colors.min.js";
import { Checkbox } from "react-native-paper";
import {
  getAllMemberOfBoard,
  getCardMembers,
  postCardMember,
  removeMemberFromCard,
} from "../functions.min.js/";

const AssigneMemberToCard = ({ idBoard, idCard }) => {
  const [checked, setChecked] = React.useState(false);
  const [members, setMembers] = useState([]);

  const getAllMember = async () => {
    const memberCard = await getCardMembers(idCard);
    const res = await getAllMemberOfBoard(idBoard);

    // Add a checked property to each member
    const membersWithCheckbox = res.map((member) => ({
      ...member,
      checked: memberCard.some((cardMember) => cardMember.id === member.id),
    }));
    setMembers(membersWithCheckbox);
  };

  useEffect(() => {
    getAllMember();
  }, [idBoard]);

  const handleCheck = (memberId) => {
    setMembers(
      members.map((member) => {
        if (member.id === memberId) {
          if (member.checked === false) {
            const memberCard = postCardMember(idCard, memberId);
          } else {
            const memberCard = removeMemberFromCard(idCard, memberId);
          }
          return { ...member, checked: !member.checked };
        }
        return member;
      })
    );
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: colors.black,
      }}
    >
      <AntDesign
        name="adduser"
        size={40}
        color={colors.white}
        style={{ alignItems: "center", marginTop: 40 }}
      />
      {members.map((member) => {
        return (
          <View style={styles.checkboxContainer} key={member.id}>
            <Checkbox
              status={member.checked ? "checked" : "unchecked"}
              color={member.checked ? colors.white : colors.white}
              uncheckedColor={colors.white}
              onPress={() => {
                handleCheck(member.id);
              }}
            />
            <View style={styles.textContainer} key={member.id}>
              <Text style={styles.label} key={member.id}>
                {member.fullName}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    top: 10,
    height: 60,
  },
  label: {
    color: colors.white,
    fontSize: 16,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
  },
});

export default AssigneMemberToCard;
