### Java多线程, 并发

#### 并发与并行

并行是让不同的代码片段同时在不同的物理处理器上执行。并行的关键是同时做很多事情，而并发是指同时管理很多事情，这些事情可能只做了一半就被暂停去做别的事情了。

在很多情况下，并发的效果比并行好，因为操作系统和硬件的总资源一般很少，但能支持系统同时做很多事情。“使用较少的资源做更多的事情”的哲学

#### 线程的状态

```java
//创建线程
NEW,

//执行
RUNNABLE,

//阻塞状态
BLOCKED,

//等待
WAITING,

//超时等待
TIMED_WAITING,

//终止线程
TERMINATED;
```

#### 创建线程的三种方式

```java
package com.example.ThreadDemo;

public class MyThreadDemo {
    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        new Thread( ()->{
            myThread.start();
        },Thread.currentThread().getName()).start();

        new Thread(myThread).start();
    }
}

class MyThread extends Thread{
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + "继承Thread类新建线程");
    }
}
```

```java
package com.example.ThreadDemo;

public class MyRunnableDemo {
    public static void main(String[] args) {
        MyRunnable myRunnable = new MyRunnable();
        new Thread( ()->{
            myRunnable.run();
        },Thread.currentThread().getName()).start();

        new Thread(myRunnable).start();
    }
}

class MyRunnable implements Runnable{

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + "实现Runnable接口新建线程");
    }
}
```

Callable创建线程

Callable接口类似Runnable，都是为其实例可能由另一个线程执行的类设计的。Runnable不返回任何结果，也不会抛出被检查的异常。重写的方法不同，Runnable从新run方法，Callable重写Call方法。

创建新的线程的时候，new Thread不支持Callable参数，所以，需要使用FutureTask来转换一下，使new Thread支持实现Callable函数的线程。

```java
package com.example.ThreadDemo;

import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

public class CallableDemo {
    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        FutureTask futureTask = new FutureTask(myThread);
        new Thread(futureTask,"callable").start();
        
        //获取callable的返回结果,get()方法会产生阻塞
        String o = (String) futureTask.get();
        System.out.println(o);
    }
}
class MyThread implements Callable<String>{

    @Override
    public String call() throws Exception {
        System.out.println("执行了callable的线程");
        return "call()方法";
    }
}
```

#### wait和sleep的区别

1、来自不同的包

wait => Object

sleep => Thread

2、关于锁的释放

wait 会释放锁子

sleep 不会释放锁，可以理解为睡着了，不再管理锁

3、使用范围不同。

wait必须要在同步代码块中

sleep可以在程序的任何地方调用

4、是否捕获异常

wait 不需要捕获异常

sleep 必须要捕获异常

#### yield线程礼让

```java
package com.example.ThreadDemo;

/**
 * yield() 礼让不一定成功
 */

public class MyThreadDemo {

    public static void main(String[] args) {


        MyThread myThread = new MyThread();
        new Thread( ()->{
            myThread.start();
        },Thread.currentThread().getName()).start();

        new Thread(myThread).start();
    }
}

class MyThread extends Thread{
    @Override
    public void run() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        System.out.println(Thread.currentThread().getName() + " => 开始执行");
        Thread.yield();
        System.out.println(Thread.currentThread().getName() + " +> 结束执行");
    }
}
```

#### Join线程合并

线程插队，待当前Join插入线程执行结束后再执行其他线程，当前线程执行期间，其他线程是阻塞状态

```java
package com.example.ThreadDemo;

import java.util.concurrent.TimeUnit;

public class JoinDemo {
    public static void main(String[] args) throws InterruptedException {
        JoinThread myThread = new JoinThread();
        myThread.start();

        for (int i = 0; i < 10; i++) {
            if(i == 5)
                //当主线程执行到这里的时候开始阻塞，等待插入的线程myThread执行结束后继续往下执行;
                myThread.join();
            System.out.println(" i => " + i);
        }
    }
}

class JoinThread extends Thread{

    @Override
    public void run() {
        try {
            TimeUnit.SECONDS.sleep(5);
            System.out.println("Join线程执行");
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

#### 线程的优先级

使用 setPriority()来设置线程的优先级。默认是5，最大是10，优先级越高越先执行。

#### 守护线程

java里线程分2种， 1、守护线程，比如垃圾回收线程，就是最典型的守护线程。 2、用户线程，就是应用程序里的自定义线程。守护线程是指为其他线程服务的线程。在JVM中，所有非守护线程都执行完毕后，无论有没有守护线程，虚拟机都会自动退出。

setDaemon（）来设置守护线程。

#### Synchronized锁

ReentrantLock（）分公平锁和非公平锁，公平锁就是按照请求顺序依次获取资源执行代码。非公平锁可以插队，获取资源执行代码。Java默认ReentrantLock是非公平锁，可以传入一个bool值，来改变ReentantLock的默认类型。

#### Synchronized和Lock区别

1、Synchronized是java内置关键字，Lock是一个Java的类 

2、Synchronized无法判断获取锁的状态，Lock 可以判断是否获取到了锁

3、Synchronized会自动释放锁子，Lock锁要手动释放

4、Synchronized 可重入锁，不可以中断，非公平，Lock锁也是可重入锁，可以判断锁来中断，可以设置公平或者非公平。

5、使用范围不同，Synchronized适合锁少量的代码同步问题，Lock适合锁大量的代码同步。

6、Synchronized 如果线程获得锁后会一直阻塞，其他线程会一直等待，知道前一个线程结束。Lock锁不会一定会一直等待。

```java
package com.example.LockDemo;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockDemo {
    private int bean = 5000;
    Lock lock = new ReentrantLock();
    public synchronized void eat(){
        try {
            lock.lock();
            if(bean > 0)
                System.out.println(Thread.currentThread().getName() + " => :" + bean--);
        }catch (Exception e){
            e.printStackTrace();
        }
        finally {
            lock.unlock();
        }
    }

    public void testLock(){
        new Thread(() -> {
            for (int i = 0; i < 5000; i++) {
                eat();
            }
        },"LockA").start();

        new Thread(() -> {
            for (int i = 0; i < 5000; i++) {
                eat();
            }
        },"LockB").start();

        new Thread(() -> {
            for (int i = 0; i < 5000; i++) {
                eat();
            }
        },"LockC").start();
    }

    public static void main(String[] args) {
        LockDemo l1 = new LockDemo();
        l1.testLock();
    }
}
```

```java
package com.example.LockDemo;

