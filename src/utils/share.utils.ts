import { Share } from "react-native";

export const onShare = async () => {
  try {
    const result = await Share.share({
      url: "https://or.fr/",
    });
  } catch (error) {
    alert(error.message);
  }
};

export const publicationShare = async (url, message) => {
  try {
    const result = await Share.share({
      message,
      url: url,
    });
  } catch (error) {
    alert("Sorry, you can't share this article");
  }
};
