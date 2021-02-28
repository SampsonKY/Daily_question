## Typescript 基础语法

### **数据类型**

```typescript
// 'xxx: number' number类型
let num: number = 123

//声明一个string类型
let str: string = 'muyy'

//声明一个布尔类型
let isBool: boolean = true

//声明Array类型
let arr:number[] = [1, 2, 3, 4, 5];
let arr2:Array<number> = [1, 2, 3, 4, 5];
let arr3:string[] = ["1","2"];
let arr4:Array<string> = ["1","2"];
let arr5: ReadonlyArray<number> = [1,2,3,4]//只读，可以用断言重写

//元祖类型
let z: [string, number];
z = ['hello', 10];

//枚举类型
enum HttpCode {
    /** 成功 */
    '200_OK' = 200,
    /** 已生成了新的资源 */
    '201_Created' = 201,
    /** 请求稍后会被处理 */
    '202_Accepted' = 202,
    /** 资源已经不存在 */
    '204_NoContent' = 204,
    /** 被请求的资源有一系列可供选择的回馈信息 */
    '300_MultipleChoices' = 300,
    /** 永久性转移 */
    '301_MovedPermanently' = 301,
    /** 暂时性转移 */
    '302_MoveTemporarily' = 302,
}
HttpCode['200_OK']
HttpCode[200]

//Any类型
let notSure:any = 10;
let notSure2:any[] = [1,"2",false];

//void类型
function warnUser(): void {
    console.log("This is my warning message");
}
let unusable: void = undefined;

//Null 和 Undefined
let u: undefined = undefined;
let n: null = null;

//nerver类型
// 推断的返回值类型为never
function error(message: string): never {
    throw new Error(message);
}
// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}

// object 类型,表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。
let obj: object = {prop: 0}
```

**注意点：**

* 所有的数字类型都是**浮点型**。支持二(0b)、八(0o)、十、十六(0x)进制。
* 可以使用**模板字符串**，定义多行文本和内嵌表达式。用反引号`包围，并且以${ expr }这种形式嵌入表达式。
* 元组类型允许表示一个**已知元素数量和类型的数组**，各元素的类型不必相同。当访问一个已知索引的元素，会得到正确的类型，当访问一个越界的元素，会使用**联合类型**替代。
* 枚举类型提供的一个便利是你可以**由枚举的值得到它的名字**。默认情况下，从0开始为元素编号。也可以手动的指定成员的数值。
* any类型为那些在**编程阶段还不清楚类型的变量指定一个类型**。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。
* 使用 any 可以很容易编写类型正确但运行时有问题的代码。若使用 any 类型，就无法使用 TypeScript提供的大量保护机制。问了解决 any 带来的问题，TypeScript 3.0引入了 unknown类型。
* 所有类型都可以赋值给**unknown**类型，但unknown 类型只能被赋予 any 和unknown 类型本身。禁止对unknown类型的值执行操作。
* void类型像是与any类型相反，它表示**没有任何类型**。 当一个函数没有返回值时，通常其返回值类型是 void。声明为void的变量只能赋予undefined和null。
* never类型表示的是那些**永不存在的值**的类型。 例如， never类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 never类型，当它们被永不为真的类型保护所约束时。
* **never类型是任何类型的子类型**，也可以赋值给任何类型；然而，没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使 any也不可以赋值给never。
* 默认情况下`null`和`undefined`是所有类型的子类型。

**类型断言**

有时候你会遇到这样的情况，你会**比TypeScript更了解某个值的详细信息**。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

类型断言有两种形式。 其一是“尖括号”语法：

```ts
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```

另一个为`as`语法：

```ts
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

**枚举的反向映射**

```ts
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

ts 可能会被编译为以下 js

```js
var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
})(Enum || (Enum = {}));
var a = Enum.A;
var nameOfA = Enum[a]; // "A"
```

### 解构

```js
//1. 数组解构
let input = [1, 2];
let [first, second] = input;

let [first, ...rest] = [1, 2, 3, 4];

//2.对象解构
let o = {
    a: "foo",
    b: 12,
    c: "bar"
};
let { a, b } = o;

