import { metalsConstant } from "../constants/metals.constant";
import { getBulletins } from "../services/bulletins.service";
import { getPostsCollection } from "../services/posts.service";
import { getProductCollection } from "../services/products.service";
import { getCurrentSpotPrice } from "../services/spot-prices.service";
import { getVideos } from "../services/videos.service";
import { Store } from "../store/configure.store";
import BulletinsSlice from "../store/slices/bulletin.slice";
import DataSlice from "../store/slices/data.slice";
import PublicationsSlice from "../store/slices/publication.slice";
import { getTags } from "./../services/posts.service";
import { getCurrencies } from "./../services/static/currencies.service";
import { getCollectionLocales } from "./../services/static/locales.service";
import { getUserCollection } from "./../services/users.service";

export const loadBulletins = async (page: number = 1, limit: number = 3) => {
  const bulletins = await getBulletins(page, limit).then((r) => {
    const bulletins = r["_embedded"]["items"];
    return bulletins;
  });
  Store.dispatch(BulletinsSlice.actions.setBulletins(bulletins));
  return bulletins;
};

export const loadPublications = async (authors = [], tags = [], page: number = 1, limit: number = 3) => {
  const posts = await getPostsCollection(authors, tags, page, limit).then((r) => {
    const posts = r["_embedded"]["items"].map((item) => {
      item.type = "article";
      return item;
    });
    return posts;
  });
  const videos = await getVideos(page, limit).then((r) => {
    let videos = r["_embedded"]["items"].map((item) => {
      item.title = item.name;
      item.illustration = item.thumbnail_url;
      item.type = "video";
      return item;
    });
    return videos;
  });
  const postTitles = posts.map((post) => post.title);
  const filteredVideos = videos.filter((video) => !postTitles.includes(video.title));
  const publications = posts.concat(filteredVideos).sort((a, b) => {
    return a.published_at < b.published_at;
  });
  Store.dispatch(PublicationsSlice.actions.setPublications(publications));
  return publications;
};

export const loadProducts = async (currency, service?) => {
  const products = await getProductCollection(currency, service).then((r) => {
    const temp = r["_embedded"]["items"];
    return temp;
  });
  Store.dispatch(DataSlice.actions.setProducts(products));
};

export const loadUnitsPrices = async (metal, currency) => {
  const oz = await getCurrentSpotPrice(metal, currency, "oz");
  const kg = await getCurrentSpotPrice(metal, currency, "kg");
  const g = await getCurrentSpotPrice(metal, currency, "g");
  return { [currency]: { oz, kg, g } };
};

export const loadMetals = async () => {
  const currencies = Store.getState().dataStore.currencies;
  metalsConstant.map((metal) => {
    const value = currencies.map((currency) => {
      return loadUnitsPrices(metal.id, currency.code);
    });

    Promise.all(value).then((r) => {
      Store.dispatch(metal.action(Object.assign({}, ...r)));
    });
  });
};

export const loadMetalsForCurrency = async (currencyCode) => {
  metalsConstant.map(async (metal) => {
    const value = [await loadUnitsPrices(metal.id, currencyCode)];
    Store.dispatch(metal.action(Object.assign({}, ...value)));
  });
};

export const loadAuthors = async () => {
  const authors = await getUserCollection().then((r) => {
    const temp = r["_embedded"]["items"];
    return temp;
  });
  Store.dispatch(DataSlice.actions.setAuthors(authors));
};

export const loadPublicationTags = async () => {
  const tags = await getTags().then((r) => {
    const temp = r["_embedded"]["items"];
    return temp;
  });
  Store.dispatch(DataSlice.actions.setPublicationTags(tags));
};

export const loadCurrencies = async () => {
  const currencies = await getCurrencies().then((r) => {
    const temp = r["_embedded"]["items"];
    return temp;
  });
  Store.dispatch(DataSlice.actions.setCurrencies(currencies));
};

export const loadLocales = async () => {
  const locales = await getCollectionLocales().then((r) => r["_embedded"]["items"]);
  Store.dispatch(DataSlice.actions.setLocales(locales));
};
