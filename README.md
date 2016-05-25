# **Proyecto WALMEX** #
-------

These instructions only apply to the frontend repository

## **Requirements** ##

First
-------
Clone Dev branch:

```
$ git clone https://pokazzam@bitbucket.org/latlongdevs/walmex-front.git
```


# **Install packages and dependencies** #
-------
**Important** Make sure you go to the root folder before run installs.
```
$ bower install
```

### For gulp packages and dependencies:
```
$ npm install
```
or for root permissions:
```
$ sudo npm install
```

Folder Structure
-------
```
.walmex-front
|--bower_components/   # Frontend packages
|--node_modules/       # browser-sync, gulp and dependencies
|--public/             # Main Prod (**only for production**)
|   |_ components
|   |_ css
|   |_ iconfonts
|   |_ images
|   |_ js
|   |_ index.html      # Main index for prod server

|--client              # Main DEV  
|   _ catalog
|   _ components
|      |_ ...          # html and js components (angular)
|      |_ emus.module  # Main angular module
|      |_ emus.routes  # Routes
|   _ css
|   _ fonts
|   _ images
|   _ sass             # Sass stylesheets for each view's component 
|      |_  ...         
|   _ index.html       # Main index for Dev server
|--tmp                 # Final template file from each angular view (for production)
```