import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

export default function TodoList(props) {
  const [task, setTask] = useState("");
  const [tasksList, setTasksList] = useState([]);

  const handleAddTask = () => {
    if (task.trim()) {
      setTasksList([...tasksList, task]);
      setTask("");
    }
  };

  const handleDeleteTask = (index) => {
    const newTasksList = [...tasksList];
    newTasksList.splice(index, 1);
    setTasksList(newTasksList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>To-Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.tasksList}
        data={tasksList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() => handleDeleteTask(index)}
          >
            <Text style={styles.taskText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tasksList: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 4,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
});
