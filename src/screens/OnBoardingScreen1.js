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
import PrimaryButton from '../components/PrimaryButton';
import PrimaryHeading from '../components/PrimaryHeading';
import {Colors} from '../constants/Colors';
import DesciptionText from '../components/DescriptionText';
import RestoreProgress from '../components/Modals/RestoreProgress';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appSettings} from '../../store/AppSettings';
import Loader from '../components/Loader';
import {quizQuestion} from '../../store/OnBoardingQuiz';
import LottieView from 'lottie-react-native';
import {FILE_URL} from '@env';

import DeviceInfo from 'react-native-device-info';

import {initConnection, getAvailablePurchases} from 'react-native-iap';
import {userData} from '../../store/userSlice';
import {makeApiRequest} from '../Axios/ApiRequests';
import {fetch} from '@react-native-community/netinfo';
import InternetConnection from '../components/InternetConnection';

function OnBoardingScreen1({navigation}) {
  const [result, setResult] = useState(false);
  const [isLaoding, setIsLoading] = useState(true);
  const app_settings = useSelector(state => state.settings);
  const authenticateUser = useSelector(state => state.user);
  const [netWorkState, setNetWorkState] = useState(true);
  const quiz = useSelector(state => state.quiz);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  useEffect(() => {
    setIsLoading(true);
    fetch()
      .then(state => {
        setNetWorkState(state.isConnected);
        setIsLoading(false);
        if (
          (app_settings.isLaoding ||
            quiz.isLaoding ||
            authenticateUser.isLaoding) &&
          state.isConnected
        ) {
          dispatch(
            appSettings({
              endPoint: '/get-settings',
              method: 'post',
            }),
          );
          dispatch(
            quizQuestion({
              endPoint: '/get-onboarding-questions',
            }),
          );
          DeviceInfo.getUniqueId()
            .then(deviceId => {
              const data = {
                device_id: deviceId,
              };
              dispatch(
                userData({
                  endPoint: '/login',
                  method: 'post',
                  data: data,
                }),
              );
            })
            .catch(err => {
              console.warn(err);
            });
        }
      })
      .catch(err => {
        console.warn(err);
      });
  }, [netWorkState]);

  const checkFileType = type => {
    const fileType = type?.split('/')[0];
    return fileType;
  };

  useEffect(() => {
    if (quiz.data?.data?.length > 0) {
      quiz.data?.data?.map(item => {
        if (checkFileType(item.file_type) === 'image') {
          // console.log(item.file);
          Image.prefetch(`${FILE_URL}${item.file}`).then(res => {
            console.log(res);
          });
        }
      });
    }
  }, [quiz]);

  function getStringBeforeAndAfterLastSpace(inputString) {
    const lastSpaceIndex = inputString.lastIndexOf(' ');
    if (lastSpaceIndex !== -1) {
      const beforeLastSpace = inputString.substring(0, lastSpaceIndex);
      let afterLastSpace = inputString.substring(lastSpaceIndex + 1);
      const lastCharacterOfAfterLastSpace = afterLastSpace.slice(-1);
      afterLastSpace = afterLastSpace.slice(0, -1);
      return {
        beforeLastSpace: beforeLastSpace,
        afterLastSpace: afterLastSpace,
        lastCharacterOfAfterLastSpace: lastCharacterOfAfterLastSpace,
      };
    } else {
      return {
        beforeLastSpace: inputString,
        afterLastSpace: '',
        lastCharacterOfAfterLastSpace: '',
      };
    }
  }

  if (!netWorkState) {
    return <InternetConnection setNetWorkState={setNetWorkState} />;
  }

  const getSubscriptionId = receipt => {
    if (JSON.parse(receipt).productId.includes('1y')) {
      return 1;
    } else if (JSON.parse(receipt).productId.includes('1m')) {
      return 2;
    }
  };

  const validateReceipt = async res => {
    try {
      if (authenticateUser.data.token) {
        const headers = {
          Authorization: `Bearer ${authenticateUser.data.token}`,
        };
        const subscriptionId = getSubscriptionId(res);
        const data = {
          subscription_id: subscriptionId,
          detail: res,
        };
        try {
          const response = await makeApiRequest(
            'save-user-subscription',
            'post',
            data,
            headers,
          );
          if (response.success) {
            setIsLoading(false);
            setResult(true);
          }
        } catch (error) {
          setIsLoading(false);
          console.warn('error', error);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log('err', error);
    }
  };

  return (
    <>
      {app_settings.isLaoding ||
      quiz.isLaoding ||
      isLaoding ||
      authenticateUser.isLaoding ? (
        <Loader
          state={
            app_settings.isLaoding || isLaoding || authenticateUser.isLaoding
          }
        />
      ) : (
        <View style={styles.container}>
          <View
            style={{
              position: 'relative',
              flex: 0.7,
            }}>
            <ImageBackground
              source={require('../assets/onBordingBackImg.png')}
              resizeMode="cover"
              style={{height: hp('49%')}}>
              <View
                style={{
                  position: 'absolute',
                  right: 0,
                  top: Platform.OS === 'ios' ? insets.top / 1.5 : 12,
                }}>
                <Image source={require('../assets/onBordingSpring.png')} />
              </View>
              <View
                style={{
                  marginHorizontal: 18,
                  marginVertical: Platform.OS === 'ios' ? insets.top + 24 : 24,
                  justifyContent: 'space-around',
                  flex: 0.8,
                  width: wp('80%'),
                }}>
                <View>
                  {app_settings.data?.data && (
                    <PrimaryHeading
                      text={
                        getStringBeforeAndAfterLastSpace(
                          app_settings.data?.data?.title_slide_1,
                        ).beforeLastSpace
                      }
                      color={Colors.White}
                      font={40}
                    />
                  )}
                  <View style={{flexDirection: 'row'}}>
                    {app_settings.data?.data && (
                      <PrimaryHeading
                        text={
                          getStringBeforeAndAfterLastSpace(
                            app_settings.data?.data?.title_slide_1,
                          ).afterLastSpace
                        }
                        color={'#B4FFEF'}
                        font={40}
                      />
                    )}
                    {app_settings.data?.data && (
                      <PrimaryHeading
                        text={
                          getStringBeforeAndAfterLastSpace(
                            app_settings.data?.data?.title_slide_1,
                          ).lastCharacterOfAfterLastSpace
                        }
                        color={Colors.White}
                        font={40}
                      />
                    )}
                  </View>
                </View>
                <DesciptionText
                  text={app_settings.data?.data?.description_slide_1}
                />
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
                uri: `${FILE_URL}${app_settings.data?.data?.file_slide_1}`,
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
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  AsyncStorage.setItem(
                    'screen-navigation',
                    JSON.stringify({
                      onBoardinding: false,
                      onBoardingScreen: 'OnBoardingScreen2',
                    }),
                  ).then(() => {
                    navigation.navigate('OnBoardingScreen2');
                  });
                }}>
                <PrimaryButton text={'Get Started'} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                initConnection()
                  .catch(e => {
                    setIsLoading(false);
                  })
                  .then(() => {
                    getAvailablePurchases()
                      .catch(() => {
                        setIsLoading(false);
                      })
                      .then(res => {
                        if (res.length > 0) {
                          setIsLoading(true);
                          validateReceipt(res[0].transactionReceipt);
                        } else {
                          setIsLoading(false);
                          Alert.alert(
                            'Restore Subscription',
                            'There is no prevoius Subscription!',
                            [
                              {
                                text: 'OK',
                              },
                            ],
                          );
                        }
                      });
                  });
              }}>
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
                <Text
                  style={{textDecorationLine: 'underline', color: '#C3C0DE'}}>
                  Restore Progress
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <RestoreProgress
            isModalVisible={result}
            setModalVisible={setResult}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // position: 'relative',
  },
});

export default OnBoardingScreen1;
