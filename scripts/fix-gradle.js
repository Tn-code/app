const fs = require('fs');
const path = require('path');

const gradlePropsPath = path.join(__dirname, '..', 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties');
const targetUrl = 'https\\://services.gradle.org/distributions/gradle-8.13-bin.zip';

if (fs.existsSync(gradlePropsPath)) {
  let content = fs.readFileSync(gradlePropsPath, 'utf8');
  if (!content.includes('gradle-8.13-bin.zip')) {
    content = content.replace(
      /distributionUrl=.*/,
      `distributionUrl=${targetUrl}`
    );
    fs.writeFileSync(gradlePropsPath, content);
    console.log('✅ Gradle wrapper mis à jour vers 8.13');
  } else {
    console.log('✅ Gradle wrapper déjà sur 8.13');
  }
} else {
  console.log('⚠️ Fichier gradle-wrapper.properties non trouvé, ignoré.');
}
