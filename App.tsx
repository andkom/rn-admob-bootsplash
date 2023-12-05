import React, {useCallback, useEffect, useState} from 'react';
import {Text} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import mobileAds, {
  MaxAdContentRating,
  useAppOpenAd,
} from 'react-native-google-mobile-ads';

mobileAds()
  .setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.PG,
    tagForChildDirectedTreatment: true,
    tagForUnderAgeOfConsent: true,
    testDeviceIdentifiers: ['EMULATOR'],
  })
  .then(() => {
    // Request config successfully set!
  });

function App() {
  const [splashHidden, setSplashHidden] = useState(false);
  const {load, isLoaded, error, show, isClicked, isClosed} = useAppOpenAd(
    'ca-app-pub-3940256099942544/9257395921',
  );

  const hideSplash = useCallback(async () => {
    await BootSplash.hide({fade: true});
    setSplashHidden(true);
  }, []);

  useEffect(() => {
    load();
    console.log('Start loading ad');
  }, [load]);

  useEffect(() => {
    if (isLoaded && !splashHidden) {
      show();
      console.log('Ad shown!');
    }
  }, [isLoaded, splashHidden, show]);

  useEffect(() => {
    (async () => {
      if (isClosed || isClicked) {
        await hideSplash();
        console.log('Splash hidden because ad is closed or clicked!');
      }
    })();
  }, [isClosed, isClicked, hideSplash]);

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('Init complete!');
    };

    init().finally(async () => {
      if (!isLoaded || error) {
        await hideSplash();
        console.log('Splash hidden because ad is not loaded or error!');
      }
    });
  }, [hideSplash]);

  return <Text>My awesome app</Text>;
}

export default App;
