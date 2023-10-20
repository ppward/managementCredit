import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainPage from "./components/MainPage";
import Timetable from "./components/Timetable";
import TodoList from "./components/TodoList";

const Stack = createStackNavigator();

export default function App() {
  const [timetableData, setTimetableData] = useState(null);

  const getCurrentDay = () => {
    const day = new Date().getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day];
  };

  const fetchTimetableData = async () => {
    try {
      const data = await AsyncStorage.getItem("@timetable");
      if (data !== null) {
        setTimetableData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error fetching timetable data", error);
    }
  };

  useEffect(() => {
    fetchTimetableData();
  }, []);
  async function getAllData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      console.log(result);
    } catch (e) {
      // 에러 처리
      console.error("모든 데이터를 가져오는데 실패했습니다:", e);
    }
  }

  getAllData();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="메인"
          component={MainPage}
          initialParams={{ day: getCurrentDay(), timetableData: timetableData }}
        />
        <Stack.Screen
          name="시간표"
          component={Timetable}
          initialParams={{ timetableData: timetableData }}
        />
        <Stack.Screen name="과제" component={TodoList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
