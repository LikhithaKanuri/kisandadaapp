import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    FlatList,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18n from '../locales/i18n';
import { saveLanguage, getLanguage } from '../database/localdb';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.55;
const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    // { code: 'kn', name: 'Kannada' },
];

const SelectLanguage = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    useEffect(() => {
        const fetchLanguage = async () => {
            const savedLanguage = await getLanguage();
            console.log("savedLanguage-> ", savedLanguage);
            if (savedLanguage) {
                setSelectedLanguage(savedLanguage);
                i18n.changeLanguage(savedLanguage);
            }
        };
        fetchLanguage();
    }, []);

    const handleLanguageSelect = async (language) => {
        setSelectedLanguage(language.code);
        i18n.changeLanguage(language.code);
        await saveLanguage(language.code);
        navigation.navigate("Chatbot");
    };

    const renderLanguageButton = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.languageButton,
                selectedLanguage === item.code && styles.selectedButton
            ]}
            onPress={() => handleLanguageSelect(item)}
            activeOpacity={0.9}
        >
            <Text
                style={[
                    styles.buttonText,
                    selectedLanguage === item.code && styles.selectedButtonText
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ImageBackground
                source={require('../../assets/welcome.jpeg')}
                style={styles.backgroundImage}
            >
                <View style={styles.textOnImage}>
                    <Text style={styles.welcomeText}>{t('Welcome')}</Text>
                    <Text style={styles.letsGetStartedText}>{t("Let's Get Started")}</Text>
                </View>
            </ImageBackground>

            <View style={styles.bottomSheet}>
                <Text style={styles.chooseLanguageText}>{t('Choose Language')}</Text>
                <FlatList
                    data={languages}
                    keyExtractor={(item) => item.code}
                    renderItem={renderLanguageButton}
                    contentContainerStyle={styles.languageList}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backgroundImage: {
        width: '100%',
        height: IMAGE_HEIGHT,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
    },
    textOnImage: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 28 : 16,
        left: width * 0.06,
        zIndex: 2,
    },
    welcomeText: {
        fontSize: width * 0.11,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1.2,
        fontFamily: 'serif',
        textAlign: 'left',
        textShadowColor: 'rgba(0,0,0,0.18)',
        textShadowOffset: { width: 2, height: 3 },
        textShadowRadius: 8,
    },
    letsGetStartedText: {
        fontSize: width * 0.05,
        color: '#fff',
        marginTop: 4,
        fontFamily: 'serif',
        textAlign: 'left',
        textShadowColor: 'rgba(0,0,0,0.13)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 6,
    },
    bottomSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
        width: '100%',
        paddingVertical: height * 0.045,
        paddingHorizontal: width * 0.08,
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        minHeight: height * 0.45,
        zIndex: 3,
    },
    chooseLanguageText: {
        fontSize: width * 0.053,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: height * 0.02,
        fontFamily: 'serif',
    },
    languageList: {
        alignItems: 'center',
    },
    languageButton: {
        backgroundColor: '#E8E8E8',
        paddingVertical: height * 0.017,
        borderRadius: 26,
        width: width * 0.6,
        marginVertical: height * 0.012,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 3,
        elevation: 2,
    },
    selectedButton: {
        backgroundColor: '#3E8577',
    },
    buttonText: {
        fontSize: width * 0.047,
        fontWeight: 'bold',
        color: '#222',
        fontFamily: 'serif',
        letterSpacing: 0.3,
    },
    selectedButtonText: {
        color: '#fff',
    },
});

export default SelectLanguage;