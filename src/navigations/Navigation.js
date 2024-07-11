import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBoardingScreen1 from '../screens/OnBoardingScreen1';
// import OnBoardingScreen1 from '../screens/onboarding/new-onboarding1';
import OnBoardingScreen2 from '../screens/OnBoardingScreen2';
import OnBoardingScreen3 from '../screens/OnBoardingScreen3';
import OnBoardingScreen4 from '../screens/OnBoardingScreen4';
import OnBoardingScreen5 from '../screens/OnBoardingScreen5';
import OnBoardingScreen6 from '../screens/OnBoardingScreen6';
import OnBoardingScreen7 from '../screens/OnBoardingScreen7';
import OnBoardingScreen23 from '../screens/OnBoardingScreen23';
import Subscription from '../screens/Subscription';
import ThanksForJoining from '../screens/ThanksForJoining';
import BottomTabBar from './BottomTabBar';
import EmotionUnit from '../screens/Units/EmotionUnit';
import Weldone from '../screens/Personas/Weldone';
import PlainTest from '../screens/Tests/TestScreen';
import {useSelector} from 'react-redux';
import OnBoardingQuizStat from '../screens/OnBoardingQuizStat';
import Learning from '../screens/Learnings/LearningScreen';
const Stack = createNativeStackNavigator();
function NavigationStack() {
  const {data} = useSelector(state => state.navigation);
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
      initialRouteName={data?.onBoardingScreen}>
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="OnBoardingScreen1"
        component={OnBoardingScreen1}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="OnBoardingScreen2"
        component={OnBoardingScreen2}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="OnBoardingScreen3"
        component={OnBoardingScreen3}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="OnBoardingScreen4"
        component={OnBoardingScreen4}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="OnBoardingScreen5"
        component={OnBoardingScreen5}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="OnBoardingScreen6"
        component={OnBoardingScreen6}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="OnBoardingQuizStat"
        component={OnBoardingQuizStat}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="OnBoardingScreen7"
        component={OnBoardingScreen7}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="OnBoardingScreen23"
        component={OnBoardingScreen23}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="Subscription"
        component={Subscription}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="ThanksForJoining"
        component={ThanksForJoining}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="BottomTabBar"
        component={BottomTabBar}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="Unit"
        component={EmotionUnit}
      />

      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="Weldone"
        component={Weldone}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="Learning"
        component={Learning}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="TestScreen"
        component={PlainTest}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <NavigationStack />
    </NavigationContainer>
  );
}
export default Navigation;
