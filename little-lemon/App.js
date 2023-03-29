import { StyleSheet, Text, View } from "react-native";
import Onboarding from "./screens/Onboarding";

export default function App() {
  return (
    <View style={styles.container}>
      <Onboarding></Onboarding>
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
});
