import React, { useState } from 'react';
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

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.55; // Taller image for more coverage
const languages = ['English', 'Hindi', 'Kannada'];

const SelectLanguage = () => {
    const navigation = useNavigation();
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        navigation.navigate("Chatbot"); // Uncomment to navigate on selection
    };

    const renderLanguageButton = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.languageButton,
                selectedLanguage === item && styles.selectedButton
            ]}
            onPress={() => handleLanguageSelect(item)}
            activeOpacity={0.9}
        >
            <Text
                style={[
                    styles.buttonText,
                    selectedLanguage === item && styles.selectedButtonText
                ]}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            {/* IMAGE WITH WELCOME TEXT INSIDE */}
            <ImageBackground
                source={require('../../assets/welcome.jpeg')}
                style={styles.backgroundImage}
            >
                <View style={styles.textOnImage}>
                    <Text style={styles.welcomeText}>WELCOME</Text>
                    <Text style={styles.letsGetStartedText}>Let's Get Started</Text>
                </View>
            </ImageBackground>

            {/* WHITE BOTTOM SHEET */}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // NO GREEN background here!
    },
    backgroundImage: {
        width: '100%',
        height: IMAGE_HEIGHT,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
    },
    textOnImage: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 28 : 16, // a bit above the bottom of image
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