//3.属性重命名
let { a: newName1, b: newName2 } = o;
//相当于
let newName1 = o.a;
let newName2 = o.b;
//如果要指定类型，需要这样
let {a, b}: {a: string, b: number} = o;

//4.默认值与缺省值
function keepWholeObject(wholeObject: { a: string, b?: number }) {
    let { a, b = 1001 } = wholeObject;
}

//5.函数声明
type C = { a: string, b?: number }
function f({ a, b }: C): void {
    // ...
}

function f({ a, b = 0 } = { a: "" }): void {
    // ...
}
f({ a: "yes" }); // ok, default b = 0
f(); // ok, default to {a: ""}, which then defaults b = 0
f({}); // error, 'a' is required if you supply an argument
```

### 函数

```typescript
// 为函数定义类型
function add(x: string = "hello", y: string): string{
    return "Hello TypeScript";
}

let add2 = function(x: string, y: string): string{
    return "Hello TypeScript";
}
//完整形态
let add2: (front: string, back: string) => string = function(x: string, y: string): string {
    return "hello world";
}

//可选参数
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}
let result1 = buildName("Bob");                  
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");  

// 默认参数
function buildName2(firstName = "鸣", lastName?: string){
    console.log(firstName + "" + lastName)
}
let res4 = buildName2("人"); // undefined人
let res5 = buildName2(undefined, "人"); // 鸣人

//剩余参数
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

#### 重载

```ts
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);

//方法重载
class Calculator {
    add(a: number, b: number): number;
    add(a: string, b: string): string;
    add(a: string, b: number): string;
    add(a: number, b: string): string;
    add(a: Combinable, b: Combinable) {
        if (typeof a === "string" || typeof b === "string") {
        	return a.toString() + b.toString();
        }
        return a + b;
    }
}
```

### 类

#### 基础

```typescript
// 类
class Person{
    name:string; // 这个是对后文this.name类型的定义
    age:number;
    static origin: number = 1; //静态属性
    constructor(name:string,age:number){
        this.name = name;
        this.age = age;
    }
    print(){
        return this.name + (this.age+Person.origin);//通过类名调用;
    }
}

let person = new Person('muyy',23)
console.log(person.print()) // muyy23
```

- 我们声明一个 Person类。这个类有4个成员：一个叫做name的属性，一个叫做age的属性，一个构造函数和一个 print方法。你会注意到，我们在引用任何一个类成员的时候都用了 this。 它表示我们访问的是类的成员。最后一行，我们使用 new构造了 Person类的一个实例。 它会调用之前定义的构造函数，创建一个 Person类型的新对象，并执行构造函数初始化它。

#### 公有，私有与受保护的修饰符

```typescript
class Animal2 {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

* 在typescript中，成员都默认为public，我们可以自由访问程序里定义的成员。

```typescript
class Animal3 {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}
new Animal3("Cat").name; // 错误: 'name' 是私有的.
```

* 当成员被标记成 private时，它就不能在声明它的类的外部访问。

```typescript
class Person2 {
    protected name: string;
    constructor(name: string) { this.name = name; }
}
class Employe extends Person2 {
    private department: string;
    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }
    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}
let h = new Employe("Howard", "Sales");
console.log(h.getElevatorPitch());
console.log(h.name); // 错误
```

* protected修饰符与 private修饰符的行为很相似，但有一点不同， protected成员在派生类中仍然可以访问。

**readonly修饰符**

你可以使用 `readonly`关键字将属性设置为只读的。 只读属性必须在**声明时或构造函数里被初始化**。

```ts
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.

