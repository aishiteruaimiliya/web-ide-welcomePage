import { Injectable } from '@angular/core';
import { TreeNode } from './tree-node';
import { TreeOptions } from './tree-options';
import { TREE_EVENTS } from '../constants/events';
import { first, last, indexOf, findIndex, sortBy } from 'lodash-es';

@Injectable()
export class TreeModel {
    roots: TreeNode[];
    options: TreeOptions = new TreeOptions();
    static focusedTree = null;
    // focused Node may be not actived 
    // actived Node must be focused
    focusedNode: TreeNode = null;// be chosen node
    activeNode: TreeNode = null;// be chosen and actived node
    private events:any;
    eventNames = Object.keys(TREE_EVENTS);

    firstUpdate = true;
    _dragNode: { parentNode: TreeNode, index: number } = null;
    _dropLocation:{ component: any, parentNode: TreeNode, index: number } = null;

    setData({nodes, options, events}){

        this.options = new TreeOptions(options);
        this.events = events;

        this.update(nodes);
    }

    virtualRoot: TreeNode;
    update(nodes){
        // Update the tree:

        this.virtualRoot = new TreeNode({ isVirtualRoot: true }, null,this);

        this.roots = nodes && nodes.map(child => new TreeNode(child, this.virtualRoot, this));

        this.virtualRoot[this.options.childrenField] = this.roots;
  
        this._loadTreeNodeContentComponent();
    
        // Fire event:
        if (this.firstUpdate) {
            if (this.roots) {
                this.fireEvent({ eventName: TREE_EVENTS.onInitialized });
                this.firstUpdate = false;
            }
        } else {
            this.fireEvent({ eventName: TREE_EVENTS.onUpdateData });
        }
    }

    //Used for code test
    addStaticTreeNode(){
        this.createAndAddTreeNode({        
            id: 1,
            name: 'root1',
            subTitle: 'the root',
            type: 'type1'
        },this.focusedNode);
    }

    createAndAddTreeNode(data, parentNode: TreeNode, index?){
        const createdNode = this.createTreeNode(data, parentNode);
        this.addTreeNode(createdNode, parentNode, index);
    }

    createTreeNode(data, parent: TreeNode): TreeNode{
        let createdNode =  new TreeNode(data, parent, this);
        return createdNode;
    }
    
    addTreeNode(addedNode: TreeNode, parentNode: TreeNode, index?){
        if (addedNode == null) {
            return;
        }

        if (parentNode == null) {// 增加顶级树节点（没有父节点的树节点）
            this.roots.push(addedNode);
        } else {
            if (index === null || index === undefined) {
                parentNode.childrenField.push(addedNode);
            } else {
                parentNode.childrenField.splice(index, 0, addedNode);
            }
        }

        this.update(this.roots);

        this.fireEvent({ eventName: TREE_EVENTS.onAddNode, addedNode, parentNode});
    }

    removeFocusedTreeNode(){
        this.removeTreeNode(this.focusedNode);
    }
    
    //移除选中的已知节点
    removeTreeNode(selectedTreeNode: TreeNode){
        if(selectedTreeNode == null){
            return;
        }

        const parent = selectedTreeNode.parent;
        if(parent == null){//移除顶级树节点（没有父节点的树节点）
            let index = this.roots.indexOf(selectedTreeNode);
            this.roots.splice(index, 1);//移除数组中某一指定节点
        }else{
            if(parent.childrenField.length <= 0){
                console.log("RemoveTreeNode Warning: it is impossible to remove element from an empty array");
                return;
            }
            //移除数组中某一指定节点
            let index = parent.childrenField.indexOf(selectedTreeNode);
            parent.childrenField.splice(index, 1);
        }

        this.update(this.roots);

        this.fireEvent({ eventName: TREE_EVENTS.onRemoveNode, selectedTreeNode, parent});
    }

    /**
     * 定位指定树节点
     * @param needLocatedNode 待定位节点 
     */
    locateTreeNode(needLocatedNode: TreeNode){
        if(needLocatedNode == null){
            return;
        }

        let parentNode = needLocatedNode.parent;
        while( parentNode != null){
            parentNode.isExpanded = true;
            parentNode = parentNode.parent;
        }
        
        needLocatedNode.isActive = false;
        needLocatedNode.toggleActivated();
    }

    /**
     * 通过ID定位树节点
     * @param nodeID 待查找并定位节点的ID
     */
    locateNodeByID(nodeID: string): boolean{
        let node = this.searchTreeNodeByID(nodeID);
        if(node == null) {
            return false;
        }
        this.locateTreeNode(node);
        return true;
    }
    
    /**
     * 查找指定树节点
     * @param nodeID 待查找节点ID
     */
    searchTreeNodeByID(nodeID: string): TreeNode{
        return this.searchTreeNode(this.roots, nodeID);
    }

    
    /**
     * 在指定集合中，根据ID查找树节点
     * @param nodes 树集合
     * @param nodeID 待查找节点ID
     */
    searchTreeNode(nodes: TreeNode[], nodeID: string): TreeNode{

        if(nodes == null || nodes.length <= 0){
            return null;
        }

        if(nodeID == null || nodeID.length < 0){
            return null;
        }

        let searchedTreeNode: TreeNode = null;
        
        nodes.forEach(node => {
            if(node.idField == nodeID){ //回归
                searchedTreeNode = node;
                return;
            }

            if(node.childrenField == null || node.childrenField.length < 0){ //回归
                return;
            }

            const searchedNodeInChildren = this.searchTreeNode(node.childrenField, nodeID);//递推
            if(searchedNodeInChildren != null){
                searchedTreeNode = searchedNodeInChildren;
            }
            return;//回归
        });

        return searchedTreeNode; //返回
    }
    
