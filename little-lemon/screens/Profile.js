import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import * as React from "react";
import CheckBox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

import { AuthContext } from "../navigators/RootNavigator";

const Profile = () => {
  const { logOut } = React.useContext(AuthContext);

  const [input, setInput] = useState({
    avatar: "",
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    orderStatus: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
  });

  selectAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setInput((prev) => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };

  removeAvatar = () => {
    setInput((prev) => ({ ...prev, avatar: "" }));
  };

  logOutClicked = async () => {
    await AsyncStorage.clear();
    logOut();
  };

  ToBoolean = (string) => {
    if (string === null) {
      return false;
    } else {
      return string === "true";
    }
  };

  readInputFromStorage = async () => {
    const avatar = (await AsyncStorage.getItem("AVATAR")) ?? "";
    const firstname = (await AsyncStorage.getItem("FIRSTNAME")) ?? "";
    const lastname = (await AsyncStorage.getItem("LASTNAME")) ?? "";
    const email = (await AsyncStorage.getItem("EMAIL")) ?? "";
    const phoneNumber = (await AsyncStorage.getItem("PHONE_NUMBER")) ?? "";
    const orderStatus = ToBoolean(await AsyncStorage.getItem("ORDER_STATUS"));
    const passwordChanges = ToBoolean(
      await AsyncStorage.getItem("PASSWORD_CHANGES")
    );
    const specialOffers = ToBoolean(
      await AsyncStorage.getItem("SPECIAL_OFFERS")
    );
    const newsletter = ToBoolean(await AsyncStorage.getItem("NEWSLETTER"));
    setInput({
      avatar: avatar,
      firstname: firstname,
      lastname: lastname,
      email: email,
      phoneNumber: phoneNumber,
      orderStatus: orderStatus,
      passwordChanges: passwordChanges,
      specialOffers: specialOffers,
      newsletter: newsletter,
    });
  };

  saveInputToStorage = async () => {
    if (input.phoneNumber.length != 10) {
      Alert.alert(
        "Correct Data:",
        "The phone number should be 10 characters long."
      );
      return;
    } else if (!validateEmail(input.email)) {
      Alert.alert("Correct Data:", "The E-Mail is not well formed.");
    }
    await AsyncStorage.setItem("AVATAR", input.avatar);
    await AsyncStorage.setItem("FIRSTNAME", input.firstname);
    await AsyncStorage.setItem("LASTNAME", input.lastname);
    await AsyncStorage.setItem("EMAIL", input.email);
    await AsyncStorage.setItem("PHONE_NUMBER", input.phoneNumber);
    await AsyncStorage.setItem("ORDER_STATUS", input.orderStatus.toString());
    await AsyncStorage.setItem(
      "PASSWORD_CHANGES",
      input.passwordChanges.toString()
    );
    await AsyncStorage.setItem(
      "SPECIAL_OFFERS",
      input.specialOffers.toString()
    );
    await AsyncStorage.setItem("NEWSLETTER", input.newsletter.toString());
  };

  getFirstLetterUp = (string) => {
    if (string) {
      return string.charAt(0).toUpperCase();
    } else {
      return "";
    }
  };

  validateOnlyAlphabetic = (string) => /^(?:[A-Za-z]+|\d+)$/.test(string);

  onFirstnameChanged = (firstname) => {
    if (firstname === "" || validateOnlyAlphabetic(firstname)) {
      setInput((prev) => ({ ...prev, firstname: firstname }));
    }
  };

  onLastnameChanged = (lastname) => {
    if (lastname === "" || validateOnlyAlphabetic(lastname)) {
      setInput((prev) => ({ ...prev, lastname: lastname }));
    }
  };

  validateEmail = (email) => /.+@.+\.[A-Za-z]+$/.test(email);

  onEmailChanged = (email) => setInput((prev) => ({ ...prev, email: email }));

  onPhoneNumberChanged = (formatedPhoneNumber, phoneNumber) =>
    setInput((prev) => ({ ...prev, phoneNumber: phoneNumber }));

  onOrderStatusesChanged = (orderStatus) =>
    setInput((prev) => ({ ...prev, orderStatus: orderStatus }));

  onPasswordChangesChanged = (passwordChanges) =>
    setInput((prev) => ({ ...prev, passwordChanges: passwordChanges }));

  onSpecialOffersChanges = (specialOffers) =>
    setInput((prev) => ({ ...prev, specialOffers: specialOffers }));

  onNewsletterChanges = (newsletter) =>
    setInput((prev) => ({ ...prev, newsletter: newsletter }));

  useEffect(() => {
    readInputFromStorage();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navigation}>
        <Image
          style={styles.navigationImage}
          source={require("../assets/Logo.png")}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.header}>Personal Information</Text>
        <View style={[styles.sectionMargin]}>
          <Text>Avatar</Text>
          <View style={styles.avatarBar}>
            <View style={styles.avatarCircleWrapper}>
              {input.avatar ? (
                <Image
                  style={styles.avatarImage}
                  source={{ uri: input.avatar }}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {getFirstLetterUp(input.firstname) +
                    getFirstLetterUp(input.lastname)}
                </Text>
              )}
            </View>
            <View style={styles.changeAvatarButtonWrapper}>
              <Button
                style={styles.changeAvatarButton}
                title="Change"
                color="#495e57"
                onPress={selectAvatar}
              />
            </View>
            <View style={styles.changeAvatarButtonWrapper}>
              <Button title="Remove" color="#cbd2d9" onPress={removeAvatar} />
            </View>
          </View>
        </View>
        <View style={[styles.sectionMargin]}>
          <Text>First name</Text>
          <TextInput
            value={input.firstname}
            style={[styles.inputSectionInput]}
            onChangeText={onFirstnameChanged}
          />
        </View>
        <View style={[styles.sectionMargin]}>
          <Text>Last name</Text>
          <TextInput
            value={input.lastname}
            style={[styles.inputSectionInput]}
            onChangeText={onLastnameChanged}
          />
        </View>
        <View style={[styles.sectionMargin]}>
          <Text>Email</Text>
          <TextInput
            value={input.email}
            onChangeText={onEmailChanged}
            style={[styles.inputSectionInput]}
          />
        </View>
        <View style={[styles.sectionMargin]}>
          <Text>Phone number</Text>
          <MaskedTextInput
            value={input.phoneNumber}
            mask="(999) 999-9999"
            keyboardType="numeric"
            onChangeText={onPhoneNumberChanged}
            style={styles.inputSectionInput}
          />
        </View>
        <Text style={styles.header}>Email notifications</Text>
        <View style={styles.checkboxSection}>
          <View style={styles.checkboxWrapper}>
            <CheckBox
              value={input.orderStatus}
              onValueChange={onOrderStatusesChanged}
            />
            <Text style={styles.checkboxLabel}>Order statuses</Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <CheckBox
              value={input.passwordChanges}
              onValueChange={onPasswordChangesChanged}
            />
            <Text style={styles.checkboxLabel}>Password changes</Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <CheckBox
              value={input.specialOffers}
              onValueChange={onSpecialOffersChanges}
            />
            <Text style={styles.checkboxLabel}>Special offers</Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <CheckBox
              value={input.newsletter}
              onValueChange={onNewsletterChanges}
            />
            <Text style={styles.checkboxLabel}>Newsletter</Text>
          </View>
        </View>
        <Button title="Log out" color="#f4ce14" onPress={logOutClicked} />
        <View style={styles.changesBar}>
          <View style={styles.changeButtonWrapper}>
            <Button
              title="Discard changes"
              color="#cbd2d9"
              onPress={readInputFromStorage}
            />
          </View>
          <View style={styles.changeButtonWrapper}>
            <Button
              title="Save changes"
              color="#495e57"
              onPress={saveInputToStorage}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    justifyContent: "center",
  },
  navigationImage: {
    alignSelf: "center",
    marginTop: 7,
    marginBottom: 7,
  },
  content: {
    flex: 0.7,
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 14,
    marginTop: 18,
  },
  sectionMargin: {
    marginBottom: 18,
  },
  avatarBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircleWrapper: {
    width: 75,
    height: 75,
    backgroundColor: "#62d6c4",
    borderRadius: 1000,
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    borderRadius: 1000,
    height: 75,
    width: 75,
  },
  avatarText: {
    fontSize: 30,
    color: "#ffffff",
  },
  changeAvatarButtonWrapper: {
    marginLeft: 9,
    marginRight: 9,
  },
  inputSectionInput: {
    fontSize: 18,
    height: 42,
    padding: 6,
    borderWidth: 1,
    borderColor: "#344854",
    borderRadius: 5,
  },
  checkboxSection: {
    marginTop: 5,
    marginBottom: 18,
  },
  checkboxWrapper: {
    flexDirection: "row",
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 6,
  },
  changesBar: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    paddingBottom: 50,
  },
  changeButtonWrapper: {
    width: "45%",
    marginLeft: 7,
    marginRight: 7,
  },
});

export default Profile;
