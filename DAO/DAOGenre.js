const { Client } = require('pg');

class DAOGenre{

    constructor(){
        this._client = new Client({
            connectionString: 'postgres://bobet:bobet@192.168.222.86:5432/biblio'
        });

        this._client.connect(function (err) {
            if (err) return (err.message);
        });
    }

    addNewGenre(libelle){
        const query = {
            name: 'ajouter un nouveau genre',
            text: 'select creegenre($1);',
            values: [libelle]
        };

        this._client.query(query, function (err) {
            if(err) {
                console.log(err.stack);
            }
        });
    };
}

module.exports = DAOGenre;