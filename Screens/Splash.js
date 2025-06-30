import React, { Component } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

export default class Splash extends Component {
    componentDidMount() {
        // Navigate to Welcome screen after 3 seconds
        setTimeout(() => {
            // console.log(this.props.navigation)
            this.props.navigation.replace('Welcome'); // Navigate to Welcome screen
        }, 3000); // 3000ms = 3 seconds
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.splashImage} source={require('../assests/logo2.gif')} />
                {/* You can uncomment ActivityIndicator if you need to show a loader */}
                {/* <ActivityIndicator size='large' color={'#fff'} style={styles.loader} /> */}
            </View>
        );
    }
}

// Retrieve initial screen's width and height
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#05294B', // Add background color if needed
    },
    splashImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    loader: {
        height: '100%',
        position: 'absolute', 
        alignSelf: 'center',
    },
});
