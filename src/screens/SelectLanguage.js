import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    FlatList,
} from 'react-native';
import colors from '../constants/colors';
import dimensions from '../constants/dimensions';

const languages = ['English', 'Hindi', 'Kannada']; // Array of languages

const SelectLanguage = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default to English

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
    };

    const renderLanguageButton = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.languageButton,
                selectedLanguage === item && styles.selectedButton,
            ]}
            onPress={() => handleLanguageSelect(item)}
        >
            <Text
                style={[
                    styles.buttonText,
                    selectedLanguage === item && styles.selectedButtonText,
                ]}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ImageBackground
                source={require('../assets/welcome.jpeg')}
                style={styles.backgroundImage}
            >
                <View style={styles.overlay} />
                <View style={styles.topContent}>
                    <Text style={styles.welcomeText}>WELCOME</Text>
                    <Text style={styles.letsGetStartedText}>Let's Get Started</Text>
                </View>

                <View style={styles.bottomSheet}>
                    <Text style={styles.chooseLanguageText}>Choose Language</Text>
                    <FlatList
                        data={languages}
                        keyExtractor={(item) => item}
                        renderItem={renderLanguageButton}
                        contentContainerStyle={styles.languageList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay
    },
    topContent: {
        position: 'absolute',
        top: dimensions.height * 0.35, // Moved up a bit
        left: 20,
        marginTop:40
    },
    welcomeText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.white,
    },
    letsGetStartedText: {
        fontSize: 18,
        color: colors.white,
        marginTop: 5,
    },
    bottomSheet: {
        backgroundColor: colors.lightGray,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 60, // reduced padding to move content up
        // paddingHorizontal: 30,
        alignItems: 'center',
    },
    chooseLanguageText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 10, // reduced for compactness
    },
    languageList: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    languageButton: {
        backgroundColor: colors.gray,
        paddingVertical: 15,
        borderRadius: 30,
        width: dimensions.width * 0.8,
        marginVertical: 8,
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: colors.primary,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.darkGray,
    },
    selectedButtonText: {
        color: colors.white,
    },
});

export default SelectLanguage;