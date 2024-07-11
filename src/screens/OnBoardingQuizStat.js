import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PrimaryButton from '../components/PrimaryButton';
import PrimaryHeading from '../components/PrimaryHeading';
import {Colors} from '../constants/Colors';
import DesciptionText from '../components/DescriptionText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

function OnBoardingQuizStat({navigation}) {
  const insets = useSafeAreaInsets();
  const quiz = useSelector(state => state.quiz);

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            position: 'relative',
            flex: 0.8,
          }}>
          <ImageBackground
            source={require('../assets/QuizStartImage.png')}
            resizeMode="cover"
            style={{height: hp('51%')}}>
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: Platform.OS === 'ios' ? insets.top / 1.5 : 0,
              }}>
              <Image source={require('../assets/quiz_start_design.png')} />
            </View>

            <View
              style={{
                marginHorizontal: 18,
                marginTop: Platform.OS === 'ios' ? insets.top + 24 : 24,
                justifyContent: 'space-around',
                flex: 0.7,
                alignItems: 'flex-start',
                width: wp('80%'),
              }}>
              <View
                style={{
                  width: wp('65%'),
                }}>
                <PrimaryHeading
                  text={"Let's test your knowledge with a quick quiz!"}
                  color={Colors.White}
                  font={36}
                />
              </View>
              <View>
                <DesciptionText
                  text={
                    'This will help us tailor your learning experience. Good luck!'
                  }
                  textAlignment={'left'}
                />
              </View>
            </View>
          </ImageBackground>
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            alignSelf: 'center',
            flex: 0.2,
          }}>
          <View style={{}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                AsyncStorage.setItem(
                  'screen-navigation',
                  JSON.stringify({
                    onBoardinding: false,
                    onBoardingScreen: 'OnBoardingScreen7',
                  }),
                ).then(() => {
                  navigation.navigate('OnBoardingScreen7');
                });
              }}>
              <PrimaryButton text={"Let's go!"} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 16,
              marginBottom: Platform.OS === 'ios' ? insets.bottom + 12 : 12,
            }}>
            <Text style={{color: '#C3C0DE'}}>
              7 /{quiz.data?.data?.length + 8}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

export default OnBoardingQuizStat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
});
