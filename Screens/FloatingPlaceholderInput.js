import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Animated } from 'react-native';

const FloatingPlaceholderInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  editable = true, // This prop controls whether the input is editable
  readOnly = false, // Controls the "read-only" behavior
  selectTextOnFocus = false, 
  maxLength,
  secureTextEntry = false, 
  style, // Add style prop here
  onFocus, // Add an optional onFocus callback
  autoCorrect,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderAnim] = useState(new Animated.Value(value || isFocused ? 1 : 0));

  // Effect to handle "view" mode or when there is already a value
  useEffect(() => {
    if (value) {
      Animated.timing(placeholderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (!isFocused) {
      Animated.timing(placeholderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [value, isFocused]);

  // Animate placeholder position
  const animatePlaceholder = (toValue) => {
    Animated.timing(placeholderAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleFocus = () => {
    setIsFocused(true);
    animatePlaceholder(1); // Move placeholder up
    if (onFocus) onFocus(); // Trigger the onFocus callback if provided
  };

  const handlePressIn = () => {
    if (onFocus) onFocus(); // Call onFocus even if already focused
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) animatePlaceholder(0); // Move placeholder down if input is empty
  };

  const placeholderStyle = {
    transform: [
      {
        translateY: placeholderAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [16, -10], // Adjust the translateY for the placeholder
        }),
      },
      {
        scale: placeholderAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.8], // Scale the placeholder size when focused
        }),
      },
    ],
    fontSize: 14,
    color: isFocused || value || !editable ? '#419fb8' : '#dfdfdf', // Adjust color based on focus state
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.placeholder, placeholderStyle]}>
        {placeholder}
      </Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPressIn={handlePressIn} // Trigger onPressIn to call onFocus callback
        keyboardType={keyboardType}
        autoCorrect={autoCorrect}
        editable={!readOnly && editable} // If readOnly is true, input becomes non-editable
        selectTextOnFocus={editable && !readOnly} // Select text when editable and not readOnly
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          style,
          {
            borderColor: isFocused || !editable ? '#419fb8' : '#dfdfdf',
            backgroundColor: readOnly ? '#fff' : '#fff',
          },
        ]}
        placeholder="" // Remove placeholder from default input
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  placeholder: {
    position: 'absolute',
    left: 5,
    fontSize: 14,
    color: '#000', // Set a light color for the placeholder
    backgroundColor: '#fff', // Ensure the background matches the input's background
    paddingHorizontal: 5, // Padding for better visibility
    marginTop: 15,
    zIndex: 1, // Keep the placeholder above the input field
  },
  input: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    color: '#000',
  },
  inputError: {
    borderColor: '#ff4d4d', // Red border for error state
  },
});

export default FloatingPlaceholderInput;
