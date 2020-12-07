const computeStartIndex = (startIndex, len) => {
    // 处理索引负数的情况
    if (startIndex < 0) {
      return startIndex + len > 0 ? startIndex + len: 0;
    } 
    return startIndex >= len ? len: startIndex;
  }
  
  const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {
    // 删除数目没有传，默认删除startIndex及后面所有的
    if (argumentsLen === 1) 
      return len - startIndex;
    // 删除数目过小
    if (deleteCount < 0) 
      return 0;
    // 删除数目过大
    if (deleteCount > len - startIndex) 
      return len - startIndex;
    return deleteCount;
  }
  

Array.prototype.splice = function(startIndex, deleteCount, ...addElements){
    let argumentsLen = arguments.length
    let array = Object(this)
    let len = array.length
    let deleteArr = new Array(deleteCount)

    startIndex = computeStartIndex(startIndex, len);
    deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);

    // 拷贝要删除的元素
    sliceDeleteElements(array, startIndex, deleteCount, deleteArr)
    // 移动删除元素后面的元素
    movePostElements(array, startIndex, len, deleteCount, addElements)
    // 插入新元素
    for(let i=0; i<addElements.length; i++){
        array[startIndex+i]  = addElements[i]
    }
    array.length = len - deleteCount + addElements.length
    return deleteArr
}

const sliceDeleteElements = (array, startIndex, deleteCount, deleteArr) => {
    for(let i=0; i<deleteCount; i++){
        let index = startIndex+i
        if(index in array){
            deleteArr[i] = array[index]
        }
    }
}

const movePostElements = (array, startIndex, len, deleteCount, addElements)=>{
    // 添加的元素和删除的元素个数相等
    if(deleteCount === addElements.length) return
    // 删除的元素比新增的元素多，那么后面的元素整体向前挪动
    if(deleteCount > addElements.length){
        // 一共需要挪动 len - startIndex - deleteCount 个元素
        for(let i=startIndex+deleteCount; i<len; i++){
            let fromIndex = i
            // 将要挪动到的目标位置
            let toIndex = i - (deleteCount-addElements.length)
            if(fromIndex in array){
                array[toIndex] = array[fromIndex]
            }else{
                delete array[toIndex]
            }
        }
        // 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素
        // 目前长度为 len + addElements - deleteCount
        for(let i=len-1; i>=len+addElements.length-deleteCount; i--){
            delete array[i]
        }
    }
    if(deleteCount < addElements.length){
        // 删除的元素比新增的元素少，那么后面的元素整体向后挪动
        // 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？
        for(let i=len-1; i>=startIndex+deleteCount; i--){
            let fromIndex = i
            //将要挪动到的目标位置
            let toIndex = i +(addElements.length - deleteCount)
            if(fromIndex in array){
                array[toIndex] = array[fromIndex];
            } else {
                delete array[toIndex];
            }
        }
    }
}
arr = [1,2,3]
arr.splice(1,2,1,2,3)
console.log(arr)