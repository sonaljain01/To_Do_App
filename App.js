
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import ToDoScreen from './src/screen/ToDoScreen';

export default function App() {
  return (
    <SafeAreaView>
    <View>
      <ToDoScreen />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
