import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {Colors} from '../constants/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ButtonText from './ButtonText';
const PrimaryButton = ({text, width, loading}) => {
  return (
    <View style={[styles.buttonContainer, {width: width ? width : wp('90%')}]}>
      {loading ? (
        <ActivityIndicator color={Colors.White} animating={loading} />
      ) : (
        <ButtonText text={text} />
      )}
    </View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.primaryColor,
    alignSelf: 'center',
    padding: 14,
    borderRadius: 30,
  },
});
