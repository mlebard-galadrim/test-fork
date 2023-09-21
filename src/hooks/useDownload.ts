import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import { Store } from "../store/configure.store";

const formatFileName = (fileName) => {
  return fileName.replace(/ /g, "-");
};

export const UseDownload = () => {
  const downloadFile = async (fileName, fileUrl) => {
    const state = Store.getState();
    const token = state.authStore.token;
    const isIos = Platform.OS === "ios";
    const outputDir = FileSystem.documentDirectory;
    const formattedFileName = formatFileName(fileName);

    const directoryInfo = await FileSystem.getInfoAsync(outputDir);
    if (!directoryInfo.exists) {
      await FileSystem.makeDirectoryAsync(outputDir, { intermediates: true });
    }

    FileSystem.downloadAsync(fileUrl, outputDir + formattedFileName, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async ({ uri }) => {
        if (isIos) {
          const UTI = "public.item";
          await Sharing.shareAsync(uri, { UTI });
        } else {
          // This entire section assumes you are downloading a PDF file, which is the only downloadable file type as of 21/08/23
          const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (!permissions.granted) {
            return;
          }
          try {
            const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, "application/pdf");

            const fileContent = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

            await FileSystem.StorageAccessFramework.writeAsStringAsync(newFileUri, fileContent, { encoding: "base64" });
          } catch (e) {
            console.warn(e);
          }
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  return { downloadFile };
};
