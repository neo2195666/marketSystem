当程序启动的时候，applicationContent.xml文件加载的时候，容器内的beans就已经初始化了。可以通过content容器的getBeans来直接获取。



bean标签中的name是别名，跟alias作用是一样的



### DI依赖注入和自动装配

Denpendency Inject

```xml
<!-- 普通装配方式 -->
<bean id="beanOne" class="x.y.one">
     <constructor-arg ref="beanTwo"/>
     <constructor-arg ref="beanThree"/>
</bean>

<bean id="beanTwo" class="x.y.two"/>
<bean id="beanThree" class="x.y.three"/>

<!-- 自动装配方式 -->
<!-- 当要注入的类中，包含其他类的时候，不需要将子类全部注入，只需要把该类注入即可，使用autowired实现自动装配与这个类相关的其他类，比如下面装配了一个Z类，Z类中包含A,B类，那么只需要注入Z类，A,B类将会实现自动注入 -->
<beans>
    <!-- 自动装配可以使用byType或者byName -->
    <bean id="Z" class="x.y.Z" autowired="byType"/>

    <bean id="A" class="x.y.A"/>
    <bean id="B" class="x.y.B"/>
</beans>


<bean id="exampleBean" class="examples.ExampleBean">
    <constructor-arg index="0" value="7500000"/>
    <constructor-arg index="1" value="42"/>
</bean>

<bean id="exampleBean" class="examples.ExampleBean">
    <!-- 属性中的值直接引用其他bean -->
    <property name="beanOne">
        <ref bean="anotherExampleBean"/>
    </property>

    <!-- 属性的值值得ref其他bean -->
    <property name="beanTwo" ref="yetAnotherBean"/>
    <property name="integerProperty" value="1"/>
</bean>
<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>


<bean id="exampleBean" class="examples.ExampleBean" factory-method="createInstance">
    <constructor-arg ref="anotherExampleBean"/>
    <constructor-arg ref="yetAnotherBean"/>
    <constructor-arg value="1"/>
</bean>
<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>

<bean id="moreComplexObject" class="example.ComplexObject">
    <!-- 属性properties可以使用的类型 -->
    <property name="adminEmails">
        <props>
            <prop key="administrator">administrator@example.org</prop>
            <prop key="support">support@example.org</prop>
            <prop key="development">development@example.org</prop>
        </props>
    </property>
    <!-- 使用list -->
    <property name="someList">
        <list>
            <value>a list element followed by a reference</value>
            <ref bean="myDataSource" />
        </list>
    </property>
    <!-- 使用map结合 -->
    <property name="someMap">
        <map>
            <entry key="an entry" value="just some string"/>
            <entry key="a ref" value-ref="myDataSource"/>
        </map>
    </property>
    <!-- 使用set集合 -->
    <property name="someSet">
        <set>
            <value>just some string</value>
            <ref bean="myDataSource" />
        </set>
    </property>
</bean>

<bean id="outer" class="...">
    <!-- 在属性内定制一个bean -->
    <property name="target">
        <bean class="com.example.Person"> <!-- 内部bean -->
            <property name="name" value="Fiona Apple"/>
            <property name="age" value="25"/>
        </bean>
    </property>
</bean>
```

### 使用注解自动装配

1、导入context约束

2、开启配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
    <!-- 
1、导入context约束  
xmlns:context="http://www.springframework.org/schema/context"

http://www.springframework.org/schema/context
https://www.springframework.org/schema/context/spring-context.xsd"> 
-->

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 2、开启自动注解配置 -->
    <context:annotation-config/>

</beans>
```

3、使用@Autowired实现自动装配

```java
@Data
public class A{
    String name;
    //@Autowired通过byType的方式实现，而且要求这个对象必须存在
    //如果显示的定义了@Autowired的required属性为false说明这个对象可以为null 
    @Autowired(required = false)
    Address address;
    
    @Autowired
    //容器中有多个相同的Java类的bean，需要指定bean的id来绑定对应的bean
    @Qualifier(value = "car1")
    Car car;
    
    //@Resource注解默认使用byName方式实现，如果byName没有匹配到使用byType来匹配，使用@ssResource注解可以直接根据Bean中注入的Java的类来匹配，
    @Resource
    Dog dog
    
    //@Nullable注解说明这个字段可以为null
    public A(@Nullable String name){
        this.name = name;
    }
}
```

### 使用注解开发

1、使用maven导入aop依赖

2、再ApplicationContext.xml中添加配置

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 配置使用注解,将pojo包中所有使用@component注解的类注入到ioc容器中 -->
    <context:component-scan base-package="com.kuang.pojo"/>
    <context:annotation-config/>

</beans>
```

```java
//使用@component就等于在ioc容器中注入 <bean id="a" class="com.kuang.pojo.A"/>
@component
//单例模式singleton，多例prototype
@Scope("singleton")
public class A{
    @Value("秦疆")
    public String name;
}
```

```java
//dao层用@Repository注解注入到spring容器中
@Repository
public class DaoA{
}
```

```java
//@Service解注入到spring容器中
@Service
public class ServiceA{
}
```

```java
//@Controller解注入到spring容器中
@Controller
public class ControllerA{
}
```

