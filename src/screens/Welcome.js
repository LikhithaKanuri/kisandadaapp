import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import dimensions from '../constants/dimensions';
import { getSession } from '../database/localdb';
import { useTranslation } from 'react-i18next';

const Welcome = () => {
    const { t } = useTranslation();
    const logoAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const token = await getSession();
                if (token) {
                    navigation.replace('Chatbot');
                } else {
                    setLoading(false);
                    startAnimation();
                }
            } catch (error) {
                console.error('Failed to get session:', error);
                setLoading(false);
                startAnimation();
            }
        };

        checkSession();
    }, []);

    const startAnimation = () => {
        Animated.sequence([
            Animated.timing(logoAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(textAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(buttonAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const redirect = () => navigation.navigate('Login');

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#F7CB46" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: logoAnim,
                        transform: [
                            {
                                scale: logoAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.8, 1],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <Image
                    source={require('../../assets/applogo1.png')}
                    style={styles.logo}
                />
            </Animated.View>

            <Animated.View
                style={[
                    styles.textContainer,
                    {
                        opacity: textAnim,
                        transform: [
                            {
                                translateY: textAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <Text style={styles.title}>
                    <Text style={styles.titleOrange}>{t('Kisan Dada')}</Text>
                </Text>
                <Text style={styles.subtitle}>
                    {t('Guiding Farmers with the Power of Intelligence.')}
                </Text>
            </Animated.View>

            <Animated.View
                style={[
                    styles.buttonContainer,
                    {
                        opacity: buttonAnim,
                        transform: [
                            {
                                translateY: buttonAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [60, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <TouchableOpacity style={styles.button} onPress={redirect} activeOpacity={0.82}>
                    <Text style={styles.buttonText}>{t('Get Started')}</Text>
                    <View style={styles.iconCircle}>
                        <AntDesign name="arrowright" size={24} color="#367165" />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#367165', // dark green
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    logoContainer: {
        marginTop: 40,
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: dimensions.width * 0.48,
        height: dimensions.width * 0.48,
        resizeMode: 'contain',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 80,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    titleOrange: {
        color: '#F7CB46',
        fontWeight: 'bold',
        fontSize: 32,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        marginTop: 14,
        textAlign: 'center',
        fontWeight: '400',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
        bottom: 90,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3E8577',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
        elevation: 12,
        width: dimensions.width * 0.8,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1,
        textAlign: 'center',
    },
    iconCircle: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
});

export default Welcome;