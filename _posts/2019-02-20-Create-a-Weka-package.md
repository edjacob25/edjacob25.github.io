---
layout: post
title: Creating a Weka package 
date: 2019-02-20 13:00:00 -0500
tags: [weka, machine learning, java]
author: Jacob Rivera
---

[Weka](https://www.cs.waikato.ac.nz/ml/weka/) is a platform written in Java in which you can dynamically load datasets and use it for several tasks, such as classification and clustering. It has a GUI in which you can change the parameters on the fly for rapid testing. But Weka also can be used from the command line, which is very useful to create scripts and automate the analysis of data.

Weka has a default set of algorithms already programmed and ready to use, including things as K-Means or COBWEB for clustering and several bayesian methods, random forests and several regressions for classification. Nonetheless, the ability to expand the abilities and test new algorithms is a necessity with this type of software. Fortunately for us, Weka was designed with this in mind and it even includes a package manager which facilitates the inclusion of new algorithms, both our own and the ones from other people.

In this post, we will see how to create one of this packages for us and others to use.

### Weka Package
First, we see that a weka package is simply a zip file which contains several key files and is organized in the following way:
```
Package.zip
+- Description.props (Required)
+- Package.jar (Required)
+- src
| +- main
| | +- weka
| | | +- ...
| +- test
+- lib
| +- ...
+- doc
| +- Readme
| +- ...
```

As we can see, the bare minimum for a Weka package is the `Description.props` and the `Package.jar`, which are a file which contains the basic information of the package, such as author(s), version, license and a url of the project and the compiled jar which contains the `.class` files with the compiled code. The `Description.props` file usually looks like this:
```
# Template Description file for a Weka package

# Package name (required)
PackageName=funkyPackage

# Version (required)
Version=1.0.0

#Date (year-month-day)
Date=2010-01-01

# Title (required)
Title=My cool algorithm

# Category (recommended)
Category=Classification

# Author (required)
Author=Joe Dev <joe@somewhere.net>,Dev2 <dev2@somewhereelse.net>

# Maintainer (required)
Maintainer=Joe Dev <joe@somewhere.net>

# License (required)
License=GPL 2.0|Mozilla

# Description (required)
Description=This package contains the famous Funky Classifer that performs truely funky prediction.

# Changes and/or bug fixes in this package (optional)
Changes=Fixed a serious bug that affected overall coolness of the Funky Classifier

# Package URL for obtaining the package archive (required)
PackageURL=http://somewhere.net/weka/funkyPackage.zip

# URL for further information
URL=http://somewhere.net/funkyResearchInfo.html

# Enhances various other packages?
Enhances=packageName1,packageName2,...

# Related to other packages?
Related=packageName1,packageName2,...

# Dependencies (required; format: packageName (equality/inequality version_number)
Depends=weka (>=3.7.1), packageName1 (=x.y.z), packageName2 (>u.v.w|<=x.y.z),...
```
A reference `Description.props` can be found [here](https://waikato.github.io/weka-wiki/files/Description.props). 

However, it is customary to include a `doc` directory with the package documentation(including javadocs) and a `src` directory with the source code if the project is open source. A `lib` directory which contains additional libraries may be needed as well, Weka will load them when the project is used.

When installed, the package will be decompressed in `$WEKA_HOME/packages` and maintain the same structure mentioned before.

### Java project

Now, in order to generate the package, we need to create a Java (or other JVM languages such as [Kotlin](https://kotlinlang.org/), [Scala](https://www.scala-lang.org/) or [Clojure](https://clojure.org/)) project. An automated build system such as [Maven](https://maven.apache.org/) or [Gradle](https://gradle.org/) is recommended, because the inclusion of libraries and creation of objects are simplified.

A proposed organization of the project is shown here:
```
+- pom.xml
+- LICENSE
+- README
+- .gitignore
+- src
| +- main
| | +- java
| | | +- weka
| | | | +- ...
| | +- resources
| | | +- Description.props
| +- test
| | +- java
| | | +- ...
| +- assembly
| | +- weka.xml

```
In this case, we decided to use Maven as the build system, but a `build.gradle` can be used instead. Next, a base Maven `pom.xml` configuration file is shown:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>your.group.id</groupId>
    <artifactId>PackageName</artifactId>
    <version>0.1</version>

    <dependencies>
        <dependency>
            <groupId>nz.ac.waikato.cms.weka</groupId>
            <artifactId>weka-dev</artifactId>
            <version>3.9.3</version>
        </dependency>
    </dependencies>
</project>
```
We can observe that this file only adds the library to extend Weka from the Maven repository and specifies some properties of the project. To actually build a the project, we need to add a `<build></build>` section which really depends in whichever is the configuration or libraries of the project you are developing, however we will show a basic configuration that uses the `maven-assembly-plugin` to build the project and create the project zip file. 
```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>2.6</version>
                <configuration>
                    <descriptor>src/assembly/weka.xml</descriptor>
                    <attach>false</attach>
                </configuration>
                <executions>
                    <execution>
                        <id>create-archive</id>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                        <configuration>
                            <archive>
                                <manifest>
                                    <addClasspath>true</addClasspath>
                                </manifest>
                            </archive>
                            <descriptorRefs>
                                <descriptorRef>jar-with-dependencies</descriptorRef>
                            </descriptorRefs>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```
As we can see, we specify the creation of an package file, but the configuration its found in another file, specifically `src/assembly/weka.xml` which its shown here:
```xml
<assembly
        xmlns="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.2"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/xsd/assembly-1.1.2.xsd">
    <id>weka</id>
    <formats>
        <format>zip</format>
    </formats>
    <includeBaseDirectory>false</includeBaseDirectory>
    <dependencySets>
        <dependencySet>
            <outputDirectory></outputDirectory>
            <unpack>false</unpack>
            <includes>
                <include>${groupId}:${artifactId}</include>
            </includes>
        </dependencySet>
        <dependencySet>
            <outputDirectory>lib</outputDirectory>
            <unpack>false</unpack>
            <includes>
                <include>nz.ac.waikato.cms.weka:weka-dev</include>
            </includes>
        </dependencySet>
    </dependencySets>
    <fileSets>
        <fileSet>
            <directory>${basedir}/src/main/resources/</directory>
            <outputDirectory></outputDirectory>
            <includes>
                <include>Description.props</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>${project.basedir}</directory>
            <outputDirectory>doc</outputDirectory>
            <includes>
                <include>LICENSE*</include>
                <include>README*</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>${project.build.directory}/site</directory>
            <outputDirectory>doc</outputDirectory>
        </fileSet>
        <fileSet>
            <directory>${project.basedir}/src</directory>
            <useDefaultExcludes>true</useDefaultExcludes>
            <excludes>
                <exclude>**/target/**</exclude>
            </excludes>
        </fileSet>
    </fileSets>
</assembly>
```
As we can see, this file simply maps the files in the Java project to the organization needed for the weka package, including the libs, the `Description.props` file and in this case adding the source code as well. It also specifies that the final file must be a zip. This configuration can be easily changed to fit the needs of each package, including or excluding files by specifying or deleting `<fileSet>`s. It must be noted that the default compilation route is `target/`, which is excluded from the final zip file. This configuration can be run by using the command `mvn install`, which builds the code, runs the tests and finally creates the jar and zip file.

### Implementation

Finally, the code must be written. As mentioned before, it is Java, but alternative languages can be used as long as they compile to JVM. It's important to note that for Weka to find our code, the package must be the same that the included weka files. This means that for example, if we wanted to create a new classifier, the package of the java file must be `weka.classifiers` or if we wanted to create a clusterer, the package must be `weka.clusterers` or if we want to create a distance measure, the package must be `weka.core`. And we must not forget that for this package to work, the file structure must take the names of the package. As such, a clusterer called `MyClusterizationAlgorithm` must be in the file `src/main/java/weka/clusterers/MyClusterizationAlgorithm.java` and the file must look something like this:
```java
package weka.clusterers;

import weka.core.*;

public class MyClusterizationAlgorithm implements Clusterer {
    /**
     * Implementation goes here
     */
}
```

Weka defines several interfaces which need to be implemented for an algorithm to be useful and it includes several abstract classes which facilitate the implementation for us. Nonetheless, as Weka includes so many of them and they are very specific to each kind of project, we cannot give a specific review for each one. Fortunately for us, weka is open source and all the code can be easily seen in their [Github page](https://github.com/Waikato), both for [Weka stable(version 3.8)](https://github.com/Waikato/weka-3.8) and the one used in this post, [Weka dev(version 3.9)](https://github.com/Waikato/weka-trunk). The best way to find how to create a new classifier for example, is to read the interfaces needed to work and maybe an implementation to emulate. An IDE is an invaluable resource to explore and write the source code, because you can jump easily from one place to another and it gives automatic recommendations in which methods need to be implemented. Personally, I use [Intellij Idea](https://www.jetbrains.com/idea/) from Jetbrains, which has a free version and a Ultimate version which is given for free to students and professors that have a valid school email.