public class SynchronizedDemo {
    private int bean = 5000;
    public synchronized void eat(){
        if(bean > 0)
            System.out.println(Thread.currentThread().getName() + " => :" + bean--);
    }

    public void testSynchronized(){
        new Thread(() -> {for (int i = 0; i < 5000; i++) eat();},"A").start();
        new Thread(() -> {for (int i = 0; i < 5000; i++) eat();},"B").start();
        new Thread(() -> {for (int i = 0; i < 5000; i++) eat();},"C").start();
    }

    public static void main(String[] args) {
        SynchronizedDemo synchronizedDemo = new SynchronizedDemo();
        synchronizedDemo.testSynchronized();
    }
}
```

#### 集合安全问题

ArrayList<>()安全问题

在单线程下是安全的，在多线程情况下他是不安全的，解决办法，

1、使用vector<>()来代替arrayList()<>

2、使用Collections.synchronizedList(new ArrayList<>());  //使用synchronized锁，效率比较低

3、使用CopyOnWriteArrayList<>()； //List<String> list = new CopyOnWriteArrayList<>()；



set的问题和List一样，存在多线程不安全的问题，多线程情况下，解决方案也是一样的。

hashSet底层：hashSet底层是一个HashMap<>()；



#### CountDownLatch类

CountDownLatch本质是一个减法计数器，等计数器清空后，代码继续往下执行，可以通过下面代码来执行

```java
package com.example.Auxiliary;

import java.util.concurrent.CountDownLatch;

public class countDownLatchDemo {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(6);
        for (int i = 0; i < 6; i++) {
            new Thread(() -> {
                countDownLatch.countDown();
                System.out.println(Thread.currentThread().getName());
            },String.valueOf(i)).start();
        }

        countDownLatch.await();
        System.out.println("进程结束");
    }
}
```

#### CyclicBarrier类

可以理解为是一个加法计数器，等其他线程达到计数器的数后，继续往下执行.

```java
package com.example.Auxiliary;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierDemo {
    public static void main(String[] args) throws BrokenBarrierException, InterruptedException {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(7,() -> {
            System.out.println("进程结束");
        });

        for (int i = 0; i <= 6; i++) {
            final int temp = i;
            new Thread( () -> {
                System.out.println(Thread.currentThread().getName());
                try {
                    cyclicBarrier.await();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } catch (BrokenBarrierException e) {
                    throw new RuntimeException(e);
                }
            },String.valueOf(temp)).start();
        }

    }
}
```

#### Semaphore类

```java
package com.example.Auxiliary;

import java.util.concurrent.Semaphore;

public class SemaphoreDemo {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(3);
        for (int i = 0; i < 9; i++) {
            int temp = i;
            new Thread(() -> {
                try {
                    semaphore.acquire();
                    System.out.println("拿到信号量"+ temp);
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }finally {
                    semaphore.release();
                    System.out.println("释放信号量 =>" + temp);
                }
            },String.valueOf(temp)).start();
        }
    }
}
```

#### ReadWriteLock读写锁

```java
package com.example.LockDemo;

import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteLockDemo {
    public static void main(String[] args) {

        ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

        readWriteLock.readLock().lock();
        System.out.println("开启读锁");
        readWriteLock.readLock().unlock();
        System.out.println("关闭读锁");
        readWriteLock.writeLock().lock();
        System.out.println("开启写锁");
        readWriteLock.writeLock().unlock();
        System.out.println("关闭写锁");
    }
}
```

#### 队列BlockingQueue

当队列是空的，读将被阻塞。当队列满的时候，写是阻塞的。

```java
package com.example.QueueDemo;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * 使用add(),remove()函数操作队列的时候，如果队列为空或者满会报错；使用offer(),poll()函数操作队列，不会抛出异常，终止程序
 * 使用element()函数检测队首元素，如果不存在，抛出异常，和peek()函数检测队首元素，如果不存在不会抛出异常
 * 使用put()函数添加，take()函数取出来队列元素的的时候，如果队列没有足够的元素，将一直阻塞在这里。
 * 使用offer(),poll()函数操作队列的时候，可以设定超时时间，到时间后结束操作。
 */
public class BlockingQueueDemo {
    public static void main(String[] args) throws InterruptedException {
        createQueue2();
    }

    public static void createQueue(){
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue<>(3);
        System.out.println(blockingQueue.add("1"));
        System.out.println(blockingQueue.add("2"));
        blockingQueue.remove();
        System.out.println(blockingQueue.add("4"));
        System.out.println(blockingQueue);
    }

    public static void createQueue2() throws InterruptedException {
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue<>(2);
        System.out.println(blockingQueue.offer("a"));
        blockingQueue.poll();
        blockingQueue.poll(2, TimeUnit.SECONDS);
    }

    public static void createQueue3() throws InterruptedException {
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue<>(2);
        blockingQueue.offer("a",2,TimeUnit.SECONDS);
        blockingQueue.poll(2,TimeUnit.SECONDS);
    }
}
```

#### 同步队列SynchronousQueue

（向上造型也叫做向上类型转换或自动类型转换，即父类的引用指向子类的对象。将子类对象的类型转换成父类的类型。

向下造型也叫做向下类型转换或强制类型转换，即子类的引用指向父类的对象。将父类对象的类型转换成子类的类型。）



同步队列SynchronousQueue继承了阻塞队列BlockingQueue，

同步队列和其他的BlockingQueue的区别是，SynchronousQueue不存储元素

put了一个元素，必须从里面take取出来，否则不能再put进去元素

```java
package com.example.QueueDemo;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.SynchronousQueue;

