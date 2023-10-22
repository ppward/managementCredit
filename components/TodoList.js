import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

// Import required components from react native paper
import {
  TextInput,
  Button,
  Modal,
  Portal,
  Card,
  Checkbox,
  Title,
} from "react-native-paper";
// Import Checkbox component from react native paper

export default function TodoList(props) {
  const [task, setTask] = useState("");
  const [tasksList, setTasksList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState({ index: null, text: "" });

  useEffect(() => {
    fetchTasks();
  }, []);
  useEffect(() => {
    storeTasks();
    console.log(tasksList);
  }, [tasksList]);

  const fetchTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("@tasksList");
      if (storedTasks) {
        setTasksList(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error(
        "AsyncStorage에서 할 일 항목을 가져오는 데 실패했습니다:",
        error
      );
    }
  };

  const storeTasks = async () => {
    try {
      await AsyncStorage.setItem("@tasksList", JSON.stringify(tasksList));
    } catch (error) {
      console.error(
        "AsyncStorage에 할 일 항목을 저장하는 데 실패했습니다:",
        error
      );
    }
  };

  const handleAddTask = () => {
    if (task.trim()) {
      setTasksList((prevTasks) => [
        ...prevTasks,
        { text: task, checked: false },
      ]);

      setTask("");
    }
  };

  const handleDeleteTask = (index) => {
    const newTasksList = [...tasksList];
    newTasksList.splice(index, 1);
    setTasksList(newTasksList);
    storeTasks();
  };

  const handleToggleCheckbox = (index) => {
    const newTasksList = [...tasksList];
    newTasksList[index].checked = !newTasksList[index].checked;
    setTasksList(newTasksList);
    storeTasks();
  };

  const openEditModal = (index, text) => {
    setEditingTask({ index, text });
    setIsModalVisible(true);
  };

  const handleEditTask = () => {
    const newTasksList = [...tasksList];
    newTasksList[editingTask.index].text = editingTask.text;
    setTasksList(newTasksList);
    setIsModalVisible(false);
    storeTasks();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Title>나의 과제 List</Title>
      <TextInput
        label="Enter task"
        value={task}
        onChangeText={(text) => setTask(text)}
        mode="outlined"
        style={styles.input}
      />
      <Button
        icon="plus"
        mode="contained"
        onPress={() => handleAddTask()}
        style={styles.addButton}
      >
        Add
      </Button>
      <FlatList
        data={tasksList}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => openEditModal(index, item.text)}>
            <Card style={{ marginVertical: 10 }}>
              <Card.Title title={item.text} />
              <View flexDirection="row" justifyContent="flex-end">
                {/* Checkbox and Delete button */}
                {/* 체크박스와 삭제 버튼 */}

                <Checkbox.Item
                  label="완료 |"
                  style={{
                    backgroundColor: "#CFFFE5",
                    borderRadius: 15,
                    width: 105,
                    borderWidth: 0.2,
                  }}
                  status={item.checked ? "checked" : "unchecked"}
                  onPress={() => handleToggleCheckbox(index)}
                />
                <Button
                  icon="delete"
                  compact
                  onPress={() => handleDeleteTask(index)}
                >
                  Delete
                </Button>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Modal
        visible={isModalVisible}
        onDismiss={() => setIsModalVisible(false)}
      >
        <TextInput
          label="Edit task"
          value={editingTask.text}
          onChangeText={(text) => setEditingTask((prev) => ({ ...prev, text }))}
          mode="outlined"
          style={{ marginBottom: 20 }}
        />
        <Button
          icon="content-save-edit-outline"
          mode="contained"
          onPress={() => handleEditTask()}
        >
          Edit Task
        </Button>
        <Button
          icon="close-circle-outline"
          color="red"
          onPress={() => setIsModalVisible(false)}
        >
          Close
        </Button>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
  },
  addButton: {
    marginBottom: 20,
  },
});
