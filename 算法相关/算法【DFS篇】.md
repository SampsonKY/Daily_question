# 算法【DFS篇】

> 本文主要讲的是递归方式的 DFS 的刷题套路。

> 我们什么时候应该使用DFS呢？
>
> 当我们遇到的问题与路径相关，且不是寻找最短路径（最短路径为BFS，下次再说），或者需要遍历一个集合中的所有元素，或者是查找某一种问题的全部情况时，我们可以考虑使用DFS来求解。

## 基础

**伪代码**：

```javascript
var dfs = function(参数){
    if(返回条件成立) return 参数
    dfs(进行下一步的搜索遍历)
}
```

**思考三个问题**：

* 是否有条件不成立的信息（撞南墙）
* 是否有条件成立的信息（到终点）
* 是否需要记录节点（记轨迹）

**标记已访问节点：**

```javascript
boolean[] visited = new boolean[length] ; //数组表示，每访问过一个节点，数组将对应元素置为true

Set<类型> set = new HashSet<>() ; //建立set，每访问一个节点，将该节点加入到set中去
```

**递归调用的作用：**

- 递归调用就像是一个方向盘，用来把控下一个节点应该访问哪里
- 同时递归还可以起到一个计数器的作用，可以记录每一条岔路的信息

## 典型题目

### 岛屿数量

