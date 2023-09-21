import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import PublicationFilterSlice from "../../../store/slices/publication-filter.slice";
import { loadPublications } from "../../../utils/data.utils";

export const UsePublications = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filterPublication, setFilterPublication] = useState([]);
  const author = useSelector((state: State) => state.publicationFilterStore.author);
  const subject = useSelector((state: State) => state.publicationFilterStore.subject);
  const publicationType = useSelector((state: State) => state.publicationFilterStore.publicationType);
  const shouldReload = useSelector((state: State) => state.publicationFilterStore.shouldReload);
  const [publications, setPublications] = useState([]);
  const [publicationsPage, setPublicationsPage] = useState(1);
  const locale = useSelector((state: State) => state.appStore.locale);

  const isActive = (publicationType, subject, author) => {
    return publicationType.length != 0 || subject.length != 0 || author.length != 0;
  };

  const searchFilterPublications = () => {
    setFilterPublication(
      publications.filter((p) => {
        return p.title.toLowerCase().includes(search.toLowerCase());
      }),
    );
  };

  const fetchPublications = async () => {
    setIsRefreshing(true);
    setPublicationsPage(1);
    const res = await loadPublications(author, subject, 1);
    const temp = res.filter((p) => {
      return publicationType.includes(p.type) || publicationType.length === 0;
    });
    setFilterPublication(temp);
    setPublications(temp);
    setIsRefreshing(false);
  };

  const reloadPublications = async () => {
    if (shouldReload) {
      fetchPublications();
      dispatch(PublicationFilterSlice.actions.setShouldReload(false));
    }
  };

  const fetchMoreData = async () => {
    const res = await loadPublications(author, subject, publicationsPage + 1);
    const filteredPublications = res.filter((p) => {
      return publicationType.includes(p.type) || publicationType.length === 0;
    });
    setPublicationsPage((prevValue) => prevValue + 1);
    setFilterPublication((prevValue) => [...prevValue, ...filteredPublications]);
    setPublications((prevValue) => [...prevValue, ...filteredPublications]);
  };

  useEffect(() => {
    (async () => {
      const res = await loadPublications(author, subject);
      dispatch(PublicationFilterSlice.actions.setShouldReload(true));
      setPublications(res);
      setFilterPublication(res);
    })();
  }, [author, subject, locale]);

  return {
    navigation,
    search,
    setSearch,
    filterPublication,
    searchFilterPublications,
    reloadPublications,
    fetchMoreData,
    isActive,
    author,
    publicationType,
    subject,
    isRefreshing,
    fetchPublications,
  };
};
