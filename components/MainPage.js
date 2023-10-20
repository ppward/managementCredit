import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Get the screen width and height
import * as Progress from "react-native-progress";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const todoList = [
  { id: "1", title: "Task 1", completed: true },
  { id: "2", title: "Task 2", completed: false },
];

export default function MainPage({ route, navigation }) {
  // const [currentDayData, setCurrentDayData] = React.useState([]);

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
  const [currentDayData, setCurrentDayData] = React.useState([]);
  const [timetableData, setTimetableData] = React.useState({});

  const fetchTimetableData = async () => {
    try {
      const data = await AsyncStorage.getItem("@timetable"); // data는 asyncstorage에서 가져온 문자열 형태의 데이터
      if (data !== null) {
        const parsedData = JSON.parse(data); // json 타입으로 변환
        setTimetableData(parsedData); //json데이터를  비동기 처리
        const currentDay = getCurrentDay(); //오늘의 요일 받아오기
        console.log("날짜 :" + currentDay); // 요일 확인 로그
        // 현재 요일에 맞는 데이터 설정
        setCurrentDayData(parsedData[currentDay]); //오늘의 요일에 맞는 데이터를 json에서 추출
        const weekstable = parsedData[currentDay];
        setCurrentDayData(weekstable); // 추출한 json 데이터 확인 로그
      }
    } catch (error) {
      console.error("Error fetching timetable data", error);
    }
  };
  React.useEffect(() => {
    console.log("json데이터:", timetableData);
    console.log("대시보드데이터1 :", currentDayData);
  }, [currentDayData]);
  React.useEffect(() => {
    // Register a focus event listener
    const unsubscribe = navigation.addListener("focus", fetchTimetableData);

    // Clean up on unmount / before re-rendering
    return unsubscribe;
  }, [navigation]);
  //
  const progress = 0.5; // 50% 진행
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", marginTop: 40 }}>
        <TouchableOpacity
          onLongPress={() => {
            navigation.navigate("시간표");
          }}
        >
          <View style={styles.longWidget}>
            {currentDayData.length === 0 ? (
              <Text>오늘 일정이 없습니다</Text>
            ) : (
              currentDayData.map((item, index) => (
                <View key={index}>
                  <Text>Subject: {item.subject}</Text>
                  <Text>Time: {item.time}</Text>
                </View>
              ))
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.squareWidgetsContainer}>
          <TouchableOpacity
            style={[styles.squareWidget, styles.topSquareWidget]}
            onLongPress={() => {
              navigation.navigate("과제");
            }}
          >
            <View>
              <Text>Square Widget 1</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.squareWidget}>
            <Text>Square Widget 2</Text>
          </View>
        </View>

        {/* Progress Bar */}
        {/* 진행률 바 */}
        {/* I moved this part to inside the second View so it won't be affected by the FlatList */}
        {/* 이 부분을 두 번째 View 내부로 옮겨서 FlatList에 의해 영향받지 않도록 했습니다 */}
      </View>

      {/* The FlatList component should be outside the ScrollView component to avoid nesting error */}
      {/* FlatList 컴포넌트는 중첩 오류를 피하기 위해 ScrollView 컴포넌트 바깥에 있어야 합니다 */}

      {/* keyExtractor should provide a unique key, so we return item.id directly */}
      {/* keyExtractor는 고유한 키를 제공해야 하므로 item.id 를 그대로 반환합니다 */}

      {/* ListHeaderComponent prop is used to display additional component above the list */}

      {/* 리스트 위에 추가적인 컴포넌트를 표시하는데 사용됩니다 */}
      <Text>Progress: {progress * 100}%</Text>
      <Progress.Bar progress={progress} width={200} />
      <FlatList
        data={todoList}
        renderItem={({ item }) => (
          <Text style={{ borderWidth: 2, marginTop: 10 }}>
            {item.title} - {item.completed ? "Completed" : "Incomplete"}
          </Text>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 45,
    flexDirection: "column",
    padding: 10,
    justifyContent: "space-between",
  },

  longWidget: {
    width: screenWidth / 2,
    height: screenHeight / 3, // Adjust the height based on the screen height
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },

  squareWidgetsContainer: {
    width: screenWidth / 2,
    height: screenHeight / 3, // Adjust the height based on the screen height
    justifyContent: "space-between",
  },

  squareWidget: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  topSquareWidget: {
    marginBottom: 5,
  },
});
