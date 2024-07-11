import React, {useEffect} from 'react';
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
import {FILE_URL} from '@env';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
function OnBoardingScreen3({navigation}) {
  const app_settings = useSelector(state => state.settings);
  const quiz = useSelector(state => state.quiz);
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'relative',
          flex: 0.7,
        }}>
        <ImageBackground
          source={require('../assets/OnBoardingScreen3.png')}
          resizeMode="cover"
          style={{height: hp('40%')}}>
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: Platform.OS === 'ios' ? insets.top / 1.5 : 0,
            }}>
            <Image source={require('../assets/groupOfStar.png')} />
          </View>

          <View
            style={{
              marginHorizontal: 18,
              marginTop: Platform.OS === 'ios' ? insets.top + 24 : 24,
              justifyContent: 'space-around',
              flex: 0.8,
              alignItems: 'flex-start',
              width: wp('80%'),
            }}>
            <View>
              <PrimaryHeading
                text={app_settings.data?.data?.title_slide_3}
                color={Colors.White}
              />
            </View>
            <View>
              <DesciptionText
                text={app_settings.data?.data?.description_slide_3}
                textAlignment={'left'}
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
        <View style={{}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              AsyncStorage.setItem(
                'screen-navigation',
                JSON.stringify({
                  onBoardinding: false,
                  onBoardingScreen: 'OnBoardingScreen4',
                }),
              ).then(() => {
                navigation.navigate('OnBoardingScreen4');
              });
            }}>
            <PrimaryButton text={"I'm ready"} />
          </TouchableOpacity>
        </View>
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
            3 / {quiz.data?.data?.length + 8}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default OnBoardingScreen3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
});
