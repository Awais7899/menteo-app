import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors} from '../../constants/Colors';
import PrimaryButton from '../../components/PrimaryButton';
import SegmentedProgressBar from '../../components/SegmentedProgressBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import SecondaryHeading from '../../components/SecondaryHeading';
import {FILE_URL} from '@env';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';

import {
  updateLearning,
  updateLearningProgressBar,
} from '../../../store/Learnings';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LeaveLesson from '../../components/Modals/LeaveLesson';
function Learning({navigation, route}) {
  const [fileState, setFileState] = useState(true);
  const [progressViewWith, setProgressViewWidth] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {data, lessonNo, learningProgressBar} = useSelector(
    state => state.learnings,
  );
  const learnings = data.data;
  const insets = useSafeAreaInsets();

  const checkFileType = type => {
    const fileType = type.split('/')[0];
    return fileType;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        overScrollMode="never"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flex: 0.1,
            marginTop: Platform.OS === 'ios' ? insets.top + 20 : 30,
            width: '95%',
          }}
          onLayout={e => {
            setProgressViewWidth(e.nativeEvent.layout.width);
          }}>
          <SegmentedProgressBar
            progressd={learningProgressBar}
            learnings={learnings}
            width={progressViewWith}
            setResult={setModalOpen}
          />
        </View>
        {data?.data &&
          data?.data[lessonNo]?.title == null &&
          data?.data[lessonNo]?.description == null &&
          data?.data[lessonNo]?.file && (
            <View style={styles.bigImageContainer}>
              <Image
                source={require('../../assets/test_image.png')}
                style={{
                  flex: 1,
                  width: '100%',
                  // resizeMode: 'cover',
                }}
              />
            </View>
          )}
        {data?.data &&
          data?.data[lessonNo]?.title &&
          data?.data[lessonNo]?.description &&
          data?.data[lessonNo]?.file == null && (
            <View
              style={{
                width: '92%',
                alignSelf: 'center',
                flex: 0.8,
              }}>
              <SecondaryHeading
                text={data?.data[lessonNo]?.title}
                font={27}
                fontFamily={'Outfit-SemiBold'}
              />

              <View
                style={{
                  marginVertical: 18,
                }}>
                <Text
                  style={{
                    color: '#78749C',
                    fontSize: 16,
                    letterSpacing: 1,
                    lineHeight: 28,
                    fontFamily: 'Outfit-Regular',
                  }}>
                  {data?.data[lessonNo]?.description}
                </Text>
              </View>
            </View>
          )}
        {data?.data &&
          data?.data[lessonNo]?.title == null &&
          data?.data[lessonNo]?.description &&
          data?.data[lessonNo]?.file && (
            <View
              style={{
                width: '92%',
                alignSelf: 'center',
                flex: 0.9,
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  overflow: 'hidden',
                  borderRadius: 24,
                }}>
                {checkFileType(data?.data[lessonNo]?.file_type) === 'image' ? (
                  <>
                    <FastImage
                      source={{uri: `${FILE_URL}${data?.data[lessonNo]?.file}`}}
                      style={{
                        width: wp('90%'),
                        height: 220,
                        borderRadius: 16,
                      }}
                      resizeMode="cover"
                    />
                  </>
                ) : (
                  <>
                    {fileState && (
                      <SkeletonPlaceholder borderRadius={16}>
                        <SkeletonPlaceholder.Item
                          width={wp('90%')}
                          height={220}
                        />
                      </SkeletonPlaceholder>
                    )}
                    <Video
                      source={{uri: `${FILE_URL}${data?.data[lessonNo]?.file}`}}
                      style={{
                        width: wp('90%'),
                        height: 220,
                        borderRadius: 16,
                        display: fileState ? 'none' : 'flex',
                      }}
                      resizeMode="cover"
                      repeat={true}
                      controls={false}
                      onLoadStart={() => {
                        setFileState(true);
                      }}
                      onLoad={() => {
                        setFileState(false);
                      }}
                    />
                  </>
                )}
              </View>
              <View
                style={{
                  marginVertical: 16,
                }}>
                <Text
                  style={{
                    color: '#78749C',
                    fontSize: 16,
                    fontFamily: 'Outfit-Regular',
                    letterSpacing: 0.7,
                    lineHeight: 28,
                  }}>
                  {data?.data[lessonNo]?.description}
                </Text>
              </View>
            </View>
          )}
        <View
          style={{
            flex: 0.1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            alignSelf: 'center',
            marginBottom: Platform.OS === 'ios' ? insets.bottom + 8 : 24,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (lessonNo + 1 >= data.data.length) {
                dispatch(updateLearningProgressBar(1));
                navigation.navigate('TestScreen', {
                  lessonOrPeronaId: route.params.lessonOrPeronaId,
                  buttonText: route.params.buttonText,
                  navigateTo: route.params?.navigateTo,
                  Title: route.params?.Title,
                  Color: route.params?.Color,
                  sections: route.params?.sections,
                  unitId: route.params?.unitId,
                });
              } else {
                dispatch(updateLearning(lessonNo));
                dispatch(updateLearningProgressBar(1));
              }
            }}>
            <PrimaryButton text={'Next'} width={wp('92%')} loading={loading} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LeaveLesson
        isModalVisible={modalOpen}
        setModalVisible={setModalOpen}
        navigateTo={route.params?.navigateTo}
        Title={route.params?.Title}
        Color={route.params?.Color}
        sections={route.params?.sections}
        unitId={route.params?.unitId}
      />
    </View>
  );
}

