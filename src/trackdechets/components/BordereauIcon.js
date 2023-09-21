import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLOR_PRIMARY } from '../../common/styles/vars';

const styles = {
  icon: {
    flex: 0,
    padding: 0,
    margin: 0,
    marginRight: 5,
  },
};

export default function BordereauIcon() {
  return (
    <Icon
      size={20}
      name="barcode"
      style={{
        ...styles.icon,
        color: COLOR_PRIMARY,
      }}
    />
  );
}
