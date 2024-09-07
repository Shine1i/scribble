//
// import { Extension, type Editor } from '@tiptap/core';
// import { Plugin, PluginKey } from '@tiptap/pm/state';
//
// export interface TableOfContentsOptions {
//     onUpdate: (items: ToCItem[]) => void;
//     getIndex: (level: number) => string;
//     debounceWait: number;
// }
//
// export interface ToCItem {
//     id: string;
//     level: number;
//     text: string;
//     itemIndex: string;
// }
//
// declare module '@tiptap/core' {
//     interface Commands<ReturnType> {
//         tableOfContents: {
//             updateTableOfContents: () => ReturnType;
//         }
//     }
// }
//
// // Simple debounce function
// function debounce(func: Function, wait: number) {
//     let timeout: ReturnType<typeof setTimeout> | null = null;
//     return function(...args: any[]) {
//         const context = this;
//         if (timeout !== null) {
//             clearTimeout(timeout);
//         }
//         timeout = setTimeout(() => {
//             func.apply(context, args);
//             timeout = null;
//         }, wait);
//     };
// }
//
// export const TableOfContents = Extension.create<TableOfContentsOptions>({
//     name: 'tableOfContents',
//
//     addOptions() {
//         return {
//             onUpdate: () => {},
//             getIndex: (level: number) => `${level}.`,
//             debounceWait: 250, // Adjust this value as needed
//         }
//     },
//
//     addCommands() {
//         return {
//             updateTableOfContents: () => ({ state, dispatch }) => {
//                 const tr = state.tr.setMeta(this.name, { updateToc: true })
//                 if (dispatch) {
//                     dispatch(tr)
//                 }
//                 return true
//             },
//         }
//     },
//
//     addProseMirrorPlugins() {
//         const plugin = new Plugin({
//             key: new PluginKey('tableOfContents'),
//             view: (view) => {
//                 let lastHeadingCount = 0;
//
//                 const debouncedUpdate = debounce(() => {
//                     const items: ToCItem[] = [];
//                     let index = 0;
//                     let currentHeadingCount = 0;
//
//                     view.state.doc.descendants((node, pos) => {
//                         if (node.type.name === 'heading') {
//                             currentHeadingCount++;
//                             items.push({
//                                 id: `toc-${index}`,
//                                 level: node.attrs.level,
//                                 text: node.textContent || '',
//                                 itemIndex: this.options.getIndex(node.attrs.level),
//                             });
//                             index++;
//                         }
//                     });
//
//                     if (currentHeadingCount !== lastHeadingCount) {
//                         this.options.onUpdate(items);
//                         lastHeadingCount = currentHeadingCount;
//
//                         const tr = view.state.tr;
//                         view.state.doc.descendants((node, pos) => {
//                             if (node.type.name === 'heading') {
//                                 const item = items.find(i => i.text === node.textContent);
//                                 if (item) {
//                                     tr.setNodeMarkup(pos, undefined, { ...node.attrs, 'data-toc-id': item.id });
//                                 }
//                             }
//                         });
//                         view.dispatch(tr);
//                     }
//                 }, this.options.debounceWait);
//
//                 return {
//                     update: (view, prevState) => {
//                         const { state } = view;
//                         const updateToc = state.tr.getMeta(this.name)?.updateToc;
//
//                         if (updateToc || prevState.doc !== state.doc) {
//                             debouncedUpdate();
//                         }
//                     },
//                 };
//             },
//         });
//
//         return [plugin];
//     },
// });

import { Extension, type Editor } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Node } from '@tiptap/pm/model';

export interface ToCItem {
    dom: HTMLElement;
    editor: Editor;
    id: string;
    isActive: boolean;
    isScrolledOver: boolean;
    itemIndex: number;
    level: number;
    node: Node;
    originalLevel: number;
    pos: number;
    textContent: string;
}

export interface TableOfContentsOptions {
    onUpdate: (items: ToCItem[]) => void;
    getIndex: (level: number) => string;
    debounceWait: number;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        tableOfContents: {
            updateTableOfContents: () => ReturnType;
        }
    }
}

function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function(...args: any[]) {
        const context = this;
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func.apply(context, args);
            timeout = null;
        }, wait);
    };
}

export const TableOfContents = Extension.create<TableOfContentsOptions>({
    name: 'tableOfContents',
    
    addOptions() {
        return {
            onUpdate: () => {},
            getIndex: (level: number) => `${level}.`,
            debounceWait: 250,
        }
    },
    
    addCommands() {
        return {
            updateTableOfContents: () => ({ state, dispatch }) => {
                const tr = state.tr.setMeta(this.name, { updateToc: true })
                if (dispatch) {
                    dispatch(tr)
                }
                return true
            },
        }
    },
    
    addProseMirrorPlugins() {
        const plugin = new Plugin({
            key: new PluginKey('tableOfContents'),
            view: (view) => {
                let lastHeadingCount = 0;
                
                const debouncedUpdate = debounce(() => {
                    const items: ToCItem[] = [];
                    let index = 0;
                    let currentHeadingCount = 0;
                    
                    view.state.doc.descendants((node, pos) => {
                        if (node.type.name === 'heading') {
                            currentHeadingCount++;
                            const id = `toc-${index}`;
                            const dom = view.dom.querySelector(`[data-toc-id="${id}"]`) as HTMLElement;
                            
                            items.push({
                                dom,
                                editor: this.editor,
                                id,
                                isActive: false, // You might want to implement logic to determine this
                                isScrolledOver: false, // You might want to implement logic to determine this
                                itemIndex: index + 1,
                                level: node.attrs.level,
                                node,
                                originalLevel: node.attrs.level,
                                pos,
                                textContent: node.textContent || '',
                            });
                            index++;
                        }
                    });
                    
                    if (currentHeadingCount !== lastHeadingCount) {
                        this.options.onUpdate(items);
                        lastHeadingCount = currentHeadingCount;
                        
                        const tr = view.state.tr;
                        items.forEach((item) => {
                            tr.setNodeMarkup(item.pos, undefined, { ...item.node.attrs, 'data-toc-id': item.id });
                        });
                        view.dispatch(tr);
                    }
                }, this.options.debounceWait);
                
                return {
                    update: (view, prevState) => {
                        const { state } = view;
                        const updateToc = state.tr.getMeta(this.name)?.updateToc;
                        
                        if (updateToc || prevState.doc !== state.doc) {
                            debouncedUpdate();
                        }
                    },
                };
            },
        });
        
        return [plugin];
    },
});