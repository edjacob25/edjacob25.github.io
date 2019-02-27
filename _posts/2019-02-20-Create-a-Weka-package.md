---
layout: post
title: Creating a Weka package 
date: 2019-02-20 13:00:00 -0500
tags: [weka, kotlin, machine learning, java]
author: Jacob Rivera
---

[Weka](https://www.cs.waikato.ac.nz/ml/weka/) is a platform written in Java in which you can dynamically load datasets and use it for several tasks, such as classification and clustering. It has a GUI in which you can change the parameters on the fly for rapid testing. But Weka also can be used from the command line, which is very useful to create scripts and automate the analysis of data.

Weka has a default set of algorithms already programmed and ready to use, including things as K-Means or COBWEB for clustering and several bayesian methods, random forests and several regressions for classification. Nonetheless, the ability to expand the abilities and test new algorithms is a necessity with this type of software. Fortunately for us, Weka was designed with this in mind and it even includes a package manager which facilitates the inclusion of new algorithms, both our own and the ones from other people.

In this post, we will see how to create one of this packages for us and others to use. 
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

Now, in order to generate the package, we need to decide what is what we want to do.