//改版： 参数属性
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
```

#### 存取器

```ts
let passcode = "secret passcode";

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}
```

#### 抽象类

```ts
abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log('Department name: ' + this.name);
    }

    abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {

    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```

- 抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，**抽象类可以包含成员的实现细节**。 `abstract`关键字是用于定义抽象类和在抽象类内部定义抽象方法。
- 抽象类中的抽象方法不包含具体实现并且**必须在派生类中实现**。 抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体。 然而，抽象方法必须包含 `abstract`关键字并且**可以包含访问修饰符**。

#### 私有字段

```ts
class Person {
    #name: string;
    constructor(name: string) {
    	this.#name = name;
    }
    greet() {
    	console.log(`Hello, my name is ${this.#name}!`);
    }
}
let semlinker = new Person("Semlinker");
semlinker.#name;
// ~~~~~
// Property '#name' is not accessible outside class 'Person'
// because it has a private identifier.
```

### 接口

> TypeScript的核心原则之一是对值所具有的*结构*进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

```typescript
interface LabelValue{
    height: number;
    color?: string; //可选
    readonly width: number; //只读
}
function printLabel(labelledObj: LabelValue){
    // labelledObj.width = 100;
    console.log(labelledObj.height)
}
let x = {height: 200,width: 100}
printLabel(x);
let y:LabelValue = {height:200,width:1};
```

* 接口能够描述 JavaScript 中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，接口也可以描述函数类型。**接口就好比一个名字，用来描述某些要求。**对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。

```typescript
//函数类型
interface SearchFunc{
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
//函数的返回值类型是通过其返回值推断出来的。
mySearch = function(source: string,subString: string){ 
    return source.search(subString) !== -1;
};
//参数名字可以不匹配，但参数类型是兼容的
mySearch2 = function(src: string,sub: string){
    return src.search(sub) !== -1;
};

console.log(mySearch("鸣人","鸣")); // true
console.log(mySearch("鸣人","缨")); // false
```

* 定义的函数类型接口就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。定义后完成后，我们可以像使用其它接口一样使用这个函数类型的接口。

```typescript
//1. 索引签名，TypeScript支持两种索引签名：字符串和数字。
interface StringArray{
    [index: number]: string;
}

let MyArray: StringArray;
MyArray = ["是","云","随","风"];
console.log(MyArray[2]); // 随

//2. 数字索引的返回值必须是字符串索引返回值类型的子类型
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}

//类类型
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}
class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

* 与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如 a[10] 或 ageMap["daniel"]。 可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。
* **接口描述了类的公共部分，而不是公共和私有两部分**。 它不会帮你检查类是否具有某些私有成员。
* 接口也可以继承(extends)。一个接口可以继承多个接口，创建出多个接口的合成接口。

**额外的属性检查**

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
}

let mySquare = createSquare({ colour: "red", width: 100 });//color拼错了
```

注意传入`createSquare`的参数拼写为*`colour`*而不是`color`。 在JavaScript里，这会默默地失败。

你可能会争辩这个程序已经正确地类型化了，因为`width`属性是兼容的，不存在`color`属性，而且额外的`colour`属性是无意义的。

然而，TypeScript会认为这段代码可能存在bug。 对象字面量会被特殊对待而且会经过 **额外属性检查**，当将它们赋值给变量或作为参数传递的时候。 如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。

```ts
// error: 'colour' not expected in type 'SquareConfig'
let mySquare = createSquare({ colour: "red", width: 100 });
```

绕开这些检查非常简单。 最简便的方法是使用**类型断言**：

```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

然而，最佳的方式是能够添加一个**字符串索引签名**，前提是你能够确定这个对象可能具有某些做为特殊用途使用的额外属性。 

```ts
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any; //带有任意数量的其他属性
}
```

我们稍后会讲到索引签名，但在这我们要表示的是`SquareConfig`可以有任意数量的属性，并且只要它们不是`color`和`width`，那么就无所谓它们的类型是什么。

还有最后一种跳过这些检查的方式，这可能会让你感到惊讶，它就是**将这个对象赋值给一个另一个变量**： 因为 `squareOptions`不会经过额外属性检查，所以编译器不会报错。

```ts
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

要留意，在像上面一样的简单代码里，你可能不应该去绕开这些检查。 对于包含方法和内部状态的复杂对象字面量来讲，你可能需要使用这些技巧。

### 泛型

**泛型变量**

- T (Type) : 表示一个 Typescript 类型
- K (Key) : 表示对象中的键类型
- V (Value) : 表示对象中的值类型
- E (Element) : 表示元素类型

```typescript
//泛型函数
function identity<T>(arg: T): T {
    return arg;
}//不同于使用 any，它不会丢失信息，并且我们知道参数和返回值是同一类型
//使用 1.传入所有的参数，包括类型参数 
let output = identity<string>("myString");  // type of output will be 'string'
//2. 利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型（更普遍）
let output = identity("myString");  // type of output will be 'string'

//泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

//泛型接口
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
//等价于
let myIdentity: <T>(arg: T) => T = identity;
//等价于
let myIdentity: {<T>(arg: T): T} = identity;

//泛型约束
interface Lengthwise {
    length: number;
}
//约束泛型有一个length属性
function func<T extends Lengthwise>(arg: T): T {
    return arg.length
}
```

TypeScript 为 JavaScriopt 带来了强类型特性，这就意味着限制了类型的自由度。同一段程序，为了适应不同的类型，就可能需要写不同的处理函数——而且这些处理函数中所有逻辑完全相同，唯一不同的就是类型——这严重违反抽象和复用代码的原则。

**泛型工具类型**

相关基础知识：

- **typeof**：可以用来获取一个变量声明或对象的类型。

  ```ts
  function toArray(x: number): Array<number> {
      return [x];
  }
  typeof Func = typeof toArray; // (x: number) => number[]
  ```

- **keyof**：可以用来获取一个对象中的所有key值

  ```ts
  interface Person {
      name: string;
      age: number;
  }
  typeof K1 = keyof Person; // "name" | "age"
  ```

- **in**：用来遍历枚举类型

  ```js
  typeof Keys = "a" | "b" | "c"
  type Obj = {
      [p in Keys]: any
  }// { a: any, b: any, c: any}
  ```

- **extends**：可以通过该关键字添加泛型约束

  ```ts
  //泛型约束
  interface Lengthwise {
      length: number;
  }
  //约束泛型有一个length属性
  function func<T extends Lengthwise>(arg: T): T {
      return arg.length
  }
  ```

泛型工具链

- **Partitial**：`Partitial<T>`的作用就是将某个类型里的属性全部变为可选项`?`。

  定义：

  ```ts
  
  type Partial<T> = {
  	[P in keyof T]?: T[P];
  };
  ```

  示例：

  ```js
  interface Todo {
      title: string;
      description: string;
  }
  function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  	return { ...todo, ...fieldsToUpdate };
  }
  const todo1 = {
      title: "organize desk",
      description: "clear clutter",
  };
  const todo2 = updateTodo(todo1, {
  	description: "throw out trash",
  });
  ```

### 高级类型

#### 交叉类型(Intersection Types)

> 交叉类型是将多个类型合并为一个类型。它包含了所需的所有类型的特性。

T & U 同时是 T 和 U。

```ts
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}

class Person {
    constructor(public name: string) { }
}
interface Loggable {
    log(): void;
}
class ConsoleLogger implements Loggable {
    log() {
        // ...
    }
}
var jim = extend(new Person("Jim"), new ConsoleLogger());
var n = jim.name;
jim.log();
```

#### 联合类型（Union Types)

```ts
let v: number | string = 1;

// 如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员。可以使用类型守卫，这样就可以访问各自的属性。
interface Motorcycle {
    vType: "motorcycle"; // discriminant
    make: number; // year
}
interface Truck {
    vType: "truck"; // discriminant
    capacity: number; // in tons
}
//类型别名
type Vehicle = Motorcycle | Truck;

const EVALUATION_FACTOR = Math.PI;
function evaluatePrice(vehicle: Vehicle) {
    switch(vehicle.vType) {
        case "motorcycle":
            return vehicle.make * EVALUATION_FACTOR;
        case "truck":
			return vehicle.capacity * EVALUATION_FACTOR;
    }
	return vehicle.capacity * EVALUATION_FACTOR;
}
const myTruck: Truck = { vType: "truck", capacity: 9.5 };
evaluatePrice(myTruck);
```

### 类型守卫

> A type guard is some expression that performs a runtime check that guarantees the type in some scope. —— TypeScript官方文档

类型保护可执行运行时检查的一种表达式，用于确保该类型在一定的范围内。换句话说，类型保护可以保证一个字符串是一个字符串，尽管它的值可以是一个数值。类型保护与特性检测并不完全相同，其主要思想是**尝试检测属性、方法或原型**，以确定如何处理值。目前主要有四种方式来实现类型保护：

**in 关键字**

```ts
interface Admin {
    name: string;
    privileges: string[];
}
interface Employee {
    name: string;
    startDate: Date;
}
type UnknownEmployee = Employee | Admin;
function printEmployeeInformation(emp: UnknownEmployee) {
    console.log("Name: " + emp.name);
    if ("privileges" in emp) {
    	console.log("Privileges: " + emp.privileges);
    }
    if ("startDate" in emp) {
    	console.log("Start Date: " + emp.startDate);
    }
}
```

**typeof 关键字**

```ts
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got 	'${padding}'.`);
}
```

