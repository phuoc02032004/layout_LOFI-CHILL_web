import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Header from "../Header/Header";
import Songscreen from "./Songscreen";
import Artscreen from "./Artscreen";

const Tab = createMaterialTopTabNavigator();

const LofiScreen = () => {
  return (
    <>
      <View style={styles.container}>
        <Header />
        <View style={styles.topnav}>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: "tomato",
              tabBarInactiveTintColor: "#fff",
              tabBarIndicatorStyle: { backgroundColor: "tomato" },
              tabBarStyle: { backgroundColor: "#213E50" },
              tabBarLabelStyle: { fontFamily: "Poppins-Bold", fontSize: 20 },
              
            }}
          >
            <Tab.Screen name="Song" component={Songscreen} />
            <Tab.Screen name="Artist" component={Artscreen} />
          </Tab.Navigator>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#213E50",
  },
  topnav: {
    marginTop: 60,
    flex: 1,
    backgroundColor: "#213E50",
  },
  tabContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 40,
    fontFamily: "Poppins-Bold",
    color: "tomato",
  },
});

export default LofiScreen;
