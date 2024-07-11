import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../constants/Colors';
import SecondaryHeading from '../components/SecondaryHeading';
import ButtonText from '../components/ButtonText';
import Advertisement from '../components/Advertisment';
import OnBoardingBackgroundDesign from '../components/OnBaordingBackgroundDesign';
import {useSelector, useDispatch} from 'react-redux';
import {introQuestion} from '../../store/GetIntroQuestion';
import Loader from '../components/Loader';
import {makeApiRequest} from '../Axios/ApiRequests';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InternetConnection from '../components/InternetConnection';
import {fetch} from '@react-native-community/netinfo';
function OnBoardingScreen4({navigation}) {
  const dispatch = useDispatch();
  const introData = useSelector(state => state.intro);
  const user_data = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState('');
  const [netWorkState, setNetWorkState] = useState(true);

  const handleSelection = selected => {
    setSelect(selected);
  };

  useEffect(() => {
    fetch()
      .then(state => {
        setNetWorkState(state.isConnected);
        if (state.isConnected) {
          try {
            dispatch(
              introQuestion({
                endPoint: '/get-intro-questions',
                method: 'get',
              }),
            );
          } catch (error) {
            console.log('err', error);
          }
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  }, [netWorkState]);

  const AdvertisementAwnser = async () => {
    fetch()
      .then(async state => {
        setNetWorkState(state.isConnected);
        if (state.isConnected) {
          if (select) {
            const advertisementArray = [];
            advertisementArray[0] = select;
            const data = {
              intro_question_option_id: advertisementArray,
            };
            const headers = {
              Authorization: `Bearer ${user_data?.data?.token}`,
            };
            setLoading(true);
            try {
              const response = await makeApiRequest(
                'save-intro-answer',
                'post',
                data,
                headers,
              );
              setLoading(false);
              if (response.success) {
                AsyncStorage.setItem(
                  'screen-navigation',
                  JSON.stringify({
                    onBoardinding: false,
                    onBoardingScreen: 'OnBoardingScreen5',
                  }),
                ).then(() => {
                  navigation.navigate('OnBoardingScreen5');
                });
              }
            } catch (error) {
              setLoading(false);
              Toast.show(error.message);
            }
          } else {
            Toast.show('Tap to select one of them!');
          }
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
    <>
      {introData?.isLaoding ? (
        <Loader state={introData?.isLaoding} />
      ) : (
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}>
            <View style={styles.displayContainer}>
              <ScrollView
                overScrollMode="never"
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: 24,
                  }}>
                  {introData?.data?.data && (
                    <SecondaryHeading text={introData.data?.data[0]?.title} />
                  )}
                </View>
                <View
                  style={{
                    marginVertical: 44,
                  }}>
                  {introData?.data?.data &&
                    introData?.data?.data[0]?.options?.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.8}
                          onPress={() => {
                            handleSelection(item.id);
                          }}>
                          <Advertisement
                            selected={select}
                            buttonText={item.title}
                            image={item.icon}
                            itemId={item.id}
                          />
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </ScrollView>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  AdvertisementAwnser();
                }}>
                <View style={styles.buttonContainer}>
                  {loading ? (
                    <ActivityIndicator
                      color={Colors.White}
                      animating={loading}
                    />
                  ) : (
                    <ButtonText text={'Continue'} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <OnBoardingBackgroundDesign onBoardingNumber={4} />
        </View>
      )}
    </>
  );
}

export default OnBoardingScreen4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayContainer: {
    width: '95%',
    height: Platform.OS === 'ios' ? '84%' : '85%',
    backgroundColor: Colors.White,
    borderRadius: 30,
    elevation: 5,
    shadowRadius: 2,
  },
  buttonContainer: {
    backgroundColor: Colors.primaryColor,
    alignSelf: 'center',
    width: '90%',
    padding: 13,
    bottom: 12,
    borderRadius: 30,
  },
});
