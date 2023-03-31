import { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Image,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";

import { AuthContext } from "../navigators/RootNavigator";

const Onboarding = () => {
  const { logIn } = React.useContext(AuthContext);

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
    await AsyncStorage.setItem("FIRSTNAME", input.firstname);
    await AsyncStorage.setItem("EMAIL", input.email);
    logIn();
  };

  return (
    <ScrollView style={styles.container}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  navigation: {
    flex: 0.12,
    justifyContent: "center",
    borderBottomColor: "#e7e7e7",
    borderBottomWidth: 1,
  },
  navigationImage: {
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  inputSection: {
    flex: 0.75,
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
    width: "35%",
    marginTop: 100,
    marginRight: 20,
    marginBottom: 40,
    alignSelf: "flex-end",
  },
});

export default Onboarding;
