import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Unit from '../../components/Unit';
import {Colors} from '../../constants/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../components/Loader';
import {unitDataAction} from '../../../store/UnitData';
import {fetch} from '@react-native-community/netinfo';
import InternetConnection from '../../components/InternetConnection';
import {checkCompletedType} from '../../../store/util/GlobalFunctions/CompletedLessonType';

function MainScreen({navigation}) {
  const user_data = useSelector(state => state.user);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const {data, isLaoding} = useSelector(state => state.unitData);
  const [netWorkState, setNetWorkState] = useState(true);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${user_data.data.token}`,
    };
    fetch()
      .then(state => {
        setNetWorkState(state.isConnected);
        if (state.isConnected) {
          dispatch(
            unitDataAction({
              endPoint: '/get-units',
              method: 'get',
              data: null,
              headers: headers,
            }),
          );
        }
      })
      .catch(err => {
        console.log('error=========', err);
      });
  }, [netWorkState]);

  if (!netWorkState) {
    return <InternetConnection setNetWorkState={setNetWorkState} />;
  }

  return (
    <>
      {isLaoding ? (
        <Loader state={isLaoding} />
      ) : (
        <View style={styles.container}>
          <ScrollView overScrollMode="never">
            <View
              style={{
                width: '92%',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  marginTop: Platform.OS === 'ios' ? insets.top + 12 : 18,
                  marginBottom: 12,
                }}>
                <Text
                  style={{
                    color: Colors.dark,
                    fontSize: 24,
                    fontFamily: 'Outfit-Bold',
                  }}>
                  Units
                </Text>
              </View>
            </View>
            {data?.data &&
              data.data?.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => {
                      navigation.navigate('Unit', {
                        Title: item.unit.title,
                        Color: item.unit.background,
                        sections: item.unit.sections,
                        unitId: index,
                      });
                    }}>
                    <Unit
                      heading={item.unit.title}
                      backgroundColor={item.unit.background}
                      sections={item.unit.sections?.length}
                      tests={item.test_ids?.length}
                      totalLesson={item.lesson_ids?.length}
                      completedLessons={
                        checkCompletedType(item.completed_lesson_ids)?.length
                      }
                      index={index}
                    />
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
      )}
    </>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: Colors.White,
  },
});
