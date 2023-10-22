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
import { Card, Title, Paragraph, Button, IconButton } from "react-native-paper";
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
  const [tasksList, setTasksList] = React.useState([]);
  const [completionRate, setCompletionRate] = React.useState(0);
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
        setCurrentDayData(parsedData["Monday"]); //오늘의 요일에 맞는 데이터를 json에서 추출 나중에 currentDay로 다시 바꾸기
        const weekstable = parsedData["Monday"];
        setCurrentDayData(weekstable); // 추출한 json 데이터 확인 로그
      }
    } catch (error) {
      console.error("Error fetching timetable data", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("@tasksList");
      if (storedTasks) {
        const allTasks = JSON.parse(storedTasks);
        console.log(allTasks.length);
        const uncheckedTasks = allTasks.filter((task) => !task.checked);
        const completedTasks = allTasks.length - uncheckedTasks.length;

        setTasksList(uncheckedTasks);
        setCompletionRate(completedTasks / allTasks.length);
      }
    } catch (error) {
      console.error(
        "AsyncStorage에서 할 일 항목을 가져오는 데 실패했습니다:",
        error
      );
    }
  };

  React.useEffect(() => {
    console.log("json데이터:", timetableData);
    console.log("대시보드데이터1 :", currentDayData);
    console.log("task2", tasksList);
    console.log("완성율:", completionRate);
  }, [currentDayData, tasksList]);

  React.useEffect(() => {
    const onFocused = () => {
      fetchTimetableData();
      fetchTasks();
    };

    // Register a focus event listener
    const unsubscribe = navigation.addListener("focus", onFocused);

    // Clean up on unmount / before re-rendering
    return unsubscribe;
  }, [navigation]);
  //
  const progress = 0.5; // 50% 진행

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", height: 330 }}>
        <Card style={{ ...styles.cardStyle, height: 330 }}>
          <Card.Content>
            <Title>시간표</Title>
            {!currentDayData || currentDayData.length === 0 ? (
              <Paragraph>오늘 일정이 없습니다</Paragraph>
            ) : (
              currentDayData.map((item, index) => (
                <View
                  key={index}
                  style={{
                    borderRadius: 12,
                    backgroundColor: "#CFFFE5",
                    marginBottom: 4,
                  }}
                >
                  <Text>Subject: {item.subject}</Text>
                  <Text>Time: {item.time}</Text>
                </View>
              ))
            )}
          </Card.Content>

          {/* You can replace onLongPress with onPress if you want */}
          {/* 원하는 경우 onLongPress를 onPress로 바꿀 수 있습니다 */}
          <Card.Actions>
            <Button onPress={() => navigation.navigate("시간표")}>
              자세히 보기
            </Button>
          </Card.Actions>
        </Card>

        {/* Todo List and My Data sections */}
        {/* Todo List와 My Data 섹션들 */}
        <View style={{ flex: 1 }}>
          {/* Todo List Section */}
          {/* Todo List 섹션 */}

          {/* My Data Section */}
          {/* My Data 섹션*/}

          <Card
            style={{
              width: 150,
              height: 150,
              margin: 10,
              justifyContent: "center",
              alignItems: "space-between",
            }}
          >
            <Title style={{ marginTop: 8, fontSize: 18 }}>나의 과제</Title>
            <Card.Content>
              {/* ... my data content ... */}
              {/* ... my data의 내용들 ... */}
            </Card.Content>

            <Card.Actions>
              <Button onPress={() => navigation.navigate("과제")}>
                자세히 보기
              </Button>
            </Card.Actions>
          </Card>
          <Card
            style={{
              width: 150,
              height: 150,
              margin: 10,
              justifyContent: "center",
              alignItems: "space-between",
            }}
          >
            <Title style={{ marginTop: 8, fontSize: 18 }}>나의 학점 정보</Title>
            <Card.Content>
              {/* ... my data content ... */}
              {/* ... my data의 내용들 ... */}
            </Card.Content>

            <Card.Actions>
              <Button onPress={() => navigation.navigate("학점")}>
                자세히 보기
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </View>

      <View style={{ margin: 5 }}>
        <FlatList
          data={tasksList}
          renderItem={({ item, index }) => (
            <Card style={{ marginVertical: 5 }}>
              <Card.Content>
                {/* Assuming `item.text` is the task description */}
                {/* `item.text`가 할 일 설명이라고 가정합니다 */}
                <Paragraph>{item.text}</Paragraph>
              </Card.Content>
            </Card>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 45,
    flexDirection: "column",
    padding: 10,
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
  //카드 스타일
  mainContainer: {
    flex: 0.8, // 화면의 80% 차지
    flexDirection: "row",
  },
  timeTableCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#ADD8E6",
  },
  todoListCard: {
    flex: 0.5,
    margin: 5,
    marginBottom: 2.5,
    backgroundColor: "#FFB6C1",
  },
  myDataCard: {
    flex: 0.5,
    margin: 5,
    marginTop: 2.5,
    backgroundColor: "#98FB98",
  },
  uncompletedTasksList: {
    flex: 0.2, // 화면의 20% 차지
    marginTop: 10,
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  taskText: {
    fontSize: 16,
  },
  //
  upperSection: {
    flex: 0.8,
    flexDirection: "row",
  },

  cardStyle: {
    width: "48%",
    justifyContent: "space-between",
  },

  lowerSection: {
    flex: 0.2,
  },
});
