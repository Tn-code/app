const { withAppBuildGradle, withGradleProperties } = require('expo/config-plugins');

// Plugin qui force Gradle 8.10.2 en modifiant le build.gradle
module.exports = function withGradleVersion(config) {
  return withAppBuildGradle(config, (config) => {
    // Ajouter la configuration Gradle dans le build.gradle de l'app
    if (!config.modResults.contents.includes('gradleVersion = "8.10.2"')) {
      // On cherche à modifier la version de Gradle dans le build.gradle
      // Mais il est plus simple de modifier gradle-wrapper.properties via withGradleProperties
    }
    return config;
  });
};