public class SynchronousQueueDemo {
    public static void main(String[] args) {

        SynchronousQueue synchronousQueue = new SynchronousQueue<>();

        //向上造型也叫做向上类型转换或自动类型转换，即父类的引用指向子类的对象。将子类对象的类型转换成父类的类型。
        BlockingQueue synchronousQueue2 = new SynchronousQueue();

        new Thread(()->{
            try {
                Thread.sleep(2000);
                synchronousQueue.put("a");
                System.out.println(Thread.currentThread().getName() + " put a");
                Thread.sleep(2000);
                synchronousQueue.put("b");
                System.out.println(Thread.currentThread().getName() + " put b");
                Thread.sleep(2000);
                synchronousQueue.put("c");
                System.out.println(Thread.currentThread().getName() + " put c");
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }).start();


        new Thread(()->{
            try {
                System.out.println(Thread.currentThread().getName() + "=>" + synchronousQueue.take());
                System.out.println(Thread.currentThread().getName() + "=>" + synchronousQueue.take());
                System.out.println(Thread.currentThread().getName() + "=>" + synchronousQueue.take());
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }).start();
    }
}
```

#### 线程池

线程池不允许使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式，这样 的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险。 

说明：Executors 返回的线程池对象的弊端如下： 

1）FixedThreadPool 和 SingleThreadPool: 允许的请求队列长度为 Integer.MAX_VALUE，可能会堆积大量的请求，从而导致 OOM。 

2）CachedThreadPool 和 ScheduledThreadPool: 允许的创建线程数量为 Integer.MAX_VALUE，可能会创建大量的线程，从而导致 OOM。

四种创建线程池方法的区别：

SingleThreadPool:	线程池只有一个线程

FixedThreadPool： 指定线程池中线程的个个数

CachedThreadPool： 理论上，可以创建21亿个线程

 ScheduledThreadPool：创建一个定长的线程池，而且支持定时的以及周期性的任务执行，支持定时及周期性任务执行。

```java
package com.example.Pool;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


/**
 *  当线程池已经满了，仍然有请求进来，会按照预先设定的拒绝策略来处理这些请求。拒绝策略有以下四种：
 *  1、new ThreadPoolExcutor.AbortPolicy();  //抛出异常，终止程序
 *  2、new ThreadPoolExcutor.CallerUnsPolicy();  //讲请求退还给上一个函数来执行
 *  3、new ThreadPoolExcutor.DiscardPolicy();    //丢弃这些请求，不会抛出异常
 *  4、new ThreadPoolExcutor.DiscardOldestPolicy();  //尝试与最先使用的线程通信，如果线程已经释放，则分配给在阻塞队列的请求，如果线程没有释放，则会丢弃请求，不会抛出异常
 */

public class PoolDemo {
    public static void main(String[] args) {
        //创建线程池
        ExecutorService executorService1 = Executors.newFixedThreadPool(20);

        //CPU密集型工程需要获取cpu核数，来设置线程池最大线程数量
        //IO密集型工程需要先确定io的线程数量，再设置一倍的线程冗余来执行其他工程
        int cpuCore = Runtime.getRuntime().availableProcessors();
        System.out.println("CPU 核心数量: " + cpuCore);
        
        //创建自定义线程池:推荐方案
        ExecutorService executorService = new ThreadPoolExecutor(
            	3,
                cpuCore,
                3,
                TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(3),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.CallerRunsPolicy()); //拒绝策略
        

        for (int i = 0; i < 20; i++) {
            executorService.execute(()->{
                System.out.println(Thread.currentThread().getName());
            });
        }
        //关闭线程池
        executorService.shutdown();
    }
}
```

#### 函数式接口

函数式接口：只有一个方法（函数）的接口。它可以简化编程模型。

四大函数式接口：Consumer，Function，Predicate，Supplier

#### ForkJoin并发

Fork/Join是一种基于“分治”的算法：通过分解任务，并行执行，最后合并结果得到最终结果。

`ForkJoinPool`线程池可以把一个大任务分拆成小任务并行执行，任务类必须继承自`RecursiveTask`或`RecursiveAction`。

使用Fork/Join模式可以进行并行计算以提高效率。



在实际使用过程中，这种 「 分而治之 」的方法意味着框架首先要 `fork` ，递归地将任务分解为较小的独立子任务，直到它们足够简单以便异步执行。然后，`join` 部分开始工作，将所有子任务的结果递归地连接成单个结果，或者在返回 void 的任务的情况下，程序只是等待每个子任务执行完毕。

为了提供有效的并行执行，fork/join 框架使用了一个名为 `ForkJoinPool` 的线程池，用于管理 `ForkJoinWorkerThread` 类型的工作线程。

ForkJoinPool 线程池

`ForkJoinPool` 是 fork/join 框架的核心，**是 ExecutorService的一个实现**，用于管理工作线程，并提供了一些工具来帮助获取有关线程池状态和性能的信息。

工作线程一次只能执行一个任务。

`ForkJoinPool` 线程池并不会为每个子任务创建一个单独的线程，相反，池中的每个线程都有自己的双端队列用于存储任务 （ double-ended queue ）( 或 deque，发音 `deck` ）。

这种架构使用了一种名为工作窃取（ work-stealing ）算法来平衡线程的工作负载。

工作窃取（ work-stealing ）算法

要怎么解释 「 工作窃取算法 」 呢 ？

简单来说，就是 空闲的线程试图从繁忙线程的 deques 中 \*窃取\* 工作。

默认情况下，每个工作线程从其自己的双端队列中获取任务。但如果自己的双端队列中的任务已经执行完毕，双端队列为空时，工作线程就会从另一个忙线程的双端队列尾部或全局入口队列中获取任务，因为这是最大概率可能找到工作的地方。

这种方法最大限度地减少了线程竞争任务的可能性。它还减少了工作线程寻找任务的次数，因为它首先在最大可用的工作块上工作。

ForkJoinPool 线程池的实例化

Java 8

在 Java 8 中，创建 ForkJoinPool 实例的最简单的方式就是使用其静态方法 commonPool()。

`commonPool()` 静态方法，见名思义，就是提供了对公共池的引用，公共池是每个 ForkJoinTask 的默认线程池。

根据 Oracle 的官方文档，使用预定义的公共池可以减少资源消耗，因为它会阻止每个任务创建一个单独的线程池。

```java
ForkJoinPool commonPool = ForkJoinPool.commonPool();
```

Java 7

如果要在 Java 7 中实现相同的行为，则需要通过创建 ForkJoinPool 的实例并将其赋值给实用程序类的公共静态字段。

```java
public static ForkJoinPool forkJoinPool = new ForkJoinPool(2);
```

使用构造函数实例化 ForkJoinPool 时，可以创建具有指定级别的并行性，线程工厂和异常处理程序的自定义线程池。在上面的示例中，线程池的并行度级别为 2 ，意味着线程池将使用 2 个处理器核心。

然后就可以通过这个公共静态字段轻松的访问 ForkJoinPool 的实例

```java
ForkJoinPool forkJoinPool = PoolUtil.forkJoinPool;
```

ForkJoinTask<V>

`ForkJoinTask` 是 `ForkJoinPool` 线程之中执行的任务的基本类型。我们日常使用时，一般不直接使用 `ForkJoinTask` ，而是扩展它的两个子类中的任意一个

1. 任务不返回结果 ( 返回 `void` ） 的 `RecursiveAction`
2. 返回值的任务的 `RecursiveTask <V>`

这两个类都有一个抽象方法 `compute()` ，用于定义任务的逻辑。

我们所要做的，就是继承任意一个类，然后实现 `compute()` 方法。

RecursiveAction 使用示例

出于演示目的，示例当然是尽可能的简单，因此，我们的示例，执行了一个比较荒谬的任务：将输入转为大写并记录。

所有的代码如下所示

```java
public class CustomRecursiveAction extends RecursiveAction {

    private String workload = "";
    private static final int THRESHOLD = 4;

    private static Logger logger = 
      Logger.getAnonymousLogger();

    public CustomRecursiveAction(String workload) {
        this.workload = workload;
    }

    @Override
    protected void compute() {
        if (workload.length() > THRESHOLD) {
            ForkJoinTask.invokeAll(createSubtasks());
        } else {
           processing(workload);
        }
    }

    private List<CustomRecursiveAction> createSubtasks() {
        List<CustomRecursiveAction> subtasks = new ArrayList<>();

        String partOne = workload.substring(0, workload.length() / 2);
        String partTwo = workload.substring(workload.length() / 2, workload.length());

        subtasks.add(new CustomRecursiveAction(partOne));
        subtasks.add(new CustomRecursiveAction(partTwo));

        return subtasks;
    }

    private void processing(String work) {
        String result = work.toUpperCase();
        logger.info("This result - (" + result + ") - was processed by "
          + Thread.currentThread().getName());
    }
}
```

在这个示例中，我们使用了一个字符串类型 ( String ) 的名为 `workload` 属性来表示要处理的工作单元。

同时，为了演示 fork/join 框架的 fork 行为，在该示例中，如果 `workload.length()` 大于指定的阈值，那么就使用 `createSubtask()` 方法拆分任务。

在 `createSubtasks()` 方法中，输入的字符串被递归地划分为子串，然后创建基于这些子串的 `CustomRecursiveTask` 实例。

当递归分割字符串完毕时，`createSubtasks()` 方法返回 `List<CustomRecursiveAction>` 作为结果。

然后在 `compute()` 方法中使用 `invokeAll()` 方法将任务列表提交给 `ForkJoinPool` 线程池。

我们来总结下创建 RecursiveAction 的步骤：

1. 创建一个表示工作总量的对象
2. 选择合适的阈值
3. 定义分割工作的方法
4. 定义执行工作的方法

类似的，我们可以使用相同的方式开发自己的 `RecursiveAction` 类。

RecursiveTask<V> 使用示例

对于有返回值的任务，除了将每个子任务的结果在一个结果中合并，其它逻辑和 `RecursiveAction` 都差不多。

```java
public class CustomRecursiveTask extends RecursiveTask<Integer> {
    private int[] arr;

    private static final int THRESHOLD = 20;

    public CustomRecursiveTask(int[] arr) {
        this.arr = arr;
    }

    @Override
    protected Integer compute() {
        if (arr.length > THRESHOLD) {
            return ForkJoinTask.invokeAll(createSubtasks())
              .stream()
              .mapToInt(ForkJoinTask::join)
              .sum();
        } else {
            return processing(arr);
        }
    }

    private Collection<CustomRecursiveTask> createSubtasks() {
        List<CustomRecursiveTask> dividedTasks = new ArrayList<>();
        dividedTasks.add(new CustomRecursiveTask(
          Arrays.copyOfRange(arr, 0, arr.length / 2)));
        dividedTasks.add(new CustomRecursiveTask(
          Arrays.copyOfRange(arr, arr.length / 2, arr.length)));
        return dividedTasks;
    }

    private Integer processing(int[] arr) {
        return Arrays.stream(arr)
          .filter(a -> a > 10 && a < 27)
          .map(a -> a * 10)
          .sum();
    }
}
```

在上面这个示例中，任务由存储在 `CustomRecursiveTask` 类的 `arr` 字段中的数组表示。

`createSubtask()` 方法递归地将任务划分为较小的工作，直到每个部分小于阈值。然后，`invokeAll()`方法将子任务提交给公共拉取并返回 Future 列表。

要触发执行，需要为每个子任务调用 `join()` 方法。

上面这个示例中，我们使用了 Java 8 的流 ( Stream ) API ， `sum()` 方法用于将子结果组合到最终结果中。

将任务提交到 ForkJoinPool 线程池中

只要使用很少的方法，就可以把任务提交到 ForkJoinPool 线程池中。

1. `submit()` 或 `execute()` 方法

   这两个方法的调用方式是相同的

   ```
   forkJoinPool.execute(customRecursiveTask);
   int result = customRecursiveTask.join();
   ```

2. 使用 `invoke()` 方法 `fork` 任务并等待结果，不需要任何手动连接 ( join )

   ```
   int result = forkJoinPool.invoke(customRecursiveTask);
   ```

3. `invokeAll()` 方法是将 ForkJoinTasks 序列提交给 ForkJoinPool 的最方便的方法。它将任务作为参数 ( 两个任务，var args 或集合 ），`fork` 它们，并按照生成它们的顺序返回 Future 对象的集合。

4. 或者，我们还可以使用单独的 `fork()` 和 `join()` 方法。

   - `fork()` 方法将任务提交给线程池，但不会触发任务的执行。

   - `join()` 方法则用于触发任务的执行。在 `RecursiveAction` 的情况下，join() 返回 null，但对于 `RecursiveTask<V>` ，它返回任务执行的结果。

     customRecursiveTaskFirst.fork(); result = customRecursiveTaskLast.join();

上面的 `RecursiveTask<V>` 示例中，我们使用 `invokeAll()` 方法向线程池提交一系列子任务。同样的工作，也可以使用 `fork()` 和 `join()` 来完成，但这可能会对结果的排序产生影响。

为了避免混淆，当涉及到多个任务且要保证任务的顺序时，通常都是使用 `ForkJoinPool.invokeAll()` 。

结束语

使用 fork/join 框架可以加速处理大型任务，但要实现这一结果，应遵循一些指导原则：

- 使用尽可能少的线程池。绝大多数情况下，最好的决定是每个应用程序或系统只使用一个线程池。 (是线程池而不是线程)。
- 当不需要任何调整时，使用默认的公共线程池。
- 使用合理的阈值。将 ForkJoingTask 任务拆分为子任务。
- 避免在 ForkJoingTasks 中出现任何阻塞

计算0到10亿的累计和；

```java
package com.example.ThreadDemo;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;
import java.util.concurrent.RecursiveTask;
import java.util.stream.LongStream;

public class ForkJoinDemo extends RecursiveTask<Long> {
    private Long start;
    private Long end;
    private Long temp = 10000L;

    public ForkJoinDemo(Long start,Long end){
        this.start = start;
        this.end = end;
    }

    @Override
    protected Long compute() {
        if((end - start) < temp){
            Long sum = 0L;
            for (Long i = start; i <= end; i++) sum += i;

            System.out.println(sum);
            return sum;
        }else {
            long middle = (start + end) / 2;
            ForkJoinDemo task1 = new ForkJoinDemo(start,middle);
            //拆分任务
            task1.fork();
            ForkJoinDemo task2 = new ForkJoinDemo(middle + 1,end);
            //拆分任务
            task2.fork();
            return task1.join() + task2.join();
        }
    }

    //For循环解决
    public static void test1(){
        long start = System.currentTimeMillis();
        Long sum = 0L;
        for (Long i = 1L; i <= 10_0000_0000L; i++) sum += i;

        long end = System.currentTimeMillis();
        System.out.println("test1() sum => " + sum + " => ;时间: " + (end - start));
    }

    //ForkJoinTask
    public static void test2() throws ExecutionException, InterruptedException {
        long start = System.currentTimeMillis();

        ForkJoinPool forkJoinPool = new ForkJoinPool();
        ForkJoinTask<Long> task = new ForkJoinDemo(0L, 10_0000_0000L);
        ForkJoinTask<Long> submit = forkJoinPool.submit(task);
        Long sum = submit.get();

        long end = System.currentTimeMillis();
        System.out.println("test2() sum => " + sum + " => ;时间: " + (end - start));
    }

    //流式计算，效率最高
    public static void test3(){
        long start = System.currentTimeMillis();
        long sum = LongStream.rangeClosed(0L, 10_0000_0000L).parallel().reduce(0, Long::sum);
        long end = System.currentTimeMillis();

        System.out.println("test3() sum => " + sum + " => ;时间: " + (end - start));
    }


    public static void main(String[] args) throws ExecutionException, InterruptedException {
        test3();
    }
}
```

Forjoin总结：

**通过 「 分而治之 」的方法分解任务，并行执行，最后合并结果得到最终结果。通过创建一个ForkJoinPool线程池（ForJoinPool是ExecutorService的一个实现类），线程池有若干线程，每个线程一次执行一个任务，每个线程有自己的双向队列，在这里使用了一个工作窃取（ work-stealing ）的算法来实现工作的负载均衡。如果自己的双端队列中的任务已经执行完毕，双端队列为空时，工作线程就会从另一个忙线程的双端队列尾部或全局入口队列中获取任务来执行。 ForkJoinTask线程之中执行的任务的基本类型，通常我们在使用的使用的时候，不是使用ForkJoinTask，而是使用两个实现了ForkJoinTask接口的类，一个是有返回值的`RecursiveTask<T>`,一个是没有返回值的`RecursiveAction`**

#### Java异步回调

```java
package com.example.Future;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class FutureDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {

        CompletableFuture<Void> completableFuture = CompletableFuture.runAsync( ()->{
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println(Thread.currentThread().getName() + " => runAsync() 无返回值 ");
        });
        System.out.println(" => main线程: ");

        //阻塞获取执行结果
        completableFuture.get();
        /*************************************************************************/
        CompletableFuture<Integer> completableFuture2 = CompletableFuture.supplyAsync( ()-> {
            try {
                Thread.sleep(4000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println(Thread.currentThread().getName() + " => supplyAsync() 有返回值 ");
            return 0;
        });
        System.out.println("返回值是 => " + completableFuture2.get());
        //如果返回失败的话执行下面代码
        completableFuture2.whenComplete((t,u)->{
            System.out.println("t => " + t);
            System.out.println("u => " + u);
        }).exceptionally(e -> {
            e.getMessage();
            return -1;
        }).get();
    }
}
```

#### JMM和Volatile 

Java虚拟机规范中定义了Java内存模型（Java Memory Model，JMM），用于屏蔽掉各种硬件和操作系统的内存访问差异，以实现让Java程序在各种平台下都能达到一致的并发效果，JMM规范了Java虚拟机与计算机内存是如何协同工作的：规定了一个线程如何和何时可以看到由其他线程修改过后的共享变量的值，以及在必须时如何同步的访问共享变量。

原始的Java内存模型存在一些不足，因此Java内存模型在Java1.5时被重新修订。这个版本的Java内存模型在Java8中仍然在使用。

Java内存模型（不仅仅是JVM内存分区）：调用栈和本地变量存放在线程栈上，对象存放在堆上。



Volatile 是Java虚拟机提供轻量级的同步机制；作用：

1、保证可见性；

2、不保证原子性；例如开启多线程同时对一个变量进行加法，最后的结果是不确定的。

3、禁止指令重排；



当一个Java线程把主存的变量加载到线程操作的时候，另一个Java线程再把变量加载到另一个线程中，当第一个线程已经修改变量返回的时候，另一个线程获取并修改的仍然是原来的数据，无法同步。当使用Volatile关键字的时候，当第一个线程加载主存变量，并且修改的时候，会及时同步到主存和另一线程中的这个变量。

#### CAS问题

CAS的全称是compare and swap，它是java同步类的基础，java.util.concurrent中的同步类基本上都是使用CAS来实现其原子性的。

CAS的原理其实很简单，为了保证在多线程环境下我们的更新是符合预期的，或者说一个线程在更新某个对象的时候，没有其他的线程对该对象进行修改。在线程更新某个对象（或值）之前，先保存更新前的值，然后在实际更新的时候传入之前保存的值，进行比较，如果一致的话就进行更新，否则失败。

注意，CAS在java中是用native方法来实现的，利用了系统本身提供的原子性操作。

比较当前Java线程工作内存中的值和主存中的值，如果这个值是期望的，那么则执行操作！如果不是就一直循环！

1、循环会耗时

2、一次性只能保证一个共享变量的原子性

3、ABA问题



Java实现CAS的原理 - Unsafe类

前面提到，CAS是一种原子操作。那么Java是怎样来使用CAS的呢？我们知道，在Java中，如果一个方法是native的，那Java就不负责具体实现它，而是交给底层的JVM使用c或者c++去实现。

在Java中，有一个`Unsafe`类，它在`sun.misc`包中。它里面是一些`native`方法，其中就有几个关于CAS的：

```java
boolean compareAndSwapObject(Object o, long offset,Object expected, Object x);
boolean compareAndSwapInt(Object o, long offset,int expected,int x);
boolean compareAndSwapLong(Object o, long offset,long expected,long x);
```

当然，他们都是`public native`的。

`Unsafe中对CAS的实现是C++写的，它的具体实现和操作系统、CPU都有关系。`

Linux的X86下主要是通过`cmpxchgl`这个指令在CPU级完成CAS操作的，但在多处理器情况下必须使用`lock`指令加锁来完成。当然不同的操作系统和处理器的实现会有所不同，大家可以自行了解。

当然，Unsafe类里面还有其它方法用于不同的用途。比如支持线程挂起和恢复的`park`和`unpark`， LockSupport类底层就是调用了这两个方法。还有支持反射操作的`allocateInstance()`方法。

原子操作-AtomicInteger类源码简析

上面介绍了Unsafe类的几个支持CAS的方法。那Java具体是如何使用这几个方法来实现原子操作的呢？

JDK提供了一些用于原子操作的类，在`java.util.concurrent.atomic`包下面。

这里我们以`AtomicInteger`类的`getAndAdd(int delta)`方法为例，来看看Java是如何实现原子操作的。

先看看这个方法的源码：

```java
public final int getAndAdd(int delta) {
    return U.getAndAddInt(this, VALUE, delta);
}
```

这里的U其实就是一个`Unsafe`对象：

```java
private static final jdk.internal.misc.Unsafe U = jdk.internal.misc.Unsafe.getUnsafe();
```

所以其实`AtomicInteger`类的`getAndAdd(int delta)`方法是调用`Unsafe`类的方法来实现的：

```java
@HotSpotIntrinsicCandidate
public final int getAndAddInt(Object o, long offset, int delta) {
    int v;
    do {
        v = getIntVolatile(o, offset);
    } while (!weakCompareAndSetInt(o, offset, v, v + delta));
    return v;
}
```

> 注：这个方法是在JDK 1.8才新增的。在JDK1.8之前，`AtomicInteger`源码实现有所不同，是基于for死循环的，有兴趣的读者可以自行了解一下。

我们来一步步解析这段源码。首先，对象`o`是`this`，也就是一个`AtomicInteger`对象。然后`offset`是一个常量`VALUE`。这个常量是在`AtomicInteger`类中声明的：

```java
private static final long VALUE = U.objectFieldOffset(AtomicInteger.class, "value");
```

同样是调用的`Unsafe`的方法。从方法名字上来看，是得到了一个对象字段偏移量。

> 用于获取某个字段相对Java对象的“起始地址”的偏移量。
>
> 一个java对象可以看成是一段内存，各个字段都得按照一定的顺序放在这段内存里，同时考虑到对齐要求，可能这些字段不是连续放置的，
>
> 用这个方法能准确地告诉你某个字段相对于对象的起始内存地址的字节偏移量，因为是相对偏移量，所以它其实跟某个具体对象又没什么太大关系，跟class的定义和虚拟机的内存模型的实现细节更相关。

继续看源码。前面我们讲到，CAS是“无锁”的基础，它允许更新失败。所以经常会与while循环搭配，在失败后不断去重试。

这里声明了一个v，也就是要返回的值。从`getAndAddInt`来看，它返回的应该是原来的值，而新的值的`v + delta`。

这里使用的是**do-while循环**。这种循环不多见，它的目的是**保证循环体内的语句至少会被执行一遍**。这样才能保证return 的值`v`是我们期望的值。

循环体的条件是一个CAS方法：

```java
public final boolean weakCompareAndSetInt(Object o, long offset,
                                          int expected,
                                          int x) {
    return compareAndSetInt(o, offset, expected, x);
}

public final native boolean compareAndSetInt(Object o, long offset,
                                             int expected,
                                             int x);
```

可以看到，最终其实是调用的我们之前说到了CAS `native`方法。那为什么要经过一层`weakCompareAndSetInt`呢？从JDK源码上看不出来什么。在JDK 8及之前的版本，这两个方法是一样的。

> 而在JDK 9开始，这两个方法上面增加了@HotSpotIntrinsicCandidate注解。这个注解允许HotSpot VM自己来写汇编或IR编译器来实现该方法以提供性能。也就是说虽然外面看到的在JDK9中weakCompareAndSet和compareAndSet底层依旧是调用了一样的代码，但是不排除HotSpot VM会手动来实现weakCompareAndSet真正含义的功能的可能性。

根据本文第一篇参考文章（文末链接），它跟`volatile`有关。

简单来说，`weakCompareAndSet`操作仅保留了`volatile`自身变量的特性，而除去了happens-before规则带来的内存语义。也就是说，`weakCompareAndSet`**无法保证处理操作目标的volatile变量外的其他变量的执行顺序( 编译器和处理器为了优化程序性能而对指令序列进行重新排序 )，同时也无法保证这些变量的可见性。**这在一定程度上可以提高性能。

再回到循环条件上来，可以看到它是在不断尝试去用CAS更新。如果更新失败，就继续重试。那为什么要把获取“旧值”v的操作放到循环体内呢？其实这也很好理解。前面我们说了，CAS如果旧值V不等于预期值E，它就会更新失败。说明旧的值发生了变化。那我们当然需要返回的是被其他线程改变之后的旧值了，因此放在了do循环体内。



#### CAS的ABA问题

所谓ABA问题，就是一个值原来是A，变成了B，又变回了A。这个时候使用CAS是检查不出变化的，但实际上却被更新了两次。

ABA问题的解决思路是在变量前面追加上**版本号或者时间戳**。从JDK 1.5开始，JDK的atomic包里提供了一个类`AtomicStampedReference`类来解决ABA问题。



**CAS总结：**

**CAS比较当前Java线程工作内存中的值和主存中的值，如果这个值是期望的，那么则执行操作！如果不是就一直循环！在Java中，有一个`Unsafe`类，它在`sun.misc`包中。它里面是一些`native`方法，`Unsafe中对CAS的实现是C++写的，它的具体实现和操作系统、CPU都有关系。`，CAS会产生ABA问题，就是一个值原来是A，变成了B，又变回了A。这个时候使用CAS是检查不出变化的，但实际上却被更新了两次。解决思路是在变量前面追加上版本号或者时间戳。从JDK 1.5开始，JDK的atomic包里提供了一个类`AtomicStampedReference`类来解决ABA问题。**

#### Java锁

`公平锁 / 非公平锁`

**公平锁**

公平锁是指多个线程按照申请锁的顺序来获取锁。

**非公平锁**

非公平锁是指多个线程获取锁的顺序并不是按照申请锁的顺序，有可能后申请的线程比先申请的线程优先获取锁。有可能，会造成优先级反转或者饥饿现象。

对于Java ReentrantLock而言，通过构造函数指定该锁是否是公平锁，默认是非公平锁。非公平锁的优点在于吞吐量比公平锁大。 对于Synchronized而言，也是一种非公平锁。由于其并不像ReentrantLock是通过AQS的来实现线程调度，所以并没有任何办法使其变成公平锁。



`可重入锁 / 不可重入锁`

**可重入锁**

广义上的可重入锁指的是可重复可递归调用的锁，在外层使用锁之后，在内层仍然可以使用，并且不发生死锁（前提得是同一个对象或者class），这样的锁就叫做可重入锁。ReentrantLock和synchronized都是可重入锁

**不可重入锁**

不可重入锁，与可重入锁相反，不可递归调用，递归调用就发生死锁。看到一个经典的讲解，使用自旋锁来模拟一个不可重入锁



`独享锁 / 共享锁`

独享锁和共享锁在你去读C.U.T包下的ReeReentrantLock和ReentrantReadWriteLock你就会发现，它俩一个是独享一个是共享锁。

**独享锁** ：该锁每一次只能被一个线程所持有。

**共享锁** ：该锁可被多个线程共有，典型的就是ReentrantReadWriteLock里的读锁，它的读锁是可以被共享的，但是它的写锁确每次只能被独占。

另外读锁的共享可保证并发读是非常高效的，但是读写和写写，写读都是互斥的。

独享锁与共享锁也是通过AQS来实现的，通过实现不同的方法，来实现独享或者共享。 对于Synchronized而言，当然是独享锁。



`互斥锁 / 读写锁`

**互斥锁**

在访问共享资源之前对进行加锁操作，在访问完成之后进行解锁操作。 加锁后，任何其他试图再次加锁的线程会被阻塞，直到当前进程解锁。

如果解锁时有一个以上的线程阻塞，那么所有该锁上的线程都被编程就绪状态， 第一个变为就绪状态的线程又执行加锁操作，那么其他的线程又会进入等待。 在这种方式下，只有一个线程能够访问被互斥锁保护的资源

**读写锁**

读写锁既是互斥锁，又是共享锁，read模式是共享，write是互斥(排它锁)的。

读写锁有三种状态 ：读加锁状态、写加锁状态和不加锁状态

读写锁在Java中的具体实现就是 ReadWriteLock

一次只有一个线程可以占有写模式的读写锁，但是多个线程可以同时占有读模式的读写锁。 只有一个线程可以占有写状态的锁，但可以有多个线程同时占有读状态锁，这也是它可以实现高并发的原因。当其处于写状态锁下，任何想要尝试获得锁的线程都会被阻塞，直到写状态锁被释放；如果是处于读状态锁下，允许其它线程获得它的读状态锁，但是不允许获得它的写状态锁，直到所有线程的读状态锁被释放；为了避免想要尝试写操作的线程一直得不到写状态锁，当读写锁感知到有线程想要获得写状态锁时，便会阻塞其后所有想要获得读状态锁的线程。所以读写锁非常适合资源的读操作远多于写操作的情况。



`乐观锁 / 悲观锁`

**悲观锁**

总是假设最坏的情况，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会阻塞直到它拿到锁（ 共享资源每次只给一个线程使用，其它线程阻塞，用完后再把资源转让给其它线程 ）。传统的[关系型数据库](https://cloud.tencent.com/product/cdb-overview?from=10680)里边就用到了很多这种锁机制，比如行锁，表锁等，读锁，写锁等，都是在做操作之前先上锁。Java中synchronized和ReentrantLock等独占锁就是悲观锁思想的实现。

**乐观锁**

总是假设最好的情况，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号机制和CAS算法实现。乐 观锁适用于多读的应用类型，这样可以提高吞吐量 ，像[数据库](https://cloud.tencent.com/solution/database?from=10680)提供的类似于write_condition机制，其实都是提供的乐观锁。在Java中java.util.concurrent.atomic包下面的 原子变量类就是使用了乐观锁的一种实现方式CAS实现的 。



`分段锁`

分段锁其实是一种锁的设计，并不是具体的一种锁，对于ConcurrentHashMap而言，其并发的实现就是通过分段锁的形式来实现高效的并发操作。

并发容器类的加锁机制是基于粒度更小的分段锁，分段锁也是提升多并发程序性能的重要手段之一。

在并发程序中，串行操作是会降低可伸缩性，并且上下文切换也会减低性能。在锁上发生竞争时将通水导致这两种问题，使用独占锁时保护受限资源的时候，基本上是采用串行方式—-每次只能有一个线程能访问它。所以对于可伸缩性来说最大的威胁就是独占锁。

我们一般有三种方式降低锁的竞争程度 ： 1、减少锁的持有时间 2、降低锁的请求频率 3、使用带有协调机制的独占锁，这些机制允许更高的并发性。

在某些情况下我们可以将锁分解技术进一步扩展为一组独立对象上的锁进行分解，这成为分段锁。

其实说的简单一点就是 ：

容器里有多把锁，每一把锁用于锁容器其中一部分数据，那么当多线程访问容器里不同数据段的数据时，线程间就不会存在锁竞争，从而可以有效的提高并发访问效率，这就是ConcurrentHashMap所使用的锁分段技术，首先将数据分成一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据的时候，其他段的数据也能被其他线程访问。

比如：在ConcurrentHashMap中使用了一个包含16个锁的数组，每个锁保护所有散列桶的1/16，其中第N个散列桶由第（N mod 16）个锁来保护。假设使用合理的散列算法使关键字能够均匀的分部，那么这大约能使对锁的请求减少到越来的1/16。也正是这项技术使得ConcurrentHashMap支持多达16个并发的写入线程。



`偏向锁 / 轻量级锁 / 重量级锁`

锁的状态 ：

无锁状态

偏向锁状态

轻量级锁状态

重量级锁状态

锁的状态是通过对象监视器在对象头中的字段来表明的。 四种状态会随着竞争的情况逐渐升级，而且是不可逆的过程，即不可降级。 这四种状态都不是Java语言中的锁 ，而是Jvm为了提高锁的获取与释放效率而做的优化( 使用synchronized时 )。

**偏向锁**

偏向锁是指一段同步代码一直被一个线程所访问，那么该线程会自动获取锁。降低获取锁的代价。

轻量级

轻量级锁是指当锁是偏向锁的时候，被另一个线程所访问，偏向锁就会升级为轻量级锁，其他线程会通过自旋的形式尝试获取锁，不会阻塞，提高性能。

重量级锁

重量级锁是指当锁为轻量级锁的时候，另一个线程虽然是自旋，但自旋不会一直持续下去，当自旋一定次数的时候，还没有获取到锁，就会进入阻塞，该锁膨胀为重量级锁。重量级锁会让其他申请的线程进入阻塞，性能降低。



**`自旋锁`**

我们知道CAS算法是乐观锁的一种实现方式，CAS算法中又涉及到自旋锁，所以这里给大家讲一下什么是自旋锁。

简单回顾一下CAS算法

CAS是英文单词Compare and Swap（比较并交换），是一种有名的无锁算法。无锁编程，即不使用锁的情况下实现多线程之间的变量同步，也就是在没有线程被阻塞的情况下实现变量的同步，所以也叫非阻塞同步（Non-blocking Synchronization）。CAS算法涉及到三个操作数

需要读写的内存值 V

进行比较的值 A

拟写入的新值 B

更新一个变量的时候，只有当变量的预期值A和内存地址V当中的实际值相同时，才会将内存地址V对应的值修改为B，否则不会执行任何操作。一般情况下是一个自旋操作，即不断的重试。

什么是自旋锁？

自旋锁（spinlock）：是指当一个线程在获取锁的时候，如果锁已经被其它线程获取，那么该线程将循环等待，然后不断的判断锁是否能够被成功获取，直到获取到锁才会退出循环 。

它是为实现保护共享资源而提出一种锁机制。其实，自旋锁与互斥锁比较类似，它们都是为了解决对某项资源的互斥使用。 无论是互斥锁，还是自旋锁，在任何时刻，最多只能有一个保持者，也就说，在任何时刻最多只能有一个执行单元获得锁 。但是两者在调度机制上略有不同。对于互斥锁，如果资源已经被占用，资源申请者只能进入睡眠状态。但是自旋锁不会引起调用者睡眠，如果自旋锁已经被别的执行单元保持，调用者就一直循环在那里看是否该自旋锁的保持者已经释放了锁，”自旋”一词就是因此而得名。

















































