import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PrimaryHeading from '../../components/PrimaryHeading';
import {Colors} from '../../constants/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import OnBoardingImage from '../../assets/onbaording/image1.svg';

function OnBoardingScreen1({navigation}) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flex: 0.23,

            justifyContent: 'center',
            paddingHorizontal: 12,
          }}>
          <View>
            <PrimaryHeading text={'Situations'} color={Colors.White} />
          </View>
          <Text
            style={{
              alignSelf: 'flex-start',
              borderRadius: 6,
              paddingHorizontal: 8,
              backgroundColor: `${Colors.White}4D`,
              fontSize: 18,
              fontFamily: 'Outfit-Regular',
              color: Colors.White,
              marginVertical: 6,
            }}>
            Unlock the secrets of body language
          </Text>

          <Text
            style={{
              alignSelf: 'flex-start',
              borderRadius: 6,
              paddingHorizontal: 8,
              backgroundColor: `${Colors.White}4D`,
              fontSize: 18,
              fontFamily: 'Outfit-Regular',
              color: Colors.White,
            }}>
            in everyday moments
          </Text>
        </View>
        <OnBoardingImage
          width="50%"
          height="100%"
          style={{
            alignSelf: 'center',
          }}
        />
        {/* <View
          style={{
            flex: 0.6,
            backgroundColor: 'red',
          }}>
          <Image
            source={require('../../assets/onbaording/image1.jpg')}
            style={{height: '100%', width: '100%'}}
          />
        </View> */}
        <View></View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    // position: 'relative',
  },
});

export default OnBoardingScreen1;
