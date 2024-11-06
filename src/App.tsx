import React, { useState } from 'react';
import './App.css';
import SideNav from './Component/SideNav/SideNav';
import { Button, MenuProps } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import SingleView from './Component/SingleServiceProvider';

function App() {
  type MenuItem = Required<MenuProps>['items'][number]; 
  const [navItems, setNavItems] = useState<MenuItem[]>([]);
  const [childState, setChildState] = useState({});

  async function getProviderData(): Promise<void> {
    try {
      const { data } = await axios.get('https://api.apis.guru/v2/providers.json');
      const transformedData = transformArray(data.data.splice(0,200)||[]);
      setNavItems(transformedData);
    } catch (error) {
      setNavItems([]);
    }
  }

  async function getProviderNamedData(providerName: String): Promise<void> {
    try {
      const { data } = await axios.get(`https://api.apis.guru/v2/${providerName}.json`);
      const transformedData = extractInfo(data?.apis);
      setChildState(transformedData);
      addIconToObject(providerName+'x', transformedData.xLogoUrl, transformedData.title)
    } catch (error) {
    }
  }

  const addIconToObject = (key: String, url: string, title: string) => {
    const updatedData = navItems.map(item => {
      if (item && 'children' in item && item?.children) {
        const updatedChildren = item.children.map(child =>
          child && child.key === key 
            ? { ...child, label: title ?? item, icon: <img src={url} alt={`${key} icon`} /> }
            : child
        );
        return { ...item, children: updatedChildren };
      }
      return item;
    });

    setNavItems(updatedData);
  };
  function handleApiCall() {
    getProviderData();
    setSideNavVisible(true)
  }
  

  const [sideNavVisible, setSideNavVisible] = useState(false);
  const [childView, setChildView] = useState(false);

  function handleChildView() {
    setChildView(true);
  }
  function handleApiList(){
    setChildView(false);
  }
  return (
    <div className={`${sideNavVisible && !childView ? 'sidebar_active' : ''}`}>
      {
        !childView ? <>
          <div className='main_button_area'>
            <Button disabled={sideNavVisible} className='button_call' onClick={handleApiCall}>Explore Web APIs</Button>
          </div>
          {sideNavVisible &&
            <SideNav items={navItems} getProviderNamedData={getProviderNamedData} handleChildView={handleChildView}/>
          }
        </>
          :
          <SingleView childState={childState} handleApiList={handleApiList}/>
      }
    </div>
  );
}

export default App;

function transformArray(arr: []) {
  return arr.map((item, index) => ({
    key: String(item),
    label: String(item),
    children: [{
      key: `${String(item)+"x"}`,
      label: String(item),
      icon: <img
        src=""
        onError={(e) => e.currentTarget.src = 'no-image.svg'}
        alt=""
      />
    }],
  }));
}


function extractInfo(data: { [x: string]: string; }) {
  const details = Object.keys(data).splice(0, 1).map(key => {
    const item = data[key];
    return {
      title: _.get(item, 'info.title', ""),
      description: _.get(item, 'info.description', ""),
      swaggerUrl: _.get(item, 'swaggerUrl', ""),
      contact: _.get(item, 'info.contact', ""),
      xLogoUrl: _.get(item, 'info.x-logo.url', ""),
    };
  });
  return details[0];
}