    private _treeNodeContentComponent:any;
    get treeNodeContentComponent() { return this._treeNodeContentComponent };
    // if treeNodeTemplate is a component - use it,
    // otherwise - it's a template, so wrap it with an AdHoc component
    _loadTreeNodeContentComponent() {
        this._treeNodeContentComponent = this.options.treeNodeTemplate;
        if (typeof this._treeNodeContentComponent === 'string') {
        // this._treeNodeContentComponent = this._createAdHocComponent(this._treeNodeContentComponent);
        }
    }

    // _createAdHocComponent(templateStr) {
    //     @Component({
    //         selector: 'TreeNodeTemplate',
    //         template: templateStr
    //     })
    //     class AdHocTreeNodeTemplateComponent {
    //         @Input() node: TreeNode;
    //     }
    //     return AdHocTreeNodeTemplateComponent;
    // }

    get isFocused()
    {
        return TreeModel.focusedTree === this;
    }
    setFocus(value){
        TreeModel.focusedTree = value ? this : null;
    }
    getFirstRoot(){
        return first(this.roots);
    }
    getLastRoot(){
        return last(this.roots);
    }
    focusNextNode() {
        let previousNode = this.focusedNode;
        let nextNode = previousNode ? previousNode.findNextNode() : this.getFirstRoot();
        nextNode && nextNode.focus() // Short-circuit evaluation
    }

    focusPreviousNode() {
        let previousNode = this.focusedNode;
        let nextNode = previousNode ? previousNode.findPreviousNode() : this.getLastRoot();
        nextNode && nextNode.focus();
    }

    focusDrillUp(){
        let previousNode = this.focusedNode;
        let nextNode = previousNode && previousNode.realParent;
        nextNode && nextNode.focus();
    }

    focusDrillDown() {
        let previousNode = this.focusedNode;
        let nextNode = previousNode && previousNode.getFirstChild();
        nextNode && nextNode.focus();
    }

    fireEvent(event) {
        // https://stackoverflow.com/questions/35840576/differencse-between-eventemitter-next-and-eventemitter-emit-in-angular-2
        //  abandon next() function, begin to use emit() function
        // this.events[event.eventName].next(event);
        // this.events[event.eventName].emit(event,alert(event.eventName));//发射事件，并传递事件的对象
        this.events[event.eventName].emit(event);

    }

    /**
     * 判断是否执行移动节点操作，可以移动返回true，否则返回false
     * @param param0 param0.from 待移动节点的原有父节点
     *               param0.to 待移动节点的新父节点
     */
    canMoveNode({ from, to }) {
        // same node
        if (from.parentNode === to.parentNode && from.index === to.index) {
          return false;
        }
    
        const fromChildren = from.parentNode.children;
        const fromNode = fromChildren[from.index];
        
        return !to.parentNode.isDescendantOf(fromNode);
    }

    /**
     * 移动节点
     * @param param0 param0.from 待移动节点的原有父节点
     *               param0.to 待移动节点的新父节点
     */
    moveNode({ from, to }) {
        if (!this.canMoveNode({ from , to })) return;
    
        const fromChildren = from.parentNode.childrenField;
    
        // If node doesn't have children - create children array
        if (!to.parentNode.childrenField) {
          to.parentNode.childrenField = [];
        }
        const toChildren = to.parentNode.childrenField;
        
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        // The splice() method changes the contents of an array by removing existing elements and/or adding new elements.
        const node = fromChildren.splice(from.index, 1)[0];
    
        // Compensate for index if already removed from parent:
        let toIndex = (from.parentNode === to.parentNode && to.index > from.index) ? to.index - 1 : to.index;
    
        toChildren.splice(toIndex, 0, node);

        // console.log("toChildren:" + toChildren);

        // console.log("AfterMoveNode:" + this.roots);
    
        this.update(this.roots);// 实现node moved后，重新刷新这棵树
    
        this.fireEvent({ eventName: TREE_EVENTS.onMoveNode, node, to });
    }
    
    // TODO: move to a different service:
    setDragNode(dragNode:{ parentNode: TreeNode, index: number }) {
        this._dragNode = dragNode;
    }
    
    getDragNode():{ parentNode: TreeNode, index:number } {
        return this._dragNode || { parentNode: null, index: null };
    }
    
    isDragging() {
        return this.getDragNode().parentNode;
    }
    
    setDropLocation(dropLocation: { component: any, parentNode: TreeNode, index: number }) {
        this._dropLocation = dropLocation;
    }
    
    getDropLocation(): { component: any, parentNode: TreeNode, index: number } {
        return this._dropLocation || {component: null, parentNode: null, index: null};
    }
    
    isDraggingOver(component) {
        return this.getDropLocation().component === component;
    }
    
    cancelDrag() {
        this.setDropLocation(null);
        this.setDragNode(null);
    }
}