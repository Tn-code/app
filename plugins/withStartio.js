const { withAndroidManifest, withIosInfoPlist, withAppBuildGradle, withPodfile } = require('expo-config-plugins');

// Plugin Android
const withStartioAndroid = (config) => {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults;

    // Ajouter les permissions
    const permissions = [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION'
    ];

    const mainApplication = manifest.manifest.application[0];
    const metaData = {
      $: {
        'android:name': 'startio.appId',
        'android:value': '207363502'
      }
    };

    // Ajouter meta-data
    if (!mainApplication['meta-data']) {
      mainApplication['meta-data'] = [];
    }
    mainApplication['meta-data'].push(metaData);

    return config;
  });
};

// Plugin iOS
const withStartioIos = (config) => {
  return withIosInfoPlist(config, async (config) => {
    const plist = config.modResults;
    // Ajouter NSUserTrackingUsageDescription
    plist.NSUserTrackingUsageDescription =
      'Cette application utilise des publicités personnalisées.';
    return config;
  });
};

// Plugin principal
const withStartio = (config) => {
  config = withStartioAndroid(config);
  config = withStartioIos(config);
  return config;
};

module.exports = withStartio;
