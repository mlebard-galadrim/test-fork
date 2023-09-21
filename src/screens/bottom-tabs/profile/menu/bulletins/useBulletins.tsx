import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../../../../../store/configure.store";
import { loadBulletins } from "../../../../../utils/data.utils";

export const UseBulletins = () => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [bulletins, setBulletins] = useState([]);
  const [bulletinsPage, setBulletinsPage] = useState(1);
  const locale = useSelector((state: State) => state.appStore.locale);

  const fetchBulletins = async () => {
    setIsRefreshing(true);
    setBulletinsPage(1);
    const res = await loadBulletins(1, 5);
    setBulletins(res);
    setIsRefreshing(false);
  };
  useEffect(() => {
    fetchBulletins();
  }, []);

  const fetchMoreData = async () => {
    const res = await loadBulletins(bulletinsPage + 1);
    setBulletinsPage((prevValue) => prevValue + 1);
    setBulletins((prevValue) => [...prevValue, ...res]);
  };

  useEffect(() => {
    (async () => {
      const res = await loadBulletins(1, 5);
      setBulletins(res);
    })();
  }, [locale]);

  return {
    bulletins,
    fetchMoreData,
    fetchBulletins,
    isRefreshing,
  };
};
