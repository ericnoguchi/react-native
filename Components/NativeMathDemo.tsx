import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  ScrollView,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

const { MyMath } = NativeModules;

export default function NativeMathDemo() {
  const isDarkMode = useColorScheme() === 'dark';
  const [result, setResult] = useState<number | null>(null);
  const [callbackResult, setCallbackResult] = useState<number | null>(null);
  const [eventResult, setEventResult] = useState<number | null>(null);

  useEffect(() => {
    MyMath.add(2, 4).then((res: number) => {
      setResult(res);
    });

    MyMath.addCallback(3, 5, (res: number) => {
      setCallbackResult(res);
    });

    const eventEmitter = new NativeEventEmitter(MyMath);
    const subscription = eventEmitter.addListener(
      'AddResultEvent',
      (res: number) => {
        setEventResult(res);
      },
    );

    MyMath.addEvents(6, 7);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#000' : '#fff' },
      ]}
    >
      <Text style={styles.header}>Native Module Result</Text>
      <Text style={styles.text}>
        add(2, 4): {result !== null ? result : 'Calculating...'}
      </Text>
      <Text style={styles.text}>
        addCallback(3, 5):{' '}
        {callbackResult !== null ? callbackResult : 'Calculating...'}
      </Text>
      <Text style={styles.text}>
        addEvents(6, 7):{' '}
        {eventResult !== null ? eventResult : 'Waiting for event...'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
  },
});
