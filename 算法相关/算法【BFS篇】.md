# 算法【BFS篇】

> DFS实现重要依赖于堆栈/递归 ，较为简单的解决了如何遍历所有元素，以及寻求“终点”的问题。
>
> 但是，DFS虽然可以查找到到达路径，但是却找不到**最短的路径**，针对这一问题，给出了BFS(广度优先遍历)的算法。
>
> BFS 的核心思想就是把一些问题抽象成图，从一个点开始，向四周开始扩散。
>
> **问题的本质就是让你在一幅「图」中找到从起点** **`start`** **到终点** **`target`** **的最近距离**

## 模版

```javascript
const BFS = ()=>{
    1、定义队列 queue
    2、定义备忘录，用于记录已访问的位置，这一步根据题意选择，也可以用set、map
    3、判断边界条件，是否能直接返回结果 
    4、通常这里还需要定义一个变量用于记录遍历层数 step
    5、将起始位置加入到队列中，同时更新备忘录
    
    while(队列不为空){
        6、获取当前队列中元素个数 size
        while(size--){
            7、取出队列第一个位置节点 cur = queue.shift()
            8、判断是否到达终点
            9、获取它对应的下一个所有节点
            	10、条件判断，过滤不符合条件的位置节点
                11、新的节点加入队列
        }
        12、step++
    }
    return -1 //没有找到目标
}
```

## 经典例题

### 完全平方数