export default Learning;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    height: hp('100%'),
    justifyContent: 'space-between',
  },
  bigImageContainer: {
    width: '92%',
    height: '80%',
    borderRadius: 24,
    alignSelf: 'center',
    flex: 0.8,
  },
});

// if (!netWorkState) {
//   return <InternetConnection setNetWorkState={setNetWorkState} />;
// }

// const saveUserLearning = async () => {
//   fetch()
//     .then(async state => {
//       setNetWorkState(state.isConnected);
//       if (state.isConnected) {
//         const lessonIdData = {
//           learning_id: data.data[lessonNo].id,
//         };
//         const headers = {
//           Authorization: `Bearer ${user_data.data.token}`,
//         };
//         setLoading(true);
//         try {
//           const response = await makeApiRequest(
//             'save-user-learning',
//             'post',
//             lessonIdData,
//             headers,
//           );
//           setLoading(false);
//           if (response.success) {
//             if (lessonNo + 1 >= data.data.length) {
//               dispatch(updateLearningProgressBar(1));
//               const headers = {
//                 Authorization: `Bearer ${user_data.data.token}`,
//               };
//               setTimeout(() => {
//                 navigation.navigate('TestScreen', {
//                   lessonOrPeronaId: route.params.lessonOrPeronaId,
//                   buttonText: route.params.buttonText,
//                 });
//               }, 500);
//             } else {
//               dispatch(updateLearning(lessonNo));
//               dispatch(updateLearningProgressBar(1));
//             }
//           }
//         } catch (error) {
//           setLoading(false);
//           Toast.show(error.message);
//         }
//       }
//     })
//     .catch(err => {
//       console.log('error', err);
//     });
// };

{
  /* <View
                style={{
                  marginHorizontal: 18,
                  width: '80%',
                  flex: 0.25,
                }}>
                <PrimaryHeading
                  text={data.data[lessonNo]?.title}
                  color={Colors.dark}
                />
              </View> */
}
{
  /* <View
                style={{
                  justifyContent: 'space-around',
                  flex: 0.5,
                }}>
                <View
                  style={{
                    margin: 18,
                    width: '65%',
                  }}>
                  <Text
                    style={{
                      color: Colors.dark,
                      fontSize: 18,
                      fontFamily: 'Outfit-Medium',
                      letterSpacing: 1,
                      lineHeight: 24,
                    }}>
                    {
                      getStringBeforeAndAfterLastSpace(
                        data?.data[lessonNo]?.description,
                      ).beforeLastSpace
                    }
                  </Text>
                  <View
                    style={{
                      position: 'relative',
                    }}>
                    <View
                      style={{
                        position: 'absolute',
                      }}>
                      <Text
                        style={{
                          color: Colors.dark,
                          fontSize: 18,
                          fontFamily: 'Outfit-Bold',
                          letterSpacing: 1,
                          lineHeight: 28,

                          marginBottom: 1,
                        }}
                        onLayout={onTextLayout}>
                        {
                          getStringBeforeAndAfterLastSpace(
                            data?.data[lessonNo]?.description,
                          ).afterLastSpace
                        }
                      </Text>
                      <Svg height="20" width="100%">
                        <Path
                          d={`M0 ${textWidth / 10} Q${textWidth / 2 - 8} -${
                            textWidth / 28
                          }, ${textWidth - 2}  ${textWidth / 12}`}
                          fill="transparent"
                          stroke={Colors.primaryColor}
                          strokeWidth="2.5"
                        />
                      </Svg>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    alignSelf: 'flex-end',
                    margin: 18,
                    width: '70%',
                  }}>
                  <Text
                    style={{
                      color: Colors.dark,
                      fontSize: 18,
                      fontFamily: 'Outfit-Medium',
                      letterSpacing: 0.7,
                      lineHeight: 28,
                      textAlign: 'right',
                    }}>
                    {data.data[lessonNo].description2}
                  </Text>
                </View>
              </View> */
}

// const onTextLayout = event => {
//   const {width} = event.nativeEvent.layout;
//   setTextWidth(width);
// };
