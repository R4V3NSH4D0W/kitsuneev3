import axios from 'axios';

const GITHUB_API_URL =
  'https://api.github.com/repos/R4V3NSH4D0W/kitsuneev3/releases/latest';

export const checkForUpdate = async (currentVersion: string) => {
  try {
    const response = await axios.get(GITHUB_API_URL);
    const releaseInfo = response.data;

    const latestVersion = releaseInfo.tag_name;
    const downloadUrl = releaseInfo.assets[0].browser_download_url;
    const releaseNotes = releaseInfo.body;

    if (currentVersion !== latestVersion) {
      return {
        isUpdateAvailable: true,
        latestVersion,
        downloadUrl,
        releaseNotes,
      };
    }
    return {
      isUpdateAvailable: false,
      latestVersion: currentVersion,
      downloadUrl: '',
      releaseNotes: '',
    };
  } catch (error) {
    console.error('Error fetching update info:', error);
    return {
      isUpdateAvailable: false,
      latestVersion: currentVersion,
      downloadUrl: '',
      releaseNotes: '',
    };
  }
};