[No.279](https://leetcode-cn.com/problems/perfect-squares/)

给定正整数 *n*，找到若干个完全平方数（比如 `1, 4, 9, 16, ...`）使得它们的和等于 *n*。你需要让组成和的完全平方数的个数最少。

**示例 1:**

```
输入: n = 12
输出: 3 
解释: 12 = 4 + 4 + 4.
```

**思路**

> 可以将每个整数看成图中的一个节点，如果两个整数之差为一个平方数，那么这两个整数所在的节点就有一条边。
>
> 要求解最小的平方数数量，就是求解从节点 n 到节点 0 的最短路径。



![img](https://user-gold-cdn.xitu.io/2020/1/31/16ffae78d04fa541?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



在这个无权图中，每一个点指向的都是它可能经过的上一个节点。举例来说，对 5 而言，可能是 4 加上了`1的平方`转换而来，也可能是1 加上了`2的平方`转换而来，因此跟`1`和`2`都有联系，依次类推。

那么我们现在要做了就是寻找到`从 n 转换到 0 最短的连线数`。

举个例子， n = 8 时，我们需要找到它的邻居节点`4`和`7`，此时到达 4 和到达 7 的步数都为 1, 然后分别从 4 和 7 出发，4 找到邻居节点`3`和`0`，达到 3 和 0 的步数都为 2，考虑到此时已经到达 0，遍历终止，返回到达 0 的步数 2 即可。

```javascript
var numSquares = function(n) {
    var queue = [] 
    var visited = new Map()
    queue.push([n,0])
    visited.set(n, true)
    while(queue.length){
        var [num, step] = queue.shift()
        for(var i=1; ;i++){
            var nextNum = num - i*i
            if(nextNum < 0) break
            if(nextNum == 0) return step+1

            if(!visited.get(nextNum)){
                queue.push([nextNum, step+1])
                visited.set(nextNum, true)
            }
        }
    }
    return 0
};
```

### 二进制矩阵中的最短路径

[No.1091](https://leetcode-cn.com/problems/shortest-path-in-binary-matrix/)

```
[[0,0,0],[1,1,0],[1,1,0]]  =>4

[[0,1],[1,0]] =>2
```

思路：

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var shortestPathBinaryMatrix = function(grid) {
    if(grid == null || grid.length == 0 || grid[0].length == 0) return -1

    var res = 1
    var direction = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]]

    var queue = [] //定义队列

    var m = grid.length
    var n = grid[0].length

    //判断边界条件
    if(grid[0][0] == 1 || grid[m-1][n-1] ==1) return -1

    //将起始位置加入队列，并更新备忘录
    queue.push([0,0])
    grid[0][0]=1

    while(queue.length!==0){
        var size = queue.length
        for(var i=0; i < size; i++){
            var cur = queue.shift()

            var x = cur[0]
            var y = cur[1]

            if(x==m-1 && y == n-1) return res

            for(var d of direction){
                var dx = x+d[0],dy=y+d[1]
                if(dx<0 || dy<0 ||dx>=m || dy>=m || grid[dx][dy] ==1){
                    continue
                }
                grid[dx][dy] = 1
                queue.push([dx,dy])
            }
        }
        res++
    }
    return -1
};
```

### 单词接龙

[No127](https://leetcode-cn.com/problems/word-ladder/)

给定两个单词（beginWord 和 endWord）和一个字典，找到从 beginWord 到 endWord 的最短转换序列的长度。转换需遵循如下规则：

- 每次转换只能改变一个字母。
- 转换过程中的中间单词必须是字典中的单词。

说明:

1. 如果不存在这样的转换序列，返回 0。
2. 所有单词具有相同的长度。
3. 所有单词只由小写字母组成。
4. 字典中不存在重复的单词。
5. 你可以假设 beginWord 和 endWord 是非空的，且二者不相同。

```javascript
输入:
beginWord = "hit",
endWord = "cog",
wordList = ["hot","dot","dog","lot","log","cog"]

输出: 5

解释: 一个最短转换序列是 "hit" -> "hot" -> "dot" -> "dog" -> "cog",
     返回它的长度 5。
```

**思路**

这一题是一个更加典型的用图建模的问题。如果每一个单词都是一个节点，那么只要和这个单词仅有一个字母不同，那么就是它的相邻节点。

```javascript
/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function(beginWord, endWord, wordList) {
    let queue = [];
    let res = 2;

    queue.push(beginWord)

    while(queue.length) {
        let size = queue.length;
        while(size --) {
            let front = queue.shift();
            for(let i = 0; i < wordList.length; i++) {
                if(!isSimilar(front, wordList[i]))continue;
                if(wordList[i] === endWord) return res;
                queue.push(wordList[i]);
                wordList.splice(i, 1);
                i --;
            }
        }
        res += 1;
    }
    return 0;
};

const isSimilar = (a, b) => {
    let diff = 0
    for(let i = 0; i < a.length; i++) {
        if(a.charAt(i) !== b.charAt(i)) diff++;
        if(diff > 1) return false; 
    }
    return true;
}
```

### 打开转盘锁

[No.752](https://leetcode-cn.com/problems/open-the-lock/)

你有一个带有四个圆形拨轮的转盘锁。每个拨轮都有10个数字： '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' 。每个拨轮可以自由旋转：例如把 '9' 变为  '0'，'0' 变为 '9' 。每次旋转都只能旋转一个拨轮的一位数字。

锁的初始数字为 '0000' ，一个代表四个拨轮的数字的字符串。

列表 deadends 包含了一组死亡数字，一旦拨轮的数字和列表里的任何一个元素相同，这个锁将会被永久锁定，无法再被旋转。

字符串 target 代表可以解锁的数字，你需要给出最小的旋转次数，如果无论如何不能解锁，返回 -1。

```javascript
输入：deadends = ["0201","0101","0102","1212","2002"], target = "0202"
输出：6
解释：
可能的移动序列为 "0000" -> "1000" -> "1100" -> "1200" -> "1201" -> "1202" -> "0202"。
注意 "0000" -> "0001" -> "0002" -> "0102" -> "0202" 这样的序列是不能解锁的，
因为当拨动到 "0102" 时这个锁就会被锁定。
```

**代码**

```javascript
/**
 * @param {string[]} deadends
 * @param {string} target
 * @return {number}
 */
var openLock = function(deadends, target) {
    if(target == null) return -1
    var queue = []
    var set = new Set(deadends)
    var res = 0
    queue.push("0000")

    while(queue.length){
        var size = queue.length
        while(size--){
            var cur = queue.shift()
            if(set.has(cur)) continue
            if(cur == target) return res
            set.add(cur)
            for(var i=0;i<4;i++){
                for(var j=-1;j<2;j+=2){
                    var tmp = cur.replace(/(.)(?=[^$])/g,"$1,").split(",");//将字符串转为字符数组
                    tmp[i] = String((Number(tmp[i])+j+10)%10)
                    queue.push(tmp.join(""))
                }
            }
        }
        res++
    }
    return -1
};
```

**重要参考**

[CS-Note](https://github.com/CyC2018/CS-Notes)

