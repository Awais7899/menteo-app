import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../constants/Colors';
import SecondaryHeading from './SecondaryHeading';
import ButtonText from './ButtonText';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {lessonsData, setLearningInitialState} from '../../store/Learnings';
import {setTestInitialState, testsData} from '../../store/Tests';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {fetch} from '@react-native-community/netinfo';
import DesciptionText from './DescriptionText';
import RightArrow from '../assets/arrow-right.svg';
import Lock from '../assets/lock.svg';
import FastImage from 'react-native-fast-image';
import {FILE_URL} from '@env';
function Persona({
  name,
  profession,
  image,
  locked,
  id,
  setLoadingId,
  loadingId,
  setNetWorkState,
}) {
  const [fileState, setFileState] = useState(true);
  const learnings = useSelector(state => state.learnings);
  const {isLaoding} = useSelector(state => state.tests);
  const user_data = useSelector(state => state.user);
  const {data} = useSelector(state => state.userAppData);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const completed = data?.completed_persona_ids?.includes(id);
  const getPersonaLearnngsAndTests = () => {
    fetch()
      .then(async state => {
        setNetWorkState(state.isConnected);
        if (state.isConnected) {
          setLoadingId(id);
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
          const headers = {
            Authorization: `Bearer ${user_data?.data?.token}`,
          };
          dispatch(
            lessonsData({
              endPoint: `/get-persona-learnings?persona_id=${id}`,
              method: 'get',
              data: null,
              headers: headers,
            }),
          );
          dispatch(
            testsData({
              endPoint: `/get-persona-test-questions?persona_id=${id}`,
              method: 'get',
              data: null,
              headers: headers,
            }),
          ).then(() => {
            setTimeout(() => {
              navigation.navigate('Learning', {
                lessonOrPeronaId: id,
                buttonText: 'Persona List',
                navigateTo: 'BottomTabBar',
              });
            }, 500);
          });
        }
      })
      .catch(err => {
        console.warn('error', err);
      });
  };

  return (
    <View style={[styles.container]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'scace-between',
          alignSelf: 'center',
          paddingHorizontal: 12,
          flex: 1,
        }}>
        <View
          style={{
            flex: 0.4,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: locked ? 0.4 : 1,
          }}>
          {/* {fileState && Platform.OS === 'android' && (
            <SkeletonPlaceholder borderRadius={6}>
              <SkeletonPlaceholder.Item width={115} height={115} />
            </SkeletonPlaceholder>
          )} */}
          <FastImage
            source={{
              uri: `${FILE_URL}${image}`,
              priority: FastImage.priority.high,
            }}
            style={{
              width: 115,
              height: 115,
              borderRadius: 6,
              // display: fileState && Platform.OS === 'android' ? 'none' : 'flex',
            }}
            resizeMode="cover"
            // onLoadStart={() => {
            //   setFileState(true);
            //   console.log('start');
            // }}
            // onLoadEnd={() => {
            //   setFileState(false);
            //   console.log('end');
            // }}
            // onError={() => {
            //   setFileState(false);
            //   console.log('ERROR');
            // }}
          />
        </View>
        <View
          style={{
            flex: 0.5,
            marginVertical: 12,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginHorizontal: 14,

            opacity: locked ? 0.4 : 1,
          }}>
          <View
            style={{
              alignItems: 'flex-start',
              paddingLeft: 4,
            }}>
            <SecondaryHeading
              text={name}
              font={18}
              color={Colors.primaryColor}
              lineHeight={26}
              fontFamily={'Outfit-SemiBold'}
            />
            <DesciptionText
              text={profession}
              color={'#78749C'}
              lineHeight={18}
            />
          </View>

          {completed && (
            <View
              style={{
                backgroundColor: Colors.Green,
                paddingHorizontal: 6,
                paddingVertical: 1,
                borderRadius: 24,
                alignItems: 'flex-start',
                marginLeft: 2,
              }}>
              <ButtonText
                text={'Completed'}
                fontFamily={'Outfit-Regular'}
                font={12}
              />
            </View>
          )}
        </View>
        <TouchableOpacity
          disabled={locked ? true : false}
          onPress={() => {
            getPersonaLearnngsAndTests();
          }}
          style={{
            flex: 0.2,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          {locked ? (
            <Lock style={{color: Colors.primaryColor}} />
          ) : (
            <>
              {isLaoding && learnings?.isLaoding && loadingId == id ? (
                <ActivityIndicator
                  color={Colors.primaryColor}
                  animating={isLaoding && learnings?.isLaoding}
                />
              ) : (
                <RightArrow
                  style={{
                    color: Colors.primaryColor,
                  }}
                />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Persona;

const styles = StyleSheet.create({
  container: {
    width: '92%',
    borderRadius: 10,
    height: 140,
    marginVertical: 5,
    alignSelf: 'center',
    backgroundColor: Colors.buttonColor,
  },
});
