
var fs = require('graceful-fs');
//var unzip = require('unzip');

//fs.createReadStream('/home/pawel/Downloads/data.gov.uk-ckan-meta-data-latest.json.zip').pipe(unzip.Extract({ path: '/tmp/' }));

var lunr = require('./lunr.js');
var searchIndex = lunr(function () {
    this.field('title', {boost: 10})
    this.field('notes')
    this.ref('id')
});

var mapping = {};

var dump = require('../few.json');

var i = 1;
dump.forEach(function(dataset) {
    searchIndex.add({
        id: dataset.id,
        title: dataset.title,
        notes: dataset.notes
    });

    mapping[dataset.id] = {
        title: dataset.title,
        name: dataset.name
    };

    fs.writeFile('./dataset/' + dataset.name + '.json', JSON.stringify(dataset), function(err) {
        if(err) {
            return console.log(err);
        }
    });
    console.log('Indexed dataset ' + i++ + ' of ' + dump.length);

});

//'http://data.gov.uk/data/dumps/data.gov.uk-ckan-meta-data-latest.json.zip'

fs.writeFile('./search-index.json', JSON.stringify(searchIndex.toJSON()), function(err) {
    if(err) {
        //return console.log(err);
    }
    console.log('searchIndex saved');
});

fs.writeFile('./dataset-map.json', JSON.stringify(mapping), function(err) {
    if(err) {
        //return console.log(err);
    }
    console.log('mapping saved');
});
