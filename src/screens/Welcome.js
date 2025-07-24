import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';
import colors from '../constants/colors';
import dimensions from '../constants/dimensions';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
    const logoAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;


    const navigation = useNavigation();

    useEffect(() => {
        // Animate logo first, then title & subtitle, then button
        Animated.sequence([
            Animated.timing(logoAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(textAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(buttonAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, [logoAnim, textAnim, buttonAnim]);

    // functions
    const redirect = () =>{
        navigation.navigate('SelectLanguage');
    }
    return (
        <View style={styles.container}>
            {/* Logo Animation */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: logoAnim,
                        transform: [
                            {
                                scale: logoAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <Image
                    source={require('../assets/applogo1.png')}
                    style={styles.logo}
                />
            </Animated.View>

            {/* Title & Subtitle Animation */}
            <Animated.View
                style={[
                    styles.textContainer,
                    {
                        opacity: textAnim,
                        transform: [
                            {
                                translateY: textAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <Text style={styles.title}>KisaanDada.ai</Text>
                <Text style={styles.subtitle}>
                    Guiding Farmers with the Power of Intelligence.
                </Text>
            </Animated.View>

            {/* Button Animation */}
            <Animated.View
                style={[
                    styles.buttonContainer,
                    {
                        opacity: buttonAnim,
                        transform: [
                            {
                                translateY: buttonAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [80, 0], // moved button bit up
                                }),
                            },
                        ],
                    },
                ]}
            >
                <TouchableOpacity style={styles.button} onPress={redirect}>
                    <Text style={styles.buttonText}>Get Started</Text>
                    <AntDesign name="arrowright" size={24} color={colors.white} />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -80
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: dimensions.width * 0.5,
        height: dimensions.width * 0.5,
        resizeMode: 'contain',
    },
    textContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.secondary,
    },
    subtitle: {
        fontSize: 16,
        color: colors.white,
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 120, 
    },
    button: {
        backgroundColor: colors.buttonGreen,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: dimensions.width * 0.8,
        elevation: 10,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
    },
});

export default Welcome;