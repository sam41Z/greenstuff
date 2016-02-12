files:
    types.json:
        in this file all food-products that may appear in any region or language have to be registered. the name has to be in english and needs to be unique since its used as an identifier in the other files.
        type: 1 means vegetables
        type: 2 means fruits

    in /languages create a json file for every language.
    the file can be created by using the language.template file, renaming it and altering it. by adapting this file the names of all the vegetables and fruits can be changed as well as all the titles and the content. only food-products appearing in "types.json" may be translated the new language has to be registered in the setup.json file. it then will be added automatically in the apps menu.

    setup.json:
        in this file every language and all the region data files have to be registered in order for the application to include them in the menu

    in /regions create a json file for every region. the array months holds 24 elements. each element stands for half a month, therefore every month consists of two elements. the array can be filled with integers:
        0 not in season
        1 from store
        2 from greenhouse
        3 season

    please remember that when adding a new food-product, it has to be added in the types.json file as well as in the region and the language files in which it should appear later in the application

    if you want to add a new language or a new region, create the corresponding new file and register it in setup.json