[No.200](https://leetcode-cn.com/problems/number-of-islands/)

给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。

```javascript
输入:
[
['1','1','1','1','0'],
['1','1','0','1','0'],
['1','1','0','0','0'],
['0','0','0','0','0']
]
输出: 1
```

```javascript
var numIslands = function(grid) {
    var res = 0
    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j <grid[0].length; j++){
            if(grid[i][j] == '1'){
                res++
                dfs(i, j, grid)
            }
        }
    }
    return res
};

var dfs = function(i, j , grid){
    //撞南墙
    if(i<0||j<0||i>=grid.length||j>=grid[0].length||grid[i][j]=='0') return;
    //记录节点轨迹，此处巧妙地将陆地变成水
    grid[i][j]='0'
    //递归调用，控制方向
    dfs(i,j+1,grid)
    dfs(i,j-1,grid)
    dfs(i-1,j,grid)
    dfs(i+1,j,grid)
}
```

### 岛屿最大面积

[No.695](https://leetcode-cn.com/problems/max-area-of-island/)

给定一个包含了一些 0 和 1 的非空二维数组 grid 。

一个 岛屿 是由一些相邻的 1 (代表土地) 构成的组合，这里的「相邻」要求两个 1 必须在水平或者竖直方向上相邻。你可以假设 grid 的四个边缘都被 0（代表水）包围着。

找到给定的二维数组中最大的岛屿面积。(如果没有岛屿，则返回面积为 0 。)

示例：

```javascript
[[0,0,1,0,0,0,0,1,0,0,0,0,0],
 [0,0,0,0,0,0,0,1,1,1,0,0,0],
 [0,1,1,0,1,0,0,0,0,0,0,0,0],
 [0,1,0,0,1,1,0,0,1,0,1,0,0],
 [0,1,0,0,1,1,0,0,1,1,1,0,0],
 [0,0,0,0,0,0,0,0,0,0,1,0,0],
 [0,0,0,0,0,0,0,1,1,1,0,0,0],
 [0,0,0,0,0,0,0,1,1,0,0,0,0]]
```

对于上面这个给定矩阵应返回 `6`。注意答案不应该是 `11` ，因为岛屿只能包含水平或垂直的四个方向的 `1` 。

```javascript
var maxAreaOfIsland = function(grid) {
    var max = 0
    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid[0].length; j++){
            if(grid[i][j] == 1){
                max = Math.max(max, dfs(i, j, grid))
            }
        }
    }
    return max
};

var dfs = function(i, j, grid,max){
    if(i<0 || i>=grid.length || j<0 || j>=grid[0].length || grid[i][j] == 0) return 0;
    grid[i][j]=0
    var count = 1
    count+=dfs(i-1,j,grid,max)
    count+=dfs(i+1, j, grid,max)
    count+=dfs(i, j-1, grid,max)
    count+=dfs(i,j+1,grid,max)
    return count
}
```

### 被围绕的区域

[No.130](https://leetcode-cn.com/problems/surrounded-regions/)

给定一个二维的矩阵，包含 'X' 和 'O'（字母 O）。

找到所有被 'X' 围绕的区域，并将这些区域里所有的 'O' 用 'X' 填充。

示例:

```javascript
X X X X
X O O X
X X O X
X O X X
```

运行你的函数后，矩阵变为：

```javascript
X X X X
X X X X
X X X X
X O X X
```

思路：从边界出发，将与边界相邻的O变为N，然后将所有O变为X，再将N变为O

```javascript
var solve = function(board) {
    var grid = board
    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j <grid[0].length; j++){
            if(i==0 || j==0 || i==grid.length-1 || j==grid[i].length-1){
                if(grid[i][j] == 'O')
                    dfs(i, j, grid)
            }
        }
    }
    for(var i=0; i < grid.length; i++){
        for(var j = 0; j <grid[0].length; j++){
            if(grid[i][j] == 'O') grid[i][j]='X'
            if(grid[i][j] == 'N') grid[i][j] = 'O'
        }
    }
};

var dfs = function(i, j , grid){
    if(i<0||j<0||i>=grid.length||j>=grid[0].length||grid[i][j]=='X'||grid[i][j] == 'N') return;
    grid[i][j] = 'N'
    dfs(i,j+1,grid)
    dfs(i,j-1,grid)
    dfs(i-1,j,grid)
    dfs(i+1,j,grid)
}
```

### 朋友圈

[No.547](https://leetcode-cn.com/problems/friend-circles/)

班上有 N 名学生。其中有些人是朋友，有些则不是。他们的友谊具有是传递性。如果已知 A 是 B 的朋友，B 是 C 的朋友，那么我们可以认为 A 也是 C 的朋友。所谓的朋友圈，是指所有朋友的集合。

给定一个 N * N 的矩阵 M，表示班级中学生之间的朋友关系。如果M[i][j] = 1，表示已知第 i 个和 j 个学生互为朋友关系，否则为不知道。你必须输出所有学生中的已知的朋友圈总数。

示例 1：

```javascript
输入：
[[1,1,0],
 [1,1,0],
 [0,0,1]]
输出：2 
解释：已知学生 0 和学生 1 互为朋友，他们在一个朋友圈。
第2个学生自己在一个朋友圈。所以返回 2 。
```

思路：将 给定的矩阵看成无向图的邻接矩阵表示，本题可转化为求无向图的连通分量个数。

```javascript
var findCircleNum = function(M) {
    var res = 0
    var visited = new Array(M.length).fill(0)
    for(var i = 0; i < M.length; i++){
        if(!visited[i]){
            dfs(visited, i, M)
            res++
        }
    }
    return res
};

var dfs = function(visited, i, M){
    visited[i] = 1
    for(var j =0; j < M.length; j++){
        if(M[i][j] == 1 && !visited[j]){
            dfs(visited, j, M)
        }
    }
}
```

### 太平洋大西洋水流问题

[No.417](https://leetcode-cn.com/problems/pacific-atlantic-water-flow/)

给定一个 m x n 的非负整数矩阵来表示一片大陆上各个单元格的高度。“太平洋”处于大陆的左边界和上边界，而“大西洋”处于大陆的右边界和下边界。

规定水流只能按照上、下、左、右四个方向流动，且只能从高到低或者在同等高度上流动。

请找出那些水流既可以流动到“太平洋”，又能流动到“大西洋”的陆地单元的坐标。

示例：

```javascript
给定下面的 5x5 矩阵:

  太平洋 ~   ~   ~   ~   ~ 
       ~  1   2   2   3  (5) *
       ~  3   2   3  (4) (4) *
       ~  2   4  (5)  3   1  *
       ~ (6) (7)  1   4   5  *
       ~ (5)  1   1   2   4  *
          *   *   *   *   * 大西洋

返回:

[[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] (上图中带括号的单元).
```

思路分析：

* 二维平面上的上下左右四个方向可以行走，与其余类似题目一样，固定的写法有
  * 表示四个方向的数组int[][] dires = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
  * 表示二维平面的行数与列数int m, n;
  * 判断某个坐标x,y是否在矩形区域内的辅助函数boolean isIn(int x, int y)

* 要同时满足可以到达大西洋与太平洋，所以一个点需要进行两次路径的行走，一次以太平洋为目标，一次以大西洋为目标。从内部的点以边界为目标去进行路径行走比较麻烦，但是如果换一个思路，从边缘往里面走。就类似于130. 被围绕的区域的第二种解法。
* 从边缘向里走就修改通行规则，要往高度比当前点高或者相等的点走。
* 定义函数dfs(int x, int y, boolean[][] canReach)，第三个参数代表大西洋/太平洋相邻的点可以访问到的点，这些点也就是可以流到相应大洋的点。
  * 首先将canReach[x][y] = true;，将当前点设置为已访问。
  * 然后对上下左右四个方向的点进行遍历，如果满足：在矩形内isIn(newX, newY)，高度比当前点更高或者相等matrix[x][y] <= matrix[newX][newY]且还没有访问过，就对其访问。
* 主函数中，首先将各个成员变量初始化。然后生成表示大西洋/太平洋访问状态的 boolean[][] canReachP/canReachA = new boolean[m][n];。然后对于矩形的上下左右四条边界的点分别调用dfs()，进行从大西洋/太平洋到内部的访问。
* 最后对二维平面内的所有点进行遍历，找到canReachA[i][j] && canReachP[i][j]的点，就是可以同时到达两个大洋。
* 时间复杂度为O(n)，因为只对每一个点进行了最多三次遍历，n表示坐标点的个数。空间复杂度除去递归调用占用的空间为O(n)。

```javascript
/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var offset = [[0,-1],[1,0],[0,1],[-1,0]];

var pacificAtlantic = function(matrix) {
    var res = [];
    if(matrix.length <=0) return res;
    // 初始化两个数组，能到达大西洋和能到达太平洋
    var m = matrix.length;
    var n = matrix[0].length;
    
    var canToWest = [];
    var canToPacific = [];
    for(let i = 0; i < m ; i++) {
        canToWest[i] = [];
        canToPacific[i] = [];
        for(let j = 0; j< n; j++) {
            canToWest[i][j] = 0;
            canToPacific[i][j] = 0;
        }
    }

    // 从能流向的往里流，最远能到达的地方，将途径的路径上的点都标为1
    for(let i = 0 ; i < n; i++) {
        dfs(matrix, 0, i, canToPacific); // 第一行能往上流流到太平洋
        dfs(matrix, m-1,i, canToWest) // 最后一行能向下到大西洋的
    }
    for(let j = 0 ; j < m; j++) {
        dfs(matrix, j,0, canToPacific); // 第一列能往左流流到太平洋
        dfs(matrix, j,n-1, canToWest) // 最后一列能向右到大西洋的
    }

    for(let i =0; i < m ;i++) {
        for(let j =0 ; j < n; j++) {
            if(canToWest[i][j] && canToPacific[i][j]) {
                res.push([i,j]);
            }
        }
    }
    return res;
};

var dfs = function(arr, x, y, visited) {
    visited[x][y] = 1;
    for(let i = 0; i < 4; i++) {
        let newX = x + offset[i][0];
        let newY = y + offset[i][1];
        if(isVaild(arr,newX,newY) && !visited[newX][newY] && arr[newX][newY] >= arr[x][y]) {
            dfs(arr, newX, newY, visited);
        }
    }
}

var isVaild = function(arr, x, y) {
    let m  = arr.length;
    let n = arr[0].length;
    return x>=0 && y>=0 && x<m && y< n;
}
```

### 克隆图

[No.133](https://leetcode-cn.com/problems/clone-graph/)

```
输入：adjList = [[2,4],[1,3],[2,4],[1,3]]
输出：[[2,4],[1,3],[2,4],[1,3]]
解释：
图中有 4 个节点。
节点 1 的值是 1，它有两个邻居：节点 2 和 4 。
节点 2 的值是 2，它有两个邻居：节点 1 和 3 。
节点 3 的值是 3，它有两个邻居：节点 2 和 4 。
节点 4 的值是 4，它有两个邻居：节点 1 和 3 。
```
> 思路：
> 1.有无终止条件（撞南墙）：当然有，遇到一个节点没有新的节点可以访问了；
>
> 2.有无成立条件（到终点）：这个没有，我们希望可以将图上的所有节点遍历一遍；
>
> 3.是否需要记录轨迹：需要，我们每次只遍历新的节点 ；
>
> 递归：
>
> 1.方向是新节点的方向
>
> 2.不需要记录信息

```javascript
/**
 * // Definition for a Node.
 * function Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

/**
 * @param {Node} node
 * @return {Node}
 */
var cloneGraph = function(node) {
    if(!node) return null
    var visited = new Map()
    var head = new Node(node.val, [])
    visited.set(node, head)
    dfs(visited, node)
    return head
};

var dfs = function(visited, node){
    if(!node) return null
    for(neighbor of node.neighbors){
        if(!visited.has(neighbor)){
            var clone = new Node(neighbor.val, [])
            visited.set(neighbor, clone)
            dfs(visited, neighbor)
        }
        visited.get(node).neighbors.push(visited.get(neighbor))
    }
}
```

### 目标和

给定一个非负整数数组，a1, a2, ..., an, 和一个目标数，S。现在你有两个符号 + 和 -。对于数组中的任意一个整数，你都可以从 + 或 -中选择一个符号添加在前面。

返回可以使最终数组和为目标数 S 的所有添加符号的方法数。

示例：

```javascript
输入：nums: [1, 1, 1, 1, 1], S: 3
输出：5
解释：

-1+1+1+1+1 = 3
+1-1+1+1+1 = 3
+1+1-1+1+1 = 3
+1+1+1-1+1 = 3
+1+1+1+1-1 = 3

一共有5种方法让最终目标和为3。
```

思路：

> 条件1：是否出现“撞南墙” ：出现了，当递归次数等于数组大小时，“撞南墙”不可以继续递归了
>
> 条件2：是否存在“终点” ：存在，当“撞南墙”的时候，累加的结果刚好等于给定的结果时，到达终点
>
> 条件3：是否需要记录轨迹：这是一个一维数组啊，没有回环，所以不需要记录
>
> 递归：
>
> 1.“方向”：两个方向：“ + ” 或者 “ - ”
>
> 2.是否需要记录信息：需要记录，记录每次递归之后和的值

```javascript
/**
 * @param {number[]} nums
 * @param {number} S
 * @return {number}
 */
var res = 0
var findTargetSumWays = function(nums, S) {
    if(nums == null) return 0
    dfs(nums,S,0,0)
    return res
};

var dfs = function(nums, s, sum, k){
    if(k==nums.length){
        if(sum==s) res++
        return 
    }
    dfs(nums,s,sum+nums[k],k+1)
    dfs(nums,s,sum-nums[k],k+1)
}
```

**重要参考**

[DFS讲解及刷题小结](https://www.cnblogs.com/handsomelixinan/p/10346065.html)

[CS-Notes]([https://github.com/CyC2018/CS-Notes/blob/master/notes/Leetcode%20%E9%A2%98%E8%A7%A3%20-%20%E6%90%9C%E7%B4%A2.md#1-%E6%9F%A5%E6%89%BE%E6%9C%80%E5%A4%A7%E7%9A%84%E8%BF%9E%E9%80%9A%E9%9D%A2%E7%A7%AF](https://github.com/CyC2018/CS-Notes/blob/master/notes/Leetcode 题解 - 搜索.md#1-查找最大的连通面积))

