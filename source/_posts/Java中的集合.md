---
title: Java中的集合
date: 2021-04-17 20:55:40
tags: Java
categories: back-end
---

记述一下 Java 中的部分相关接口与具体实现类：
![](http://cdn.becase.top/20220413191250.png)

### 具体容器分类
> - 非同步集合：在并发访问的时候，是非线程安全的；但是由于它们没有同步策略(加锁机制)，它们的效率更高
> - 同步集合：对每个方法都进行同步加锁，保证线程安全

**非同步集合**：ArrayList、HashSet、HashMap、LinkedList、TreeSet、TreeMap、PriorityQueue
**同步集合**：HashTable、Vector、Stack

同步包装器 : [ Collections.synchronizedMap(), Collections.synchronizedList() ]

Java 集合类中非线程安全的集合可以用同步包装器使集合变成线程安全，其实实现原理就是相当于对每个方法加多一层同步锁而已，比如：
- HashMap --> Collections.synchronizedMap(new HashMap())
- ArrayList --> Collections.synchronizedList(new ArrayList<>())

**并发集合**：ConcurrentHashMap、ConcurrentSkipListMap、ConcurrentSkipListSet、CopyOnWriteArrayList、CopyOnWriteArraySet、ArrayBlockingQueue、LinkedBlockingQueue、PriorityBlockingQueue、LinkedBlockingDeque、ConcurrentLinkedQueue

### 同步集合类和并发集合类的区别

不管是同步集合还是并发集合他们都支持线程安全，他们之间主要的区别体现在性能和可扩展性，还有他们如何实现的线程安全。

同步集合类，Hashtable 和 Vector 还有同步集合包装类，Collections.synchronizedMap()和 Collections.synchronizedList()，相比并发的实现(比如：ConcurrentHashMap, CopyOnWriteArrayList, CopyOnWriteHashSet)会慢得多。

造成如此慢的主要原因是锁， 同步集合会把整个 Map 或 List 锁起来，每个操作都是串行的操作，同一时刻只有一个线程能操作。而并发集合不会，并发集合实现线程安全是通过使用先进的和成熟的技术把锁剥离。

比如 ConcurrentHashMap 会把整个 Map 划分成几个片段，只对相关的几个片段上锁，同时允许多线程访问其他未上锁的片段。

CopyOnWriteArrayList 允许多个线程以非同步的方式读，当有线程写的时候它会将整个 List 复制一个副本给它。如果在读多写少这种对并发集合有利的条件下使用并发集合，这会比使用同步集合更具有可伸缩性

### Queue 接口
Queue 接口包括 Collection 接口的所有方法。 这是因为 Collection 是 Queue 的超级接口。

Queue 接口的一些常用方法是：

- **add()** - 将指定的元素插入队列。如果任务成功，则 add()返回 true，否则将引发异常。
- **offer()** - 将指定的元素插入队列。如果任务成功，则 offer()返回 true，否则返回 false。
- **element()** - 返回队列的开头。如果队列为空，则引发异常。
- **peek()** - 返回队列的开头。 如果队列为空，则返回 null。
- **remove()** - 返回并删除队列的头部。如果队列为空，则引发异常。
- **poll()** - 返回并删除队列的开头。 如果队列为空，则返回 null。

### Deque 接口
在常规队列中，元素是从后面添加的，而从前面删除的。但是，在双端队列中，我们可以**从前后插入和删除元素**
![](http://cdn.becase.top/20220413190110.png)

除了 Queue 接口中可用的方法之外，Deque 界面还包括以下方法：

- **addFirst()** - 在双端队列的开头添加指定的元素。如果双端队列已满，则引发异常。
- **addLast()** - 在双端队列的末尾添加指定的元素。如果双端队列已满，则引发异常。
- **offerFirst()** - 在双端队列的开头添加指定的元素。如果双端队列已满，则返回 false。
- **offerLast()** - 在双端队列的末尾添加指定的元素。如果双端队列已满，则返回 false。
- **getFirst()** - 返回双端队列的第一个元素。如果双端队列为空，则引发异常。
- **getLast()** - 返回双端队列的最后一个元素。如果双端队列为空，则引发异常。
- **peekFirst()** - 返回双端队列的第一个元素。如果双端队列为空，则返回 null。
- **peekLast()** - 返回双端队列的最后一个元素。如果双端队列为空，则返回 null。
- **removeFirst()** - 返回并删除双端队列的第一个元素。如果双端队列为空，则引发异常。
- **removeLast()** - 返回并删除双端队列的最后一个元素。如果双端队列为空，则引发异常。
- **pollFirst()** - 返回并删除双端队列的第一个元素。如果双端队列为空，则返回 null。
- **pollLast()** - 返回并删除双端队列的最后一个元素。如果双端队列为空，则返回 null。

### LinkedList 类
Java 中的链表具体实现类，对比 ArrayList 的**增加和删除**的效率更高，而**查找和修改**的的效率较低

### ArrayDeque 类
实现了 **Queue 接口** 和 **Deque 接口**
![](http://cdn.becase.top/20220413190555.png)

### Stack 类
`Stack<T> stack = new Stack<>();`

- boolean empty()
测试堆栈是否为空。

- Object peek( )
查看堆栈顶部的对象，但不从堆栈中移除它。

- Object pop( )
移除堆栈顶部的对象，并作为此函数的值返回该对象。

- Object push(Object element)
把项压入堆栈顶部。

- int search(Object element)
返回对象在堆栈中的位置，以 1 为基数。

> Java 集合框架中没有 Stack 接口，仅有 java 早期遗留的一个 Stack 类
> - 因为集成子 Vector，所以 Stack 类是同步的，效率不高，推荐用 ArrayDeque 代替

### 参考
 [# java 栈容器_Java 并发技术栈](https://blog.csdn.net/weixin_31630721/article/details/114672989)

 [Java Queue 接口](https://www.cainiaojc.com/java/java-queue.html)
