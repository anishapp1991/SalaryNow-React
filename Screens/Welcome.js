import React, { Component } from 'react';
import { View, TouchableOpacity, StatusBar, StyleSheet, Text, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LottieView from 'lottie-react-native'; // Lottie for animations
import Ionicons from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
// Load Lottie animation files
const image1 = require('../assests/lottie/registration.json');
const image3 = require('../assests/lottie/disburse.json');
const image2 = require('../assests/lottie/approved.json');

const slides = [
  {
    key: 'One',
    animation: image1,
    textOverlay1: "Registration",
    textOverlay2: "Get yourself registered with Salary Now app",
    backgroundColor: '#FFFF',
  },
  {
    key: 'Two',
    animation: image2,
    textOverlay1: "Instant Approval",
    textOverlay2: "Get your application approved instantly after verifying your documents",
    backgroundColor: '#FFFF',
  },
  {
    key: 'Three',
    animation: image3,
    textOverlay1: "Instant Disbursal",
    textOverlay2: "Get the disbursal within 10 minutes of mandate sign",
    backgroundColor: '#FFFF',
  },
];

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlideIndex: 0,
      isLastSlide: false, // Track if the current slide is the last
    };
    this.sliderRef = React.createRef(); // Create a ref for AppIntroSlider
  }

  handleSkip = () => {
    this.props.navigation.navigate('Board');
  };

  handleNextSlide = () => {
    const { currentSlideIndex } = this.state;
  
    if (currentSlideIndex < slides.length - 1) {
      const nextIndex = currentSlideIndex + 1;
  
      // Update slider and state
      this.sliderRef.current.goToSlide(nextIndex, true);
      this.setState({
        currentSlideIndex: nextIndex,
        isLastSlide: nextIndex === slides.length - 1, // Check if the next slide is the last
      });
    } else {
      this.props.navigation.navigate('Board');
    }
  };

  renderItem = ({ item }) => {
    return (
      <View style={[styles.container, { backgroundColor: item.backgroundColor }]}>
        <StatusBar hidden={false} />
        <LottieView
          source={item.animation}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.textOverlay}>{item.textOverlay1}</Text>
        <Text style={styles.textOverlayBottom}>{item.textOverlay2}</Text>
      </View>
    );
  };

  DoneButton = () => {
    return (
      <View style={styles.buttonCircle2}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Board')}>
          <Text style={styles.buttonText}>Go</Text>
        </TouchableOpacity>
      </View>
    );
  };

  NextButton = () => {
    return (
      <TouchableOpacity onPress={this.handleNextSlide} style={styles.buttonCircle1}>
        <Ionicons name="arrow-forward-circle-outline" size={40} style={styles.buttonText1} />
      </TouchableOpacity>
    );
  };

  onSlideChange = (index) => {
    this.setState({
      currentSlideIndex: index,
      isLastSlide: index === slides.length - 1, // Update if it's the last slide
    });
  };

  render() {
    const { isLastSlide } = this.state;

    return (
      <View style={styles.container}>
        <AppIntroSlider
          ref={this.sliderRef} // Attach the ref to the AppIntroSlider
          renderItem={this.renderItem}
          data={slides}
          keyExtractor={(item) => item.key} // Use keyExtractor to avoid warnings
          onSlideChange={this.onSlideChange} // Handle slide change
          renderDoneButton={this.DoneButton}
          renderNextButton={this.NextButton}
          activeDotStyle={{ backgroundColor: '#419fb8' }} // Customize active dot
        />
        {/* Render Skip button outside AppIntroSlider */}
        {!isLastSlide && (
          <TouchableOpacity style={styles.skipButton} onPress={this.handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
  },
  animation: {
    width: '70%',
    height: '60%',
    alignSelf: 'center',
    marginTop: width/3.5
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'transparent', // Transparent background
    borderWidth: 1, // Border thickness
    borderColor: '#419fb8', // Border color
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20, // Rounded corners
  },
  skipButtonText: {
    color: '#419fb8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textOverlay: {
    // position: 'absolute',
    // bottom: width /2,
    // left: 0,
    // right: 0,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    // transform: [{ translateY: -50 }], // Center text vertically
  },
  textOverlayBottom: {
    // position: 'absolute',
    bottom: 0,
    // marginTop:15,
    // left: 0,
    // right: 0,
    fontSize: 14,
    color: '#dfdfdfd',
    textAlign: 'center',
    paddingHorizontal: 20,
    // transform: [{ translateY: 175 }],
  },
  buttonCircle1: {
    width: 60,
    height: 60,
    backgroundColor: '#ffff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    zIndex: 10,
  },
  buttonCircle2: {
    width: 45,
    height: 45,
    backgroundColor: '#419fb8',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText1: {
    marginBottom: 12
  },
  buttonText: {
    color: '#fff'
  },
});