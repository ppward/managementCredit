import * as React from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const deviceWidth = Dimensions.get("window").width;
export default function Timetable({ route }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [dayOfWeek, setDayOfWeek] = React.useState("Monday");
  const [error, setError] = React.useState(false);
  const [validation, setValidation] = React.useState(true);
  const [hours, setHours] = React.useState("9:00");
  const [subject, setSubject] = React.useState("");
  const [timetable, setTimetable] = React.useState(
    route.params.timetableData || {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    }
  );

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSet = [
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "1:00",
    "1:30",
    "2:00",
    "2:30",
    "3:00",
    "3:30",
    "4:00",
    "4:30",
    "5:00",
    "5:30",
    "6:00",
    "6:30",
    "7:00",
    "7:30",
    "8:00",
    "8:30",
  ];
  const addTimetable = () => {
    // 새로운 데이터를 추가할 때 시간을 기준으로 정렬
    const newData = { subject: subject, time: hours };

    if (!checkIfTimeExists(dayOfWeek, hours)) {
      setTimetable((pre) => {
        const newDayData = [...pre[dayOfWeek], newData].sort((a, b) => {
          const timeA = timeSet.indexOf(a.time);
          const timeB = timeSet.indexOf(b.time);
          return timeA - timeB;
        });
        const newTable = { ...pre, [dayOfWeek]: newDayData };

        storeData(newTable); // 새로운 타임테이블 데이터 저장

        return newTable;
      });
      setDayOfWeek("Monday");
      setHours("9:00");
    }
  };

  const checkIfTimeExists = (day, time) => {
    if (timetable[day].some((item) => item.time === time)) {
      return true;
    }
    return false;
  };
  React.useEffect(() => {
    setError(checkIfTimeExists(dayOfWeek, hours));
  }, [modalVisible, dayOfWeek, hours]);

  const validateSubject = (subject) => {
    // 과목 이름 유효성 검사 함수
    if (subject.trim().length < 2) {
      return false;
    }
    return true;
  };
  React.useEffect(() => {
    setValidation(validateSubject(subject));
  }, [subject]);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@timetable", jsonValue);
    } catch (e) {
      // saving error
      console.error(e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@timetable");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.error(e);
    }
  };
  React.useEffect(() => {
    const storeInitialData = async () => {
      if (route.params.timetableData) {
        await storeData(route.params.timetableData);
      }
    };
    storeInitialData();
  }, [route.params.timetableData]);

  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
      <View style={{ flexDirection: "row" }}>
        {Object.keys(timetable).map((day, index) => (
          <View key={index} style={styles.column}>
            <Text>{day}</Text>

            {timetable[day].map((cellData, cellIndex) => (
              <View key={cellIndex} style={styles.cell}>
                <TouchableOpacity>
                  <Text>{cellData.subject}</Text>
                  <Text>{cellData.time}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>요일 선택</Text>
            <Picker
              selectedValue={dayOfWeek}
              onValueChange={(item) => {
                console.log(item);
                setDayOfWeek(item);
              }}
            >
              {days.map((day, index) => (
                <Picker.Item key={index} label={day} value={day} />
              ))}
            </Picker>
            <Text>시간 선택</Text>
            <Picker
              selectedValue={hours}
              onValueChange={(item) => {
                setHours(item);
                checkIfTimeExists(dayOfWeek, item);
              }}
            >
              {timeSet.map((time, index) => (
                <Picker.Item key={index} label={time} value={time} />
              ))}
            </Picker>
            {error && (
              <Text style={{ color: "red" }}>
                이미 같은 시간대에 과목이 존재합니다
              </Text>
            )}
            <TextInput
              style={styles.textInput}
              placeholder="과목명"
              onChangeText={(text) => setSubject(text)}
            />
            {!validation && (
              <Text style={{ color: "red" }}>
                과목이름을 정확히 입력해주세요
              </Text>
            )}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                addTimetable();
              }}
              disabled={error || !validation}
            >
              <Text style={styles.saveButton}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Image
          style={{ width: 50, height: 50 }}
          source={require("../assets/add.png")}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: { marginTop: 40 },
  column: {
    flexDirection: "column",
    marginHorizontal: "2%",
  },
  cell: {
    backgroundColor: "#F7F6E7",
    height: "auto",
    marginVertical: "2%",
  },
  text: {
    color: "#000",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  textInput: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
  },
  modalContent: {
    width: deviceWidth * 0.9,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: "blue",
    color: "white",
    padding: 10,
    textAlign: "center",
    borderRadius: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
