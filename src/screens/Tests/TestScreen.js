import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors} from '../../constants/Colors';
import SecondaryHeading from '../../components/SecondaryHeading';
import SegmentedProgressBar from '../../components/SegmentedProgressBar';
import PrimaryButton from '../../components/PrimaryButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import LeaveLesson from '../../components/Modals/LeaveLesson';
import QuizQuestion from '../../components/QuizQuestion';
import {FILE_URL} from '@env';
import Video from 'react-native-video';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Toast from 'react-native-simple-toast';
import TestWrong from '../../components/Modals/TestWrong';
import TestCorrect from '../../components/Modals/TestCorrect';
import InternetConnection from '../../components/InternetConnection';
import FastImage from 'react-native-fast-image';
function PlainTest({route}) {
  const insets = useSafeAreaInsets();
  const [fileState, setFileState] = useState(true);
  const [progressViewWith, setProgressViewWidth] = useState(0);
  const [netWorkState, setNetWorkState] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);
  const [select, setSelect] = useState('');
  const {data, testNo, testsProgressBar} = useSelector(state => state.tests);
  const tests = data?.data;
  const questionOptions = data?.data[testNo]?.options;
  const rightOption = questionOptions?.filter(
    obj => obj?.hasOwnProperty('is_correct') && obj?.is_correct == 1,
  );

  const checkFileType = type => {
    const fileType = type?.split('/')[0];
    return fileType;
  };
  const getSelectedOption = questionOptions?.filter(
    item => item?.id === select,
  );

  const handleSelection = selected => {
    setSelect(selected);
  };

  // const SubmitAwnser = async () => {
  //   fetch()
  //     .then(async state => {
  //       setNetWorkState(state.isConnected);
  //       if (select && state.isConnected) {
  //         const data = {
  //           test_option_id: select,
  //         };
  //         const headers = {
  //           Authorization: `Bearer ${user_data?.data?.token}`,
  //         };
  //         setLoading(true);
  //         try {
  //           const response = await makeApiRequest(
  //             'save-test-answer',
  //             'post',
  //             data,
  //             headers,
  //           );
  //           setLoading(false);
  //           if (response?.success) {
  //             setResult(true);
  //           }
  //         } catch (error) {
  //           setLoading(false);
  //           Toast.show(error?.message);
  //         }
  //       } else {
  //         Toast.show('Tap to select one of them!');
  //       }
  //     })
  //     .catch(err => {
  //       console.log('error', err);
  //     });
  // };

  if (!netWorkState) {
    return <InternetConnection setNetWorkState={setNetWorkState} />;
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          overScrollMode="never"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              // flex: 0.15,
              marginTop: Platform.OS === 'ios' ? insets.top + 20 : 30,
              width: '95%',
            }}
            onLayout={e => {
              setProgressViewWidth(e?.nativeEvent?.layout?.width);
            }}>
            {tests?.length > 0 && (
              <SegmentedProgressBar
                progressd={testsProgressBar}
                learnings={tests}
                width={progressViewWith}
                setResult={setModalOpen}
              />
            )}
            <View
              style={{
                alignSelf: 'center',
                width: '92%',
                marginTop: 32,
              }}>
              {data.data && (
                <SecondaryHeading
                  text={data?.data[testNo]?.title}
                  font={23}
                  lineHeight={27}
                  fontFamily={'Outfit-Medium'}
                />
              )}
            </View>
          </View>

          {data?.data[testNo]?.file && (
            <View
              style={{
                alignSelf: 'center',
                marginVertical: 8,
              }}>
              {checkFileType(data?.data[testNo]?.file_type) === 'image' ? (
                <>
                  <FastImage
                    source={{uri: `${FILE_URL}${data?.data[testNo]?.file}`}}
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
                    source={{uri: `${FILE_URL}${data?.data[testNo]?.file}`}}
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
          )}

          <View
            style={{
              marginTop: 18,
              marginBottom: 40,
              justifyContent: 'flex-end',
            }}>
            {data?.data &&
              data?.data[testNo]?.options &&
              data?.data[testNo]?.options?.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      handleSelection(item.id);
                    }}>
                    <QuizQuestion
                      buttonText={item.title}
                      selected={select}
                      itemId={item.id}
                    />
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>
        <View
          style={{
            // flex: 0.1,
            justifyContent: 'flex-end',
            marginBottom: Platform.OS === 'ios' ? insets.bottom + 8 : 24,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (select) {
                setResult(true);
              } else {
                Toast.show('Tap to select one of them!');
              }
            }}>
            <PrimaryButton text={'Check'} width={wp('92%')} loading={loading} />
          </TouchableOpacity>
        </View>
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
      {getSelectedOption?.length > 0 &&
      getSelectedOption[0]?.is_correct == 0 ? (
        <TestWrong
          isModalVisible={result}
          setModalVisible={setResult}
          rightOption={rightOption}
          lessonOrPeronaId={route.params?.lessonOrPeronaId}
          buttonText={route.params?.buttonText}
          setSelect={setSelect}
        />
      ) : (
        <TestCorrect
          isModalVisible={result}
          setModalVisible={setResult}
          lessonOrPeronaId={route.params?.lessonOrPeronaId}
          buttonText={route.params?.buttonText}
          setSelect={setSelect}
        />
      )}
    </>
  );
}

export default PlainTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
});
