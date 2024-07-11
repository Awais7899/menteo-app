import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {Colors} from '../../constants/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Persona from '../../components/Persona';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../components/Loader';

import {personDataAction} from '../../../store/PersonaData';
import {fetch} from '@react-native-community/netinfo';
import InternetConnection from '../../components/InternetConnection';
function Personas() {
  const user_data = useSelector(state => state.user);
  const {data} = useSelector(state => state.userAppData);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [loadingId, setLoadingId] = useState();
  const [netWorkState, setNetWorkState] = useState(true);
  const [onRequestNetWorkState, setOnRequestNetWorkState] = useState(true);

  const personaData = useSelector(state => state.personaData);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${user_data?.data?.token}`,
    };
    fetch()
      .then(state => {
        setNetWorkState(state.isConnected);
        if (state.isConnected) {
          dispatch(
            personDataAction({
              endPoint: '/get-personas',
              method: 'get',
              data: null,
              headers: headers,
            }),
          );
        }
      })
      .catch(err => {
        console.warn(err);
      });
  }, [netWorkState]);

  if (!netWorkState) {
    return <InternetConnection setNetWorkState={setNetWorkState} />;
  }

  if (!onRequestNetWorkState) {
    return <InternetConnection setNetWorkState={setOnRequestNetWorkState} />;
  }
  return (
    <>
      {personaData.isLaoding ? (
        <Loader state={personaData.isLaoding} />
      ) : (
        <View style={styles.container}>
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
                Celebs
              </Text>
            </View>
          </View>
          <FlatList
            overScrollMode="never"
            data={personaData.data.data}
            renderItem={({item, index}) => {
              return (
                <View index={index}>
                  <Persona
                    name={item.name}
                    image={item.avatar}
                    profession={item.profession}
                    locked={
                      item.is_premium == 1 && data.is_pro_user == 0
                        ? true
                        : false
                    }
                    id={item.id}
                    loadingId={loadingId}
                    setLoadingId={setLoadingId}
                    setNetWorkState={setOnRequestNetWorkState}
                  />
                </View>
              );
            }}
          />
        </View>
      )}
    </>
  );
}

export default Personas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: Colors.White,
  },
});

{
  /* <Persona
name={'Margot Robbie'}
image={require('../../assets/girl.png')}
profession={'Actress'}
/>
<Persona
name={'Donald Trump'}
image={require('../../assets/trump.png')}
profession={'Politician'}
/>
<Persona
name={'Helena Bonham Carter'}
image={require('../../assets/girl.png')}
profession={'Actress'}
/>
<View
style={{
  opacity: 0.5,
}}>
<Persona
  name={'Helena Bonham Carter'}
  image={require('../../assets/girl.png')}
  profession={'Actress'}
  locked={true}
/>
</View> */
}
