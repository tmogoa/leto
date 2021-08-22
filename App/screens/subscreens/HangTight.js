import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import tw from "tailwind-react-native-classnames";
import colors from "../../assets/colors/colors";
import fonts from "../../assets/fonts/fonts";
import Spacer from "../../components/Spacer";
import { MaterialIcons } from "@expo/vector-icons";
import { AppContext } from "../../util/AppContext";
import { TextField } from "../../components/TextField";
import DriverItem from "../../components/DriverItem";
import { useNavigation } from "@react-navigation/core";
import PriceLabel from "../../components/PriceLabel";
import { Button } from "../../components/Button";

const HangTight = () => {
    const navigation = useNavigation();
    const [status, setstatus] = useState(2);
    const { origin, dest } = useContext(AppContext);

    useEffect(() => {
        if (status === 2) {
            navigation.navigate("Pickup");
        }
    }, [status]);
    return (
        <View style={tw`flex-1 p-2 bg-white`}>
            <Text style={[tw`text-2xl text-gray-600 m-2`, styles.fp]}>
                Hang tight
            </Text>
            <View style={tw`p-2 flex-row justify-between items-center`}>
                <View>{renderStatus()}</View>
                {renderPrice()}
            </View>
            <View style={tw`p-2`}>
                <TextField
                    iconName="place"
                    placeholder="Where from?"
                    value={origin.name}
                    editable={false}
                />
                <Spacer height={1} />
                <TextField
                    iconName="place"
                    placeholder="Where to?"
                    value={dest.name}
                    editable={false}
                />
                <Spacer height={4} />
                {renderDriverItem()}
                <Spacer height={5} />

                <View>
                    <Button
                        text="Cancel ride"
                        iconName="close"
                        onPress={() => {
                            navigation.navigate("RideTypeChooser");
                        }}
                    />
                </View>
            </View>
        </View>
    );

    function renderDriverItem() {
        return status === 2 && <DriverItem />;
    }

    function renderPrice() {
        return status >= 1 && <PriceLabel price={130} header="KES" />;
    }

    function renderStatus() {
        switch (status) {
            case 0:
                return (
                    <View style={tw`flex-row items-center`}>
                        <ActivityIndicator
                            size="small"
                            color={colors.primary}
                        />

                        <Text style={[tw`text-gray-500 ml-2`, styles.fi]}>
                            Looking for matches
                        </Text>
                    </View>
                );
            case 1:
                return (
                    <>
                        <View style={tw`flex-row items-center`}>
                            <MaterialIcons
                                name="check"
                                color={colors.success}
                                size={20}
                            />

                            <Text style={[tw`text-gray-500 ml-2`, styles.fi]}>
                                Matches found
                            </Text>
                        </View>
                        <View style={tw`flex-row items-center mt-2`}>
                            <ActivityIndicator
                                size="small"
                                color={colors.primary}
                            />

                            <Text style={[tw`text-gray-500 ml-2`, styles.fi]}>
                                Searching for a driver
                            </Text>
                        </View>
                    </>
                );
            case 2:
                return (
                    <>
                        <View style={tw`flex-row items-center`}>
                            <MaterialIcons
                                name="check"
                                color={colors.success}
                                size={20}
                            />

                            <Text style={[tw`text-gray-500 ml-2`, styles.fi]}>
                                Your driver is Jake
                            </Text>
                        </View>
                        <View style={tw`flex-row items-center mt-2`}>
                            <ActivityIndicator
                                size="small"
                                color={colors.primary}
                            />

                            <Text style={[tw`text-gray-500 ml-2`, styles.fi]}>
                                Calculating pickup point
                            </Text>
                        </View>
                    </>
                );
        }
    }
};

export default HangTight;

const styles = StyleSheet.create({
    fp: {
        fontFamily: fonts.poppinsRegular,
    },
    fi: {
        fontFamily: fonts.interRegular,
    },
});