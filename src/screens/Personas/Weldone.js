import React, {useState} from 'react';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Colors} from '../../constants/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PrimaryHeading from '../../components/PrimaryHeading';
import PrimaryButton from '../../components/PrimaryButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {makeApiRequest} from '../../Axios/ApiRequests';
import {setTestInitialState} from '../../../store/Tests';
import {setLearningInitialState} from '../../../store/Learnings';
import {useDispatch, useSelector} from 'react-redux';

import {userAppData} from '../../../store/UserDataSlice';
import {fetch} from '@react-native-community/netinfo';
import InternetConnection from '../../components/InternetConnection';
import Toast from 'react-native-simple-toast';
import {unitDataAction} from '../../../store/UnitData';

function Weldone({navigation, route}) {
  const insets = useSafeAreaInsets();
  const buttonText = route.params?.buttonText;
  const id = route.params?.id;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [netWorkState, setNetWorkState] = useState(true);
  const user_data = useSelector(state => state.user);
  const userLessonOrPersonaCompleted = async () => {
    fetch()
      .then(async state => {
        setNetWorkState(state.isConnected);
        if (state.isConnected) {
          const headers = {
            Authorization: `Bearer ${user_data?.data?.token}`,
          };
          if (buttonText === 'Unit') {
            const data = {
              lesson_id: id,
            };
            setLoading(true);
            try {
              const response = await makeApiRequest(
                'complete-lesson',
                'post',
                data,
                headers,
              );
              setLoading(false);
              if (response.success) {
                dispatch(
                  setTestInitialState({
                    testNo: 0,
                    progressBar: [],
                  }),
                );
                dispatch(
                  setLearningInitialState({
                    lessonNo: 0,
                    progressBar: [],
                  }),
                );
                dispatch(
                  unitDataAction({
                    endPoint: '/get-units',
                    method: 'get',
                    data: null,
                    headers: headers,
                  }),
                );
                dispatch(
                  userAppData({
                    endPoint: '/user',
                    method: 'post',
                    data: null,
                    headers: headers,
                  }),
                ).then(() => {
                  navigation.navigate('BottomTabBar');
                });
              }
            } catch (error) {
              setLoading(false);
              Toast.show(error.message);
            }
          } else {
            const data = {
              persona_id: id,
            };
            setLoading(true);
            try {
              const response = await makeApiRequest(
                'complete-persona',
                'post',
                data,
                headers,
              );
              setLoading(false);
              if (response?.success) {
                dispatch(
                  setTestInitialState({
                    testNo: 0,
                    progressBar: [],
                  }),
                );
                dispatch(
                  setLearningInitialState({
                    lessonNo: 0,
                    progressBar: [],
                  }),
                );
                dispatch(
                  userAppData({
                    endPoint: '/user',
                    method: 'post',
                    data: null,
                    headers: headers,
                  }),
                ).then(() => {
                  navigation.navigate('BottomTabBar');
                });
              }
            } catch (error) {
              setLoading(false);
              Toast.show(error.message);
            }
          }
        }
      })
      .catch(err => {
        console.warn('err', err);
      });
  };

  if (!netWorkState) {
    return <InternetConnection setNetWorkState={setNetWorkState} />;
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 0.3,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <PrimaryHeading text={'Well done!'} color={Colors.primaryColor} />
      </View>
      <View
        style={{
          flex: 0.6,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={require('../../assets/Weldone.png')} />
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          alignSelf: 'center',
          flex: 0.1,
          marginBottom: Platform.OS === 'ios' ? insets.bottom + 16 : 32,
        }}>
        <View style={{}}>
          <TouchableOpacity
            onPress={() => {
              userLessonOrPersonaCompleted();
            }}>
            <PrimaryButton text={`Back to ${buttonText}`} loading={loading} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default Weldone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: Colors.White,
  },
});
