import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainPage from "./components/MainPage";
import Timetable from "./components/Timetable";
import TodoList from "./components/TodoList";
import Mydatas from "./components/Mydatas";
const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    //fetchTimetableData();
    //AsyncStorage.clear();
  }, []);
  async function getAllData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      console.log("all:", result);
    } catch (e) {
      // 에러 처리
      console.error("모든 데이터를 가져오는데 실패했습니다:", e);
    }
  }

  getAllData();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="메인" component={MainPage} />
        <Stack.Screen name="시간표" component={Timetable} />
        <Stack.Screen name="과제" component={TodoList} />
        <Stack.Screen name="학점" component={Mydatas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
