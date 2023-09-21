import I18n from 'i18n-js';
import React from 'react';
import { useState } from 'react';
import { Button } from '../form';
import View from 'k2/app/modules/common/components/View';
import Text from 'k2/app/modules/common/components/Text';
import { COLOR_TAB_ACTIVE } from '../../styles/vars';

const styles = {
  activeButton: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  inactiveButton: {
    flex: 1,
    backgroundColor: COLOR_TAB_ACTIVE,
  },
  activeText: {
    color: 'black',
    fontSize: 13,
  },
  inactiveText: {
    color: 'white',
    fontSize: 13,
  },
};

const Tabs = ({ tabs, children }) => {
  const [current, setCurrent] = useState(0);

  return (
    <>
      <View styleName="horizontal">
        {tabs.map((name, index) => {
          const isActive = index === current;
          return (
            <Button
              style={isActive ? styles.activeButton : styles.inactiveButton}
              key={name}
              onPress={() => setCurrent(index)}
            >
              <Text style={isActive ? styles.activeText : styles.inactiveText}>{I18n.t(name)}</Text>
            </Button>
          );
        })}
      </View>
      {React.Children.map(children, (element, index) => {
        if (index === current) {
          return element;
        }
        return null;
      })}
    </>
  );
};

export default Tabs;
