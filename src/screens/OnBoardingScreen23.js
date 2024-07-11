import React, {useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import {FILE_URL} from '@env';
import {userAppData} from '../../store/UserDataSlice';
import {fetch} from '@react-native-community/netinfo';
import InternetConnection from '../components/InternetConnection';
function OnBoardingScreen23({navigation}) {
  const settings = useSelector(state => state.settings);
  const quiz = useSelector(state => state.quiz);
  const user_data = useSelector(state => state.user);
  const {isLaoding} = useSelector(state => state.userAppData);
  const [netWorkState, setNetWorkState] = useState(true);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const getUseAppData = async () => {
    const headers = {
      Authorization: `Bearer ${user_data?.data?.token}`,
    };

    fetch()
      .then(async state => {
        setNetWorkState(state.isConnected);
        if (state.isConnected) {
          dispatch(
            userAppData({
              endPoint: '/user',
              method: 'post',
              data: null,
              headers: headers,
            }),
          ).then(() => {
            AsyncStorage.setItem(
              'screen-navigation',
              JSON.stringify({
                onBoardinding: true,
                onBoardingScreen: 'Subscription',
              }),
            ).then(() => {
              navigation.navigate('Subscription');
            });
          });
        }
      })
      .catch(err => {
        console.warn('error', err);
      });
  };

  if (!netWorkState) {
    return <InternetConnection setNetWorkState={setNetWorkState} />;
  }
  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'relative',
          flex: 0.8,
        }}>
        <ImageBackground
          source={require('../assets/OnBoarding23.png')}
          resizeMode="cover"
          style={{height: hp('43%')}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0.8,
            }}>
            <View style={{marginVertical: 22}}>
              <PrimaryHeading
                text={settings.data?.data?.after_onboarding_screen_title}
                color={Colors.White}
                font={34}
              />
            </View>
            <View style={{width: '80%'}}>
              <DesciptionText
                text={settings.data?.data?.after_onboarding_screen_description}
                textAlignment={'center'}
              />
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: Platform.OS === 'ios' ? '68%' : '65%',
            }}>
            <Image source={require('../assets/layer23.png')} />
          </View>
          <View
            style={{
              position: 'absolute',
              left: '10%',
              top: Platform.OS === 'ios' ? ' 23%' : '20%',
            }}>
            <Image source={require('../assets/coloredStar23.png')} />
          </View>
          <View
            style={{
              position: 'absolute',
              right: '4%',
              top: Platform.OS === 'ios' ? insets.top : 16,
            }}>
            <Image source={require('../assets/sparkle23.png')} />
          </View>
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: Platform.OS === 'ios' ? '48%' : '45%',
            }}>
            <Image source={require('../assets/star23.png')} />
          </View>
        </ImageBackground>
      </View>
      {settings.data?.data?.after_onboarding_screen_lottie_animation_file && (
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <LottieView
            source={{
              uri: `${FILE_URL}${settings.data?.data?.after_onboarding_screen_lottie_animation_file}`,
            }}
            autoPlay
            style={{
              height: 230,
              width: '100%',
            }}
          />
        </View>
      )}
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
              getUseAppData();
            }}>
            <PrimaryButton text={'Next'} loading={isLaoding} />
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
            {quiz.data?.data?.length + 8} / {quiz.data?.data?.length + 8}
          </Text>
        </View>
      </View>
    </View>
  );
}
export default OnBoardingScreen23;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
});
