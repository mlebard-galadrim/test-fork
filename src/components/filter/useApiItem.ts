import { useDispatch } from "react-redux";

export const useApiItem = ({ id, type, filters, action }) => {
  const dispatch = useDispatch();

  const onFilterPress = () => {
    if (checked()) {
      remove(id);
    } else {
      add(id);
    }
  };

  const checked = () => {
    if (type === "switch") {
      if (filters === id) {
        return true;
      } else {
        return false;
      }
    } else {
      if (filters.includes(id)) {
        return true;
      } else {
        return false;
      }
    }
  };

  const add = (id) => {
    let payload;
    if (type === "list") {
      payload = [...filters, id];
    } else {
      payload = id;
    }
    dispatch(action(payload));
  };

  const remove = (id) => {
    let payload;
    if (type === "list") {
      payload = [...filters.filter((e) => e !== id)];
    } else {
      payload = null;
    }
    dispatch(action(payload));
  };

  return { onFilterPress, checked };
};
