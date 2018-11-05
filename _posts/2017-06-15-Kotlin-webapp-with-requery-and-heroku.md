---
layout: post
title: Making a Kotlin webapp with Requery and Heroku
date: 2017-06-15 13:00:00 -0500
tags: [kotlin, requery, heroku]
---

First, I based my work in [this project](https://github.com/orangy/ktor-heroku-start) by Ilya Ryzhenkov but updated some things, specially the Hikari configuration at the startup time. The important changes to create a valid Hikari configuration in Kotlin, are shown below:

{% highlight kotlin %}
val properties = Properties().apply {
    val uri = URI(System.getenv("DATABASE_URL"))

    setProperty("dataSourceClassName", "org.postgresql.ds.PGSimpleDataSource")
    setProperty("dataSource.user", uri.userInfo.split(":")[0])
    setProperty("dataSource.password", uri.userInfo.split(":")[1])
    setProperty("dataSource.databaseName", uri.path.substring(1))
    setProperty("dataSource.portNumber", uri.port.toString())
    setProperty("dataSource.serverName", uri.host)
}
{% endhighlight %}

As is recommended in the Heroku doicumentation and then you simply

{% highlight kotlin %}
val hikariConfig = HikariConfig(properties)
{% endhighlight %}

After that, I added the libraries I was goin to work, Requery and JUnit prominently, things that were simply added to the pom.xml, although in the near future I'm thinking of changing the build system to Gradle, which in the new 4 version seems like a faster, simpler and more concise tool. If that happens, expect a post about it.

Requery was tough to set up due to the generation code part, which require configuration in the kotlin plugin, something that it-s not terribly obvious at first. I finished with this Kotlin config specifically

{% highlight XML %}
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <configuration>
        <jvmTarget>1.8</jvmTarget>
        <args>
            <arg>-Xcoroutines=enable</arg>
        </args>
    </configuration>
    <executions>
        <execution>
            <id>kapt</id>
            <goals>
                <goal>kapt</goal>
            </goals>
            <configuration>
                <sourceDirs>
                    <sourceDir>src/main/kotlin</sourceDir>
                </sourceDirs>
                <annotationProcessorPaths>
                    <annotationProcessorPath>
                        <groupId>io.requery</groupId>
                        <artifactId>requery-processor</artifactId>
                        <version>${requery.version}</version>
                    </annotationProcessorPath>
                </annotationProcessorPaths>
            </configuration>
        </execution>
        <execution>
            <id>compile</id>
            <phase>process-sources</phase>
            <goals>
                <goal>compile</goal>
            </goals>
        </execution>
        <execution>
            <id>test-compile</id>
            <phase>test-compile</phase>
            <goals>
                <goal>test-compile</goal>
            </goals>
        </execution>
    </executions>
</plugin>
{% endhighlight %}

This however, makes me do a `mvn clean install` or `mvn clean test` or `mvn clean compile` in all the commands used, giving me one of the reasons to use Gradle instead
