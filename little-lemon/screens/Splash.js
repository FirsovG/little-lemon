import { StyleSheet, View, Image, Text } from "react-native";

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/Logo.png")} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 25,
  },
});

export default Splash;
