import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native';
import {Colors} from '../../constants/Colors';
import SecondaryHeading from '../../components/SecondaryHeading';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/Header';
import CheckedLesson from '../../components/CheckedLesson';
import UncheckedLesson from '../../components/UncheckedLesson';
import DisabledCheckbox from '../../components/DisabledCheckbox';
import {useDispatch, useSelector} from 'react-redux';
import {lessonsData, setLearningInitialState} from '../../../store/Learnings';
import {setTestInitialState, testsData} from '../../../store/Tests';
import {fetch} from '@react-native-community/netinfo';
import InternetConnection from '../../components/InternetConnection';
import {checkCompletedType} from '../../../store/util/GlobalFunctions/CompletedLessonType';

function EmotionUnit({route, navigation}) {
  const [textWidth, setTextWidth] = useState([]);
  const [netWorkState, setNetWorkState] = useState(true);
  const [loadingId, setLoadingId] = useState();
  const user_data = useSelector(state => state.user);
  const learnings = useSelector(state => state.learnings);
  const {isLaoding} = useSelector(state => state.tests);
  const {data} = useSelector(state => state.userAppData);
  const unitData = useSelector(state => state.unitData);

  const dispatch = useDispatch();

  const Title = route.params?.Title;
  const Color = route.params?.Color;
  const sections = route.params?.sections;
  const unitId = route.params?.unitId;

  const onTextLayout = event => {
    const {width} = event.nativeEvent.layout;
    setTextWidth(prev => [...prev, width]);
  };

  const getLessonlearnings = id => {
    const headers = {
      Authorization: `Bearer ${user_data.data.token}`,
    };

    fetch()
      .then(state => {
        setNetWorkState(state.isConnected);
        if (state.isConnected) {
          dispatch(
            setLearningInitialState({
              lessonNo: 0,
              progressBar: [],
            }),
          );
          dispatch(
            setTestInitialState({
              testNo: 0,
              progressBar: [],
            }),
          );
          dispatch(
            lessonsData({
              endPoint: `/get-lesson-learnings?lesson_id=${id}`,
              method: 'get',
              data: null,
              headers: headers,
            }),
          );
          dispatch(
            testsData({
              endPoint: `/get-unit-test-questions?lesson_id=${id}`,
              method: 'get',
              data: null,
              headers: headers,
            }),
          ).then(() => {
            setTimeout(() => {
              navigation.navigate('Learning', {
                navigateTo: 'Unit',
                buttonText: 'Unit',
                lessonOrPeronaId: id,
                Title: route.params?.Title,
                Color: route.params?.Color,
                sections: route.params?.sections,
                unitId: route.params?.unitId,
              });
            }, 500);
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
      <Header backgroundColor={Color} heading={Title} />
      <FlatList
        overScrollMode="never"
        data={sections}
        keyExtractor={item => {
          return item.id;
        }}
        renderItem={({item, index}) => {
          return (
            <View key={index}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  marginVertical: 16,
                }}>
                <View
                  style={{
                    backgroundColor: '#F3F3FF',
                    height: 1.5,
                    flex: 1,
                    marginRight: 8,
                  }}></View>
                <View
                  style={{
                    width: '58%',
                  }}>
                  <SecondaryHeading
                    text={item.title}
                    textAlign={'center'}
                    font={20}
                    onLayout={onTextLayout}
                    fontFamily={'Outfit-SemiBold'}
                    lineHeight={28}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: '#F3F3FF',
                    height: 1.5,
                    flex: 1,
                    marginLeft: 8,
                  }}></View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  width: '100%',
                }}>
                <View
                  style={{
                    marginHorizontal: 12,
                  }}>
                  {item.lessons.map((i, ind) => {
                    return (
                      <View
                        key={ind}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {ind === 0 && (
                          <View
                            style={{
                              height: 28,
                              backgroundColor: Colors.White,
                              width: 2.2,
                              borderRadius: 8,
                            }}></View>
                        )}
                        {ind !== 0 && (
                          <View
                            style={{
                              height: 56,
                              backgroundColor: checkCompletedType(
                                unitData.data.data[unitId].completed_lesson_ids,
                              )?.includes(i.id)
                                ? Colors.Green
                                : Colors.disabled,
                              width: 2.2,
                              borderRadius: 8,
                            }}></View>
                        )}
                        <View
                          style={{
                            marginVertical: 6,
                          }}>
                          <DisabledCheckbox id={i.id} unitId={unitId} />
                        </View>
                      </View>
                    );
                  })}
                </View>
                <View>
                  {item.lessons.map((item, ind) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={
                          item.is_premium == 1 && data.is_pro_user == 0
                            ? true
                            : false
                        }
                        key={ind}
                        onPress={() => {
                          getLessonlearnings(item.id);
                          setLoadingId(item.id);
                        }}>
                        {checkCompletedType(
                          unitData.data.data[unitId].completed_lesson_ids,
                        )?.includes(item.id) ? (
                          <CheckedLesson
                            lessonName={item.title}
                            color={Color}
                            locked={true}
                            isLaoding={isLaoding && learnings.isLaoding}
                            id={item.id}
                            loadingId={loadingId}
                          />
                        ) : (
                          <UncheckedLesson
                            lessonName={item.title}
                            color={Color}
                            locked={
                              item.is_premium == 1 && data.is_pro_user == 0
                                ? true
                                : false
                            }
                            disabledColor={`${Color}59`}
                            isLaoding={isLaoding && learnings.isLaoding}
                            id={item.id}
                            loadingId={loadingId}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

export default EmotionUnit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: Colors.White,
  },
});
