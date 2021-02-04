# JavaScript中的对象是如何存储的

从 JavaScript 语言的角度看，JS对象像一个字典，字符串作为键名，任意对象可以作为键值，可以通过键名读写键值。 但在V8实现对象存储时，并没有完全采用字典的存储方式，主要是出于性能考虑。因为字典是非线性的数据结构，查询效率会低于线性的数据结构，V8为了提升存储和查询效率，采用了一套复杂的存储策略。

![线性结构和非线性结构](https://static001.geekbang.org/resource/image/c9/ef/c970cdc7b89bfe0a12e560fe94fcdfef.jpg?ynotemdtimestamp=1612407166483)

## 常规属性(properties)和排序属性(element)

例子：

```
function Foo() {
    this[100] = 'test-100'
    this[1] = 'test-1'
    this["B"] = 'bar-B'
    this[50] = 'test-50'
    this[9] =  'test-9'
    this[8] = 'test-8'
    this[3] = 'test-3'
    this[5] = 'test-5'
    this["A"] = 'bar-A'
    this["C"] = 'bar-C'
}
var bar = new Foo()

for(key in bar){
    console.log(`index:${key}  value:${bar[key]}`)
}
```

输出：

```
index:1  value:test-1
index:3  value:test-3
index:5  value:test-5
index:8  value:test-8
index:9  value:test-9
index:50  value:test-50
index:100  value:test-100
index:B  value:bar-B
index:A  value:bar-A
index:C  value:bar-C
```

可以看到数字属性按照大小顺序打印，字符串属性按照设置顺序打印。

- 在 ECMAScript 规范中定义了**数字属性应该按照索引值大小升序排列，字符串属性根据创建时的顺序升序排列**。把对象中的数字属性称为**排序属性**，在V8中被称为**elements**，字符串属性称为**常规属性**，V8中被称为**properties**。
- 在V8内部，为了有效提升存储和访问这两种属性的性能，分别使用了两个**线性数据结构**来分别保存排序属性和常规属性。

![V8内部对象的构造](https://static001.geekbang.org/resource/image/af/75/af2654db3d3a2e0b9a9eaa25e862cc75.jpg?ynotemdtimestamp=1612407166483)

- 可以看到 bar 对象包含了两个隐藏属性：elements属性指向elements对象，properties属性指向properties对象。
- 分解成这两种线性数据结构后，如果执行索引操作，那么V8会先从elements属性中按顺序读取所有元素，再在properties属性中读取所有元素，这样就完成了一次索引操作。

## 快属性和慢属性

- 为了加快查找属性的效率，V8**将部分常规属性直接存储到对象本身**，把这些属性称为**对象内属性**(in-object properties)。
- 对象内属性的数量是固定的，默认是10个。
- 通常**将保存在线性数据结构中的属性称之为"快属性"**，因为线性数据结构中只需要通过索引就可以访问到属性，但如果从线性结构中添加或删除大量属性时，执行效率就会非常低。
- 因此，如果一个对象属性过多，V8就会采取另一种存储策略，即**慢属性**策略，但**慢属性的对象内部会有独立的非线性数据结构(词典）作为属性存储容器**。所有的属性元信息不再是线性存储的，而是直接保存在属性字典中。 ![慢属性是如何存储的](https://static001.geekbang.org/resource/image/e8/17/e8ce990dce53295a414ce79e38149917.jpg?ynotemdtimestamp=1612407166483)

## 总结

- 在V8中，对象主要由三个指针构成，分别是隐藏类（Hidden Class), properties, elements。其中隐藏类用于描述对象的结构。properties和elements用于存放对象的属性，它们的区别主要体现在键名能否被索引。
- 可索引属性（数字属性）会被存储到elements指针指向的区域，命名属性（常规属性）会被存储到 properties指针指向的区域。事实上，这是为了满足ECMA规范要求所设计的，即索引属性按照索引值大小升序排列，命名属性根据创建的顺序升序排列。
- V8中命名属性有三种不同的存储方式：对象内属性、快属性和慢属性。对象内属性保存在对象本身，提供最快的访问速度；快属性比对象属性多了一次寻址时间；慢属性会将属性的完整结构存储（另外两种属性的结构会在隐藏类中描述），速度最慢。
- 对象内属性和快属性实际上是一致的。只不过，对象内属性在对象创建时就固定分配了，空间有限。当对象内属性放满后，会以快属性的方式，在properties下按创建顺序存放。相较于对象内属性，快属性需要额外多一次properties的寻址时间，之后便是与对象内属性一致的线性查找。
- 当一个对象属性过多时，慢属性的对象采用哈希存取结构了。