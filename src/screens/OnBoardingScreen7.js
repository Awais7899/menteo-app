import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../constants/Colors';
import Correct from '../components/Modals/Correct';
import OnBoardingBackgroundDesign from '../components/OnBaordingBackgroundDesign';
import DisplayContainer from '../components/QuizContainer';
import {useSelector} from 'react-redux';
import Wrong from '../components/Modals/Wrong';

function OnBoardingScreen7() {
  const [result, setResult] = useState(false);
  const [select, setSelect] = useState('');
  const {data, questionNo} = useSelector(state => state.quiz);

  const questionOptions = data?.data[questionNo]?.options;
  const getSelectedOption = questionOptions?.filter(
    item => item?.id === select,
  );
  const handleSelection = selected => {
    setSelect(selected);
  };
  const rightOption = questionOptions?.filter(
    obj => obj?.hasOwnProperty('is_correct') && obj?.is_correct == 1,
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}>
        <DisplayContainer
          handleSelection={handleSelection}
          select={select}
          setResult={setResult}
        />
      </View>
      <OnBoardingBackgroundDesign onBoardingNumber={7 + questionNo + 1} />
      {getSelectedOption?.length > 0 &&
      getSelectedOption[0]?.is_correct == 0 ? (
        <Wrong
          isModalVisible={result}
          setModalVisible={setResult}
          rightOption={rightOption}
          setSelect={setSelect}
        />
      ) : (
        <Correct
          isModalVisible={result}
          setModalVisible={setResult}
          setSelect={setSelect}
        />
      )}
    </View>
  );
}

export default OnBoardingScreen7;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
