import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Alert,
  FlatList,
} from "react-native";

import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from "../database";
import { useUpdateEffect } from "../utils";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

const Home = ({ navigation }) => {
  const [data, setData] = useState({
    avatar: "",
    firstname: "",
    lastname: "",
    menuItems: [],
  });

  const [categories, setCategories] = useState({
    Starters: false,
    Mains: false,
    Desserts: false,
    Drinks: false,
  });

  const [query, setQuery] = useState("");
  const [searchBarText, setSearchBarText] = useState("");

  const fetchData = async () => {
    const rawData = await fetch(API_URL);
    const data = await rawData.json();
    return data.menu;
  };

  useUpdateEffect(() => {
    (async () => {
      try {
        const selectedCategorieNames = Object.keys(categories).reduce(
          (selectedCategories, category) => {
            if (categories[category]) {
              selectedCategories.push(category);
            }
            return selectedCategories;
          },
          []
        );
        const menuItems = await filterByQueryAndCategories(
          query,
          selectedCategorieNames
        );

        setData((prev) => ({
          ...prev,
          menuItems: menuItems,
        }));
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [categories, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  getFirstLetterUp = (string) => {
    if (string) {
      return string.charAt(0).toUpperCase();
    } else {
      return "";
    }
  };

  readSavedData = async () => {
    const avatar = (await AsyncStorage.getItem("AVATAR")) ?? "";
    const firstname = (await AsyncStorage.getItem("FIRSTNAME")) ?? "";
    const lastname = (await AsyncStorage.getItem("LASTNAME")) ?? "";

    setData((prev) => ({
      ...prev,
      avatar: avatar,
      firstname: firstname,
      lastname: lastname,
    }));
  };

  readMenuItems = async () => {
    try {
      await createTable();
      let menuItems = await getMenuItems();

      if (!menuItems.length) {
        menuItems = await fetchData();
        saveMenuItems(menuItems);
      }

      setCategories(() => {
        return [...new Set(menuItems.map((item) => item.category))].reduce(
          (a, v) => ({ ...a, [v]: true }),
          {}
        );
      });

      setData((prev) => ({
        ...prev,
        menuItems: menuItems,
      }));
    } catch (e) {
      // Handle error
      Alert.alert(e.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      readSavedData();
      readMenuItems();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navigation}>
        <View style={styles.navigationSpacer} />
        <Image
          style={styles.navigationImage}
          source={require("../assets/Logo.png")}
        />
        <Pressable
          style={styles.avatarBar}
          onPress={() => navigation.navigate("Profile")}
        >
          {data.avatar ? (
            <Image style={styles.avatarImage} source={{ uri: data.avatar }} />
          ) : (
            <View style={styles.avatarCircleWrapper}>
              <Text style={styles.avatarText}>
                {getFirstLetterUp(data.firstname) +
                  getFirstLetterUp(data.lastname)}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
      <View style={styles.info}>
        <Text style={styles.infoTitle}>Little Lemon</Text>
        <Text style={styles.infoSubTitle}>Chicago</Text>
        <View style={styles.infoTextPictureSection}>
          <Text style={styles.infoText}>
            We are family owned Mediterranean restaurant, focused on traditional
            recipes served with modern twist.
          </Text>
          <Image
            style={styles.infoPicture}
            source={require("../assets/HeroImage.png")}
          />
        </View>
        <View style={styles.infoSearchSection}>
          <Ionicons name="md-search-sharp" size={30} color="#333333" />
          <TextInput
            style={styles.infoSearchInput}
            onChangeText={handleSearchChange}
            value={searchBarText}
            placeholder="Search for a dish"
          />
        </View>
      </View>
      <View style={styles.category}>
        <Text style={styles.categoryTitle}>Order for delivery</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.categoryButtonsSection}
        >
          {Object.keys(categories).map((category, index) => (
            <Pressable
              onPress={() =>
                setCategories((prev) => {
                  const newState = { ...prev };
                  newState[category] = !newState[category];
                  return newState;
                })
              }
              style={[
                styles.categoryButton,
                {
                  flex: 1 / Object.keys(categories).length,
                  backgroundColor: categories[category] ? "#495e57" : "#e9ebea",
                },
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.categoryButtonText,
                    {
                      color: categories[category] ? "#e9ebea" : "#495e57",
                    },
                  ]}
                >
                  {category}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <FlatList
        style={styles.dishes}
        data={data.menuItems}
        keyExtractor={(dish) => dish.name}
        renderItem={({ item }) => (
          <View style={styles.dishInfoPicture}>
            <View style={styles.dishInfo}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishDescription}>
                {item.description.length > 50
                  ? item.description.substr(0, 50) + "\u2026"
                  : item.description}
              </Text>
              <Text style={styles.dishPrice}>{item.price}</Text>
            </View>
            <View style={styles.dishPictureWrapper}>
              <Image
                style={styles.dishPicture}
                source={{
                  uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
                }}
              />
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  navigationSpacer: {
    height: 50,
    width: 50,
  },
  avatarBar: {
    alignContent: "center",
    justifyContent: "center",
    marginTop: 3,
    marginBottom: 3,
    marginRight: 5,
  },
  avatarCircleWrapper: {
    width: 50,
    height: 50,
    borderRadius: 1000,
    backgroundColor: "#62d6c4",
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    borderRadius: 1000,
    height: 50,
    width: 50,
  },
  avatarText: {
    fontSize: 22,
    color: "#ffffff",
  },
  info: {
    backgroundColor: "#495e57",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 25,
  },
  infoTitle: {
    fontSize: 36,
    color: "#f4ce14",
  },
  infoSubTitle: {
    fontSize: 30,
    color: "#edefee",
  },
  infoTextPictureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 16,
    color: "#edefee",
    width: 175,
    marginTop: 15,
  },
  infoPicture: {
    borderRadius: 10,
    width: 160,
    height: 160,
  },
  infoSearchSection: {
    flexDirection: "row",
    backgroundColor: "#e4e4e4",
    borderRadius: 10,
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 20,
  },
  infoSearchInput: {
    marginLeft: 10,
    fontSize: 20,
  },
  category: {
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
  categoryTitle: {
    textTransform: "uppercase",
    fontSize: 22,
    fontWeight: "bold",
  },
  categoryButtonsSection: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 25,
  },
  categoryButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 7,
    paddingLeft: 18,
    paddingRight: 18,
    marginLeft: 6,
    marginRight: 6,
    borderRadius: 10,
  },
  categoryButtonText: {
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  dishes: {
    borderTopColor: "#cccccc",
    borderTopWidth: 1,
    paddingTop: 10,
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  dishInfoPicture: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomColor: "#eaeceb",
    borderBottomWidth: 1,
  },
  dishInfo: {
    width: "60%",
  },
  dishName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  dishDescription: {
    color: "#495e57",
    marginBottom: 6,
  },
  dishPrice: {
    color: "#495e57",
    fontWeight: "700",
  },
  dishPictureWrapper: {
    width: "30%",
    justifyContent: "center",
    alignContent: "center",
  },
  dishPicture: {
    width: 100,
    height: 100,
  },
});

export default Home;
