import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import './side.css'

type MenuItem = Required<MenuProps>['items'][number];

interface SideNavProps {
    items: MenuItem[];
    getProviderNamedData: (activeKey: string) => void;
    handleChildView: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ items, getProviderNamedData , handleChildView}) => {

    interface LevelKeysProps {
        key?: string;
        children?: LevelKeysProps[];
    }
    const getLevelKeys = (items1: LevelKeysProps[]) => {
        const key: Record<string, number> = {};
        const func = (items2: LevelKeysProps[], level = 1) => {
            items2.forEach((item) => {
                if (item.key) {
                    key[item.key] = level;
                }
                if (item.children) {
                    func(item.children, level + 1);
                }
            });
        };
        func(items1);
        return key;
    };
    const levelKeys = getLevelKeys(items as LevelKeysProps[]);
    const [stateOpenKeys, setStateOpenKeys] = useState(['']);

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const activeKey = openKeys[1];
        getProviderNamedData(activeKey);
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
            setStateOpenKeys(
                openKeys
                    .filter((_, index) => index !== repeatIndex)
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            setStateOpenKeys(openKeys);
        }
    };


    const handleMenuClick: MenuProps['onClick'] = (e) => {
        handleChildView()
    };

    return (
        <div className={"container"}>
            <div className={"sideNavWrapper"}>
                <div className={"heading"}>Select Provider</div>
                <div className='menu_scroll'>
                    <Menu
                        mode="inline"
                        openKeys={stateOpenKeys}
                        onOpenChange={onOpenChange}
                        onClick={handleMenuClick}
                        items={items}
                    />
                </div>
            </div>
        </div>

    );
};

export default SideNav;