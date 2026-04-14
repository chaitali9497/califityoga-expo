import BottomBar from "@/src/components/BottomBar";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="mood"
          options={{
            title: "Mood Stat",
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: "Report",
          }}
        />
        <Tabs.Screen
          name="myHabits"
          options={{
            title: "My Habits",
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
          }}
        />
      </Tabs>
      <BottomBar />
    </View>
  );
}
