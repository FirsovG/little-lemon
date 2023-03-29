import { useState } from "react";
import { View, StyleSheet, Button, Image, Text, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Onboarding = () => {
  const [input, setInput] = useState({
    firstname: "",
    email: "",
    isValid: false,
  });

  onChangeEmail = (email) => {
    setInput((prev) => ({
      firstname: prev.firstname,
      email: email,
      isValid: validateFirstname(prev.firstname) && validateEmail(email),
    }));
  };

  validateEmail = (email) => /.+@.+\.[A-Za-z]+$/.test(email);

  onChangeFirstname = (firstname) => {
    setInput((prev) => ({
      firstname: firstname,
      email: prev.email,
      isValid: validateFirstname(firstname) && validateEmail(prev.email),
    }));
  };

  validateFirstname = (firstname) => /^(?:[A-Za-z]+|\d+)$/.test(firstname);

  finishOnboarding = async () => {
    await AsyncStorage.setItem("IS_LOGGED_IN", "true");
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        {/* Couldn't find logo of only the lemon. */}
        <Image
          style={styles.navigationImage}
          source={require("../assets/Logo.png")}
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={[styles.inputSectionWelcome, styles.inputSectionText]}>
          Let us get to know you
        </Text>
        <Text style={[styles.inputSectionLabel, styles.inputSectionText]}>
          First Name
        </Text>
        <TextInput
          style={[styles.inputSectionInput]}
          onChangeText={onChangeFirstname}
        ></TextInput>
        <Text style={[styles.inputSectionLabel, styles.inputSectionText]}>
          Email
        </Text>
        <TextInput
          style={[styles.inputSectionInput]}
          keyboardType="email-address"
          onChangeText={onChangeEmail}
        ></TextInput>
      </View>
      <View style={styles.nextButtonWrapper}>
        <Button
          disabled={!input.isValid}
          color="#cbd2d9"
          title="Next"
          onPress={finishOnboarding}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f1f4f7",
  },
  navigation: {
    flex: 0.12,
    justifyContent: "center",
    backgroundColor: "#dee3e9",
  },
  navigationImage: {
    alignSelf: "center",
  },
  inputSection: {
    flex: 0.75,
    backgroundColor: "#cbd2d9",
    alignItems: "center",
  },
  inputSectionWelcome: {
    fontSize: 26,
    marginTop: 50,
    marginBottom: 100,
  },
  inputSectionLabel: {
    fontSize: 28,
    marginTop: 26,
    marginBottom: 8,
  },
  inputSectionText: {
    color: "#344854",
  },
  inputSectionInput: {
    fontSize: 28,
    height: 50,
    padding: 6,
    borderWidth: 3,
    borderColor: "#344854",
    borderRadius: 8,
    width: "80%",
  },
  nextButtonWrapper: {
    width: "30%",
    marginTop: 5,
    marginRight: 10,
    alignSelf: "flex-end",
  },
});

export default Onboarding;
