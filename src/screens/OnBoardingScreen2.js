import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
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
import {FILE_URL} from '@env';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
function OnBoardingScreen2({navigation}) {
  const app_settings = useSelector(state => state.settings);
  const quiz = useSelector(state => state.quiz);
  const insets = useSafeAreaInsets();
  console.log('asd');
  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'relative',
          flex: 0.7,
        }}>
        <ImageBackground
          source={require('../assets/OnBoardingScreen2.png')}
          resizeMode="cover"
          style={{height: hp('50%')}}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: Platform.OS === 'ios' ? insets.top : hp('3%'),
            }}>
            <Image source={require('../assets/Star.png')} />
          </View>

          <View style={{position: 'absolute', right: 0, top: hp('35%')}}>
            <Image source={require('../assets/layer.png')} />
          </View>

          <View
            style={{
              marginHorizontal: 4,
              marginVertical: Platform.OS === 'ios' ? insets.top + 24 : 24,
              justifyContent: 'space-around',
              flex: 0.65,
              alignItems: 'flex-end',
            }}>
            <View
              style={{
                width: '80%',
                alignItems: 'flex-end',
              }}>
              <PrimaryHeading
                text={app_settings.data?.data?.title_slide_2}
                color={Colors.White}
              />
            </View>
            <View
              style={{
                width: '65%',
                alignItems: 'flex-end',
              }}>
              <DesciptionText
                text={app_settings.data?.data?.description_slide_2}
                textAlignment={'right'}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}>
        <LottieView
          source={{
            uri: `${FILE_URL}${app_settings.data?.data?.file_slide_2}`,
          }}
          autoPlay
          style={{
            height: 230,
            width: '100%',
          }}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          alignSelf: 'center',
          flex: 0.3,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            AsyncStorage.setItem(
              'screen-navigation',
              JSON.stringify({
                onBoardinding: false,
                onBoardingScreen: 'OnBoardingScreen3',
              }),
            ).then(() => {
              navigation.navigate('OnBoardingScreen3');
            });
          }}>
          <PrimaryButton text={'Next'} />
        </TouchableOpacity>
        <View
          style={{
            marginTop: 16,
            marginBottom:
              Platform.OS === 'ios' && insets.bottom > 0
                ? insets.bottom
                : Platform.OS === 'ios' && insets.bottom == 0
                ? 16
                : 16,
          }}>
          <Text style={{color: '#C3C0DE'}}>
            2 / {quiz.data?.data?.length + 8}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default OnBoardingScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
});
