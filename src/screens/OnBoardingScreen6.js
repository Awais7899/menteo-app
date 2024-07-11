import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../constants/Colors';
import SecondaryHeading from '../components/SecondaryHeading';
import ButtonText from '../components/ButtonText';
import CauseofLearning from '../components/CasueofLearning';
import OnBoardingBackgroundDesign from '../components/OnBaordingBackgroundDesign';
import {useSelector} from 'react-redux';
import {makeApiRequest} from '../Axios/ApiRequests';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetch} from '@react-native-community/netinfo';
import InternetConnection from '../components/InternetConnection';
function OnBoardingScreen6({navigation}) {
  const introData = useSelector(state => state.intro);
  const [laoding, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [netWorkState, setNetWorkState] = useState(true);

  const user_data = useSelector(state => state.user);
  const ReasonOfLearning = async () => {
    fetch()
      .then(async state => {
        setNetWorkState(state.isConnected);
        if (state.isConnected) {
          if (selected?.length > 0) {
            const data = {
              intro_question_option_id: selected,
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
              if (response?.success) {
                AsyncStorage.setItem(
                  'screen-navigation',
                  JSON.stringify({
                    onBoardinding: false,
                    onBoardingScreen: 'OnBoardingQuizStat',
                  }),
                ).then(() => {
                  navigation.navigate('OnBoardingQuizStat');
                });
              }
            } catch (error) {
              setLoading(false);
              Toast.show(error?.message);
            }
          } else {
            Toast.show('Tap to select atleast one!');
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
              <SecondaryHeading text={introData?.data?.data[2]?.title} />
            </View>

            <View
              style={{
                marginVertical: 40,
              }}>
              {introData?.data?.data &&
                introData?.data?.data[2]?.options?.map((item, index) => {
                  return (
                    <View key={index}>
                      <CauseofLearning
                        buttonText={item?.title}
                        image={item?.icon}
                        item={item?.id}
                        setSelected={setSelected}
                        selected={selected}
                      />
                    </View>
                  );
                })}
            </View>
          </ScrollView>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              ReasonOfLearning();
            }}>
            <View style={styles.buttonContainer}>
              {laoding ? (
                <ActivityIndicator color={Colors.White} animating={laoding} />
              ) : (
                <ButtonText text={'Continue'} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <OnBoardingBackgroundDesign onBoardingNumber={6} />
    </View>
  );
}

export default OnBoardingScreen6;

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
    alignSelf: 'center',
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
