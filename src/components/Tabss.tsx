import React from 'react';
import {useFileSystemStore} from '@/hooks/use-file-system';
import {X, ChevronRight, File} from 'lucide-react';

export const Tabss = () => {
    const {tabs, activeTab, closeTab, setActiveTab} = useFileSystemStore();

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    const handleCloseTab = (tabId: string) => {
        closeTab(tabId);
    };

    const activeTabItem = tabs.find((tab) => tab.id === activeTab);

    return (
        <div className="flex flex-col  text-[#cccccc] font-mono">
            <div className="flex bg-background overflow-x-auto divide-x divide-border">
                {tabs.map((tab, index) => (
                    <div
                        key={tab.id}
                        className={`flex items-center px-3 py-1 cursor-pointer  ${
                            tab.id === activeTab ? 'bg-editor-background border-t !border-primary !border-x-0' : 'bg-background hover:bg-editor-background'
                        } ${index === tabs.length - 1 ? 'rounded-tr-md' : ''} ${index === 0 ? 'rounded-tl-md' : ''}`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        <File size={14} className="mr-1"/>
                        <span className="mr-2 text-sm text-nowrap">{tab.name}</span>
                        <button
                            className="text-foreground/75 hover:text-foreground"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCloseTab(tab.id);
                            }}
                        >
                            <X size={14}/>
                        </button>
                    </div>
                ))}
            </div>
            {activeTabItem && (
                <div
                    className="flex items-center shadow-md shadow-slate-900/20 border-t border-slate-900/20  bg-editor-background text-[#cccccc] text-xs px-2 py-1">
                    {activeTabItem.path.split('/').map((segment, index, array) => (
                        <span key={index} className="flex items-center">
              {index > 0 && <ChevronRight size={14} className="mx-1"/>}
                            <span className="hover:underline cursor-pointer">{segment}</span>
                            {index === array.length - 1 && (
                                <>
                                    <ChevronRight size={14} className="mx-1"/>
                                    <span className="flex items-center">
                    <File size={14} className="mr-1"/>
                    <span className="text-[#75beff]">{activeTabItem.name}</span>
                  </span>
                                </>
                            )}
            </span>
                    ))}
                </div>
            )}
        </div>
    );
};