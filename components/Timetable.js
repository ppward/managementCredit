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
  const [modalVisible, setModalVisible] = React.useState(false); //모달 출력을 조절하기 위한 변수
  const [dayOfWeek, setDayOfWeek] = React.useState("Monday"); // 요일 피커를 위한 변수
  const [error, setError] = React.useState(false); // 같은 시간대의 두개이상의 과목이 들어가는지 확인하기 위한 변수
  const [validation, setValidation] = React.useState(true); // 과목이름이 2글자 미만인지 검수하기 위한 변수
  const [hours, setHours] = React.useState("9:00"); // 시간피커를 위한 변수
  const [subject, setSubject] = React.useState(""); // 과목이름 설정을 위한 변수
  const [deleteOn, setDeleteOn] = React.useState(false); // 이거 필용없음
  const [editOn, setEditOn] = React.useState(false); // 수정여부를 판단해서 추가버튼 disable하게 만드는 변수
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [selectedOriginalItem, setSelectedOriginalItem] = React.useState(null); // 수정할 과목의 데이터를 저장하는 변수
  const [timetable, setTimetable] = React.useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  }); // 시간표 데이터 저장하기 위한 변수

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; // 요일 피커용 데이터셋
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
  ]; // 시간피커용 데이터 셋
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
  }; //시간표에 과목추가

  const checkIfTimeExists = (day, time) => {
    if (timetable[day].some((item) => item.time === time)) {
      return true;
    }
    return false;
  }; // 같은시간에 여러과목이 겹치지 않도록하는 함수
  React.useEffect(() => {
    setError(checkIfTimeExists(dayOfWeek, hours));
  }, [modalVisible, dayOfWeek, hours]); // checkIfTimeExist를 실행후 화면에 업데이트하기 위한 useEffect

  const validateSubject = (subject) => {
    // 과목 이름 유효성 검사 함수
    if (subject.trim().length < 2) {
      return false;
    }
    return true;
  }; //과목이름이 2개 미만인경우를 확인하는 함수
  React.useEffect(() => {
    setValidation(validateSubject(subject));
  }, [subject]); // setValidation를 실행 후 화면을 업데이트 하기위한 변수

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@timetable", jsonValue);
    } catch (e) {
      // saving error
      console.error(e);
    }
  }; // asyncstorage에 저장하는 함수

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@timetable");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.error(e);
    }
  }; // asyncstorage에서 데이터를 불러오는 함수
  React.useEffect(() => {
    const fetchInitialData = async () => {
      const initialData = await getData();
      if (initialData) {
        setTimetable(initialData);
      }
    };

    fetchInitialData();
  }, []); //asyncstorage에서 데이터를 가져오고 화면에 마운트 시키는 함수

  const editTimetableItem = (day, time, subj) => {
    // 선택된 항목의 데이터를 상태에 설정
    setSelectedOriginalItem({ day, time, subj });
    setEditOn(true);
    setDayOfWeek(day);
    setHours(time);
    setSubject(subj);
    // 모달 열기
    setModalVisible(true);
  };
  const asyncEdit = () => {
    return new Promise((resolve) => {
      setTimetable((prev) => {
        const updatedDayData = prev[selectedOriginalItem.day].filter(
          (item) => item.time !== selectedOriginalItem.time
        );
        const updatedTable = {
          ...prev,
          [selectedOriginalItem.day]: updatedDayData,
        };
        resolve(updatedTable);
        console.log("필터링 데이터", updatedTable);
        return updatedTable;
      });
    });
  };

  const updateTimetable = async () => {
    const editedTable = await asyncEdit();

    const newData = { subject: subject, time: hours };
    if (!checkIfTimeExists(dayOfWeek, hours)) {
      const newDayData = [...editedTable[dayOfWeek], newData].sort((a, b) => {
        const timeA = timeSet.indexOf(a.time);
        const timeB = timeSet.indexOf(b.time);
        return timeA - timeB;
      });
      const newTable = { ...editedTable, [dayOfWeek]: newDayData };
      console.log("수정된 테이블", newTable);
      setTimetable(newTable);
      storeData(newTable);
    }

    setSelectedOriginalItem(null);
  };
  const deleteTimetableModal = (day, time, sub) => {
    setSelectedOriginalItem({ day, time, sub });
    setDayOfWeek(day);
    setHours(time);
    setSubject(sub);
    setDeleteModal(true);
  };
  const deletedTimetable = async () => {
    // const updatedTimetable = timetable.filter(subject => subject !== subjectToDelete);
    // setTimetable(updatedTimetable);
    const remainTimetable = await asyncEdit();
    setTimetable(remainTimetable);
    storeData(remainTimetable);
  };
  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
      <Text>{deleteOn}</Text>
      <View style={{ flexDirection: "row" }}>
        {Object.keys(timetable).map((day, index) => (
          <View key={index} style={styles.column}>
            <Text>{day}</Text>

            {timetable[day].map((cellData, cellIndex) => (
              <View key={cellIndex} style={styles.cell}>
                <TouchableOpacity
                  onPress={() => {
                    deleteOn
                      ? deleteTimetableModal(
                          day,
                          cellData.time,
                          cellData.subject
                        )
                      : editTimetableItem(day, cellData.time, cellData.subject);
                  }}
                >
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
              value={subject}
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
              disabled={error || !validation || editOn}
            >
              <Text style={styles.saveButton}>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 5 }}
              onPress={() => {
                updateTimetable();
                setModalVisible(false);
              }}
              disabled={error || !validation || !editOn}
            >
              <Text style={styles.saveButton}>수정</Text>
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

      <TouchableOpacity
        style={[styles.deleteButton, deleteOn && styles.deleteButtonPressed]}
        onPress={() => {
          deleteOn ? setDeleteOn(false) : setDeleteOn(true);
          console.log(deleteOn);
        }}
      >
        <Text>삭제</Text>
      </TouchableOpacity>
      {/*삭제모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModal}
        onRequestClose={() => {
          setDeleteModal(!deleteModal);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text>요일: {dayOfWeek}</Text>
            <Text>시간: {hours}</Text>
            <Text>과목: {subject}</Text>
            <Text>삭제하시겠습니까?</Text>

            {/* Yes 버튼 */}
            <TouchableOpacity
              onPress={() => {
                deletedTimetable();
                setDeleteModal(false);
              }}
              style={{
                backgroundColor: "blue",
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginVertical: 10,
              }}
            >
              <Text style={{ color: "white" }}>Yes</Text>
            </TouchableOpacity>

            {/* No 버튼 */}
            <TouchableOpacity
              onPress={() => {
                setDeleteModal(false);
              }}
              style={{
                backgroundColor: "red",
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <Text style={{ color: "white" }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  deleteButton: {
    width: 100,
    alignItems: "center",
    backgroundColor: "blue",
    borderRadius: 10,
    position: "absolute",
    bottom: 16,
    padding: 15,
  },
  deleteButtonPressed: {
    backgroundColor: "red",
  },
});
