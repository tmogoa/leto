import React, { useState } from "react";
import { Text, View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";
import { Inter_500Medium, Inter_400Regular } from "@expo-google-fonts/inter";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../assets/colors/colors";
import AppLoading from "expo-app-loading";
import { Toast } from "../components/Toast";
import { Button } from "../components/Button";
import { KeyboardSpacer } from "../components/KeyboardSpacer";
import { IconButton } from "../components/IconButton";
import { LabelledTextInput } from "../components/LabelledTextInput";
import { api } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spacer from "../components/Spacer";

export default ({ navigation }) => {
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastText, setToastText] = useState("");
    const [firstName, onChangeFirstName] = useState("Tony");
    const [lastName, onChangeLastName] = useState("Mogoa");
    const [btnLoading, setBtnLoading] = useState(false);

    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Inter_500Medium,
        Inter_400Regular,
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View>
                        <View style={styles.backIcon}>
                            <IconButton
                                icon={
                                    <MaterialIcons
                                        name="arrow-back-ios"
                                        size={25}
                                        color={colors.iconDark}
                                    />
                                }
                                onPress={() => navigation.goBack()}
                            />
                        </View>
                        <Text style={styles.logoText}>Leto.</Text>
                        <Text style={styles.tagline}>
                            Cheaper greener rides.
                        </Text>
                        <Text style={styles.title}>Sign up</Text>

                        <View style={[styles.center, { marginVertical: 20 }]}>
                            <Toast
                                hidden={!toastVisible}
                                type="danger"
                                text={toastText}
                            />
                        </View>

                        <View>
                            <LabelledTextInput
                                label="Firstname"
                                iconName="person"
                                value={firstName}
                                onChangeText={onChangeFirstName}
                                placeholder="Firstname"
                            />
                            <Spacer height={10} />
                            <LabelledTextInput
                                label="Lastname"
                                iconName="person"
                                value={lastName}
                                onChangeText={onChangeLastName}
                                placeholder="Lastname"
                            />
                            <View style={styles.spacer} />

                            <View style={styles.btnContainer}>
                                <Button
                                    text="Next"
                                    onPress={() => checkName()}
                                    loading={btnLoading}
                                />
                            </View>
                        </View>
                        <KeyboardSpacer
                            onToggle={(visible) => setScrollEnabled(visible)}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    async function checkName() {
        if (firstName === "" || lastName === "") {
            setToastVisible(true);
            setToastText("Fields cannot be empty");
        } else {
            setBtnLoading(true);
            const params = new FormData();
            params.append("first-name", firstName);
            params.append("last-name", lastName);
            params.append("email", "");
            params.append("phone", "");
            params.append("profile-image", "");
            try {
                const token = await AsyncStorage.getItem("@token");
                const config = {
                    headers: {
                        auth: token,
                    },
                };
                api.post(`editProfile.php`, params, config)
                    .then((resp) => {
                        console.log(resp.data); //OK
                        if (resp.data.status !== "OK") {
                            setToastVisible(true);
                            setToastText(resp.data.message);
                            setBtnLoading(false);
                            navigation.navigate("VerifyEmail", {
                                token: token,
                            });
                        } else {
                            setBtnLoading(false);
                            navigation.navigate("VerifyEmail");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        setBtnLoading(false);
                        setToastVisible(true);
                        setToastText("Something went wrong.");
                    });
            } catch (error) {
                console.log(error);
            }
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    backIcon: {
        marginTop: 40,
        marginLeft: 30,
        marginBottom: 30,
    },
    logoText: {
        color: colors.textDarker,
        fontFamily: "Poppins_400Regular",
        fontSize: 60,
        marginLeft: 30,
    },
    tagline: {
        color: colors.textLighter,
        fontFamily: "Inter_500Medium",
        fontSize: 20,
        marginBottom: 15,
        marginLeft: 40,
    },
    title: {
        fontFamily: "Inter_400Regular",
        fontSize: 22,
        color: colors.textLighter,
        marginLeft: 20,
        marginTop: 20,
    },
    label: {
        color: colors.textLighter,
        fontFamily: "Inter_500Medium",
        fontSize: 17,
        marginBottom: 8,
        marginLeft: 20,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    btnContainer: {
        padding: 20,
        marginTop: 10,
    },
});