typeof 类型保护只支持两种形式：`typeof v === “typename”` 和 `typeof v !== typename`，typename 必须是**number、string、boolean或symbol**。但 Ts 并不会阻止你和其他字符串比较，语言不会把那些表达式识别为类型保护。

**instanceof 关键字**

```ts
interface Padder {
	getPaddingString(): string;
}
class SpaceRepeatingPadder implements Padder {
    constructor(private numSpaces: number) {}
    getPaddingString() {
    	return Array(this.numSpaces + 1).join(" ");
    }
}
class StringPadder implements Padder {
    constructor(private value: string) {}
    getPaddingString() {
    	return this.value;
    }
}
let padder: Padder = new SpaceRepeatingPadder(6);
if (padder instanceof SpaceRepeatingPadder) {
// padder的类型收窄为 'SpaceRepeatingPadder'
}
```

**自定义类型保护的类型谓词**

```ts
function isNumber(x: any): x is number {
	return typeof x === "number";
}
function isString(x: any): x is string {
	return typeof x === "string";
}
```





### 命名空间

```typescript
namespace Tools {
    const TIMEOUT = 100;

    export class Ftp {
        constructor() {
            setTimeout(() => {
                console.log('Ftp');
            }, TIMEOUT)
        }
    }

    export function parseURL(){
        console.log('parseURL');
    }
}
Tools.TIMEOUT // 报错, Tools上没有这个属性
Tools.parseURL() // 'parseURL'
```

* 在应用程序中，类和类成员的名称是丰富的，为了描述一个具体的对象，需要对类成员进行设计。在设计类和类成员过程中，不可避免的类成员中的方法或者类的名称会出现相同的情况，这样就会使类的使用变得复杂，代码的混乱造成可读性降低，使用命名空间可以解决此类难题。
* export在这里用来表示哪些功能是可以外部访问的。
* 代码可以分布在多个文件中；例如：在大型游戏软件中，对于要更新的要执行文件均比较大，而更新在同一命名空间下打包的DLL文件相对要容易一些。
* 在js中命名空间其实就是一个全局对象. 如果你开发的程序想要暴露一个全局变量就可以用namespace;

### typescript介绍与优点

* Typescript是microsoft开发和维护的一种开源编程语言。它是JavaScript的一个严格超集，并添加了可选的静态属性。
* Typescript是为开发大型应用程序而设计的，并且可以编译为JavaScript。

通过上面学习，大概可以看出使用了ts后，可以知道ts的一些优点：

* TS有清晰的函数参数/接口属性，增加了代码可读性和可维护性
* TS配合现代编辑器，各种提示 
* TS有活跃的社区
* TS是一个应用程序级的JavaScript开发语言。
* TS是JavaScript的超集，可以编译成纯JavaScript。
* TS跨浏览器、跨操作系统、跨主机，开源。
* TS始于JS，终于JS。遵循JavaScript的语法和语义，方便了无数的JavaScript开发者。
* TS可以重用现有的JavaScript代码，调用流行的JavaScript库。
* TS可以编译成简洁、简单的JavaScript代码，在任意浏览器、Node.js或任何兼容ES3的环境上运行。
* TypeScript比JavaScript更具开发效率，包括：静态类型检查、基于符号的导航、语句自动完成、代码重构等。
* TS提供了类、模块和接口，更易于构建组件。

### Typescript使用

安装：`npm install -g typescript`

编译代码：`tsc xxx.ts`

自动编译：`tsc --init`生成配置文件`tsconfig.json`，然后配合vscode

搭建脚手架：`create-react-app xxx --typescript`

### .d.ts文件

> JS 文件 + .d.ts 文件  ===  ts 文件

- .d.ts 文件可以让 JS 文件继续维持自己JS文件的身份，而拥有TS的类型保护