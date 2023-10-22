import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Papa from "papaparse";

export default function App() {
  const [jsonData, setJsonData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@json_data", jsonValue);
    } catch (e) {
      // saving error
      console.error(e);
    }
  };
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@json_data");

      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.error(e);
    }
  }; // asyncstorage에서 데이터를 불러오는 함수

  React.useEffect(() => {
    const fetchInitialMyData = async () => {
      const initialMyData = await getData();
      if (initialMyData) {
        setJsonData(initialMyData);
      }
    };

    fetchInitialMyData();
  }, []);
  React.useEffect(() => {
    console.log("데이터셋 체크 ", jsonData);
    if (jsonData == null) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [jsonData]);
  const pickerDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log(result);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const csvUri = result.assets[0].uri;
      const csvName = result.assets[0].name;

      const csvString = await FileSystem.readAsStringAsync(csvUri);

      const jsonObj = Papa.parse(csvString, { header: true }).data;
      const jsonPath =
        FileSystem.documentDirectory + csvName.replace(".csv", ".json");

      await FileSystem.writeAsStringAsync(jsonPath, JSON.stringify(jsonObj));

      console.log("JSON file saved at: ", jsonPath);

      const jsonContentStr = await FileSystem.readAsStringAsync(jsonPath);
      let jsonContentObj;
      //console.log("Content of the saved JSON file:", jsonContentStr);
      try {
        jsonContentObj = JSON.parse(jsonContentStr);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return;
      }

      // Assuming that "txtMajor" is a property of the first object in the array
      if (jsonContentObj.length > 0 && "txtMajor" in jsonContentObj[0]) {
        setJsonData(jsonContentObj);
        storeData(jsonContentObj);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {jsonData == null && (
        <Button
          title="pick file" // 'tilte' 대신 'title' 사용
          onPress={() => {
            pickerDocument();
          }}
        />
      )}
      {loading && jsonData[0].txtMajor !== null && (
        <ScrollView contentContainerStyle={{ justifyContent: "center" }}>
          <View style={styles.card}>
            <Text style={styles.header}>{jsonData[0].txtMajor}</Text>
            <View style={styles.row}>
              <View style={styles.cell}>
                <View
                  style={{ flexDirection: "columns", alignItems: "center" }}
                >
                  <Text>{`${jsonData[0].textBox12}`}</Text>
                  <Text
                    style={{ borderTopWidth: 2 }}
                  >{`${jsonData[0].txtDan}`}</Text>
                </View>
              </View>
              <View style={styles.cell}>
                <View
                  style={{ flexDirection: "columns", alignItems: "center" }}
                >
                  <Text>{`${jsonData[0].textBox7}`}</Text>
                  <Text
                    style={{ borderTopWidth: 2 }}
                  >{`${jsonData[0].txtHak}`}</Text>
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <View
                  style={{ flexDirection: "columns", alignItems: "center" }}
                >
                  <Text>{`${jsonData[0].textBox20}`}</Text>
                  <Text
                    style={{ borderTopWidth: 2 }}
                  >{`${jsonData[0].txtStno}`}</Text>
                </View>
              </View>
              <View style={styles.cell}>
                <View
                  style={{ flexDirection: "columns", alignItems: "center" }}
                >
                  <Text>{`${jsonData[0].textBox15}`}</Text>
                  <Text
                    style={{ borderTopWidth: 2 }}
                  >{`${jsonData[0].txtName}`}</Text>
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <View
                  style={{ flexDirection: "columns", alignItems: "center" }}
                >
                  <Text>{`${jsonData[0].textBox2}`}</Text>
                  <Text
                    style={{ borderTopWidth: 2 }}
                  >{`${jsonData[0].txtJunYN}`}</Text>
                </View>
              </View>
              <View style={styles.cell}>
                <View
                  style={{ flexDirection: "columns", alignItems: "center" }}
                >
                  <Text>{`${jsonData[0].textBox5}`}</Text>
                  <Text
                    style={{ borderTopWidth: 2 }}
                  >{`${jsonData[0].txtDajunYN}`}</Text>
                </View>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.subHeader}>{jsonData[0].총학점1}</Text>
              <Text style={styles.subHeader}>{jsonData[0].총학점2}</Text>
            </View>
          </View>

          {/* 주전공 섹션 */}
          <View style={styles.card}>
            <Text style={styles.subHeader}>{jsonData[0].textBox116}</Text>
            <View style={styles.card}>
              <Text>{`${jsonData[0].전공_전공_전공필수}`}</Text>
              <Text>{`남은 학점: ${jsonData[0].전공_전공_전공필수3}`}</Text>
              <Text>{`이수 학점/전체학점 ${jsonData[0].전공_전공_전공필수2} / ${jsonData[0].전공_전공_전공필수1}`}</Text>
            </View>
            <View style={styles.card}>
              <Text>{`${jsonData[0].전공_전공_전공선택}`}</Text>
              <Text>{`남은 학점: ${jsonData[0].전공_전공_전공선택3}`}</Text>
              <Text>{`이수 학점/전체학점 ${jsonData[0].전공_전공_전공선택2} / ${jsonData[0].전공_전공_전공선택1}`}</Text>
            </View>

            <View style={styles.card}>
              <Text>{`${jsonData[0].전공_전공_전공심화}`}</Text>
              <Text>{`남은 학점: ${jsonData[0].전공_전공_전공심화3}`}</Text>
              <Text>{`이수 학점/전체학점 ${jsonData[0].전공_전공_전공심화2} / ${jsonData[0].전공_전공_전공심화1}`}</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.card}>
                <Text>{`남은 학점: ${jsonData[0].전공_전공_전공필수3}`}</Text>
              </View>
            </View>
            {/* 주전공의 다른 항목들도 비슷한 방식으로 나누어서 추가할 수 있습니다. */}
          </View>

          {/* 다전공 섹션도 비슷한 방식으로 추가합니다. */}
          <View style={styles.card}>
            <Text style={styles.subHeader}>{jsonData[0].textBox187}</Text>
            <View style={styles.card}>
              <Text>{`${jsonData[0].전공_다전공_복수전공필수}`}</Text>
              <Text>{`남은 학점: ${jsonData[0].전공_다전공_복수전공필수3}`}</Text>
              <Text>{`이수 학점/전체학점 ${jsonData[0].전공_다전공_복수전공필수2} / ${jsonData[0].전공_다전공_복수전공필수1}`}</Text>
            </View>
            <View style={styles.card}>
              <Text>{`${jsonData[0].전공_다전공_복수전공선택}`}</Text>
              <Text>{`남은 학점: ${jsonData[0].전공_다전공_복수전공선택3}`}</Text>
              <Text>{`이수 학점/전체학점 ${jsonData[0].전공_다전공_복수전공선택2} / ${jsonData[0].전공_다전공_복수전공선택1}`}</Text>
            </View>

            <View style={styles.card}>
              <Text>{`${jsonData[0].전공_다전공_부전공필수}`}</Text>
              <Text>{`남은 학점: ${jsonData[0].전공_다전공_부전공필수3}`}</Text>
              <Text>{`이수 학점/전체학점 ${jsonData[0].전공_다전공_부전공필수2} / ${jsonData[0].전공_다전공_부전공필수1}`}</Text>
            </View>
            <View style={styles.card}>
              <Text>{`${jsonData[0].전공_다전공_부전공선택}`}</Text>
              <Text>{`남은 학점: ${jsonData[0].전공_다전공_부전공선택3}`}</Text>
              <Text>{`이수 학점/전체학점 ${jsonData[0].전공_다전공_부전공선택2} / ${jsonData[0].전공_다전공_부전공선택1}`}</Text>
            </View>
          </View>
          {/*e-special */}
          <View style={styles.card}>
            <Text style={styles.subHeader}>{jsonData[0].textBox187}</Text>
            <View style={styles.card}>
              <Text>{`${jsonData[0].전공_다전공_Especial과정}`}</Text>
              <Text>{`남은 학점: ${jsonData[0].전공_다전공_Especial과정3}`}</Text>
              <Text>{`이수 학점/전체학점 ${jsonData[0].전공_다전공_Especial과정2} / ${jsonData[0].전공_다전공_Especial과정1}`}</Text>
            </View>

            {/*융합 전공 */}
          </View>
          <View style={styles.card}>
            <Text style={styles.subHeader}>{jsonData[0].textBox187}</Text>
            <View style={styles.card}>
              <Text>{`${jsonData[0].전공_다전공_융합전공}`}</Text>
              <Text>{`남은 학점: ${jsonData[0].전공_다전공_융합전공3}`}</Text>
              <Text>{`이수 학점/전체학점 ${jsonData[0].전공_다전공_융합전공2} / ${jsonData[0].전공_다전공_융합전공1}`}</Text>
            </View>

            {/* 주전공의 다른 항목들도 비슷한 방식으로 나누어서 추가할 수 있습니다. */}
          </View>
          <View style={styles.card}>
            <Text style={styles.subHeader}>{jsonData[0].졸업논문}</Text>
            <View style={styles.card}>
              <Text>{`${jsonData[0].전공_다전공_융합전공}`}</Text>
              <Text>{`합격여부 : ${jsonData[0].졸업논문3} (${jsonData[0].졸업논문2} / ${jsonData[0].졸업논문1})`}</Text>
              <Text>{` `}</Text>
            </View>

            {/* 주전공의 다른 항목들도 비슷한 방식으로 나누어서 추가할 수 있습니다. */}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f2f2f2",
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  cell: {
    flex: 0.5,
    padding: 5,
    backgroundColor: "#d09aff",
    borderRadius: 15,
    margin: 3,
  },
});
