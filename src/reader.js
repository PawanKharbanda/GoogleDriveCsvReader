import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { gapi, loadAuth2 } from 'gapi-script';


//creating table & Joning of selected columns
function print(data) {
    var idiv = document.getElementById("idiv");
    var div = document.getElementById("div");

    var inputA = document.createElement("input");
    var inputB = document.createElement("input");
    var button = document.createElement("button");
    var textnode = document.createTextNode("GO");
    button.appendChild(textnode);
    idiv.appendChild(inputA)
    idiv.appendChild(inputB)
    idiv.appendChild(button)
    var split = data.body.split(/\r?\n|\r/)
    var table = document.createElement("table");
    table.setAttribute("id", "tableid");
    for (var i = 0; i < split.length; i++) {
//spliting of data into columns 
        var rowData = split[i].split(',');
        var tr = document.createElement("tr");
        for (var j = 0; j < rowData.length; j++) {
            var t = document.createTextNode(rowData[j]);
            if (i == 0) {
                var th = document.createElement("th");
                th.appendChild(t);
                tr.appendChild(th);
            }
            else {
                var td = document.createElement("td");
                td.appendChild(t);
                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
    }

    div.appendChild(table);

    //Adding of columns
    button.addEventListener("click", function (event) {

        var coulmn1 = inputA.value;
        var column2 = inputB.value;
        for (var i = 0; i < split.length; i++) {
            var rowData = split[i].split(',');

            var tableAdd = document.getElementById("tableid");
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var th = document.createElement("th");
            var t = document.createTextNode(rowData[coulmn1] + " + " + rowData[column2])
            if (i == 0) {
                th.appendChild(t);
                tr.appendChild(th);
            }
            else {
                td.appendChild(t);
                tr.appendChild(td);
            }
            tableAdd.appendChild(tr);
            console.log(rowData[coulmn1] + " + " + rowData[column2]);

        }

    })
}



class Reader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],

        };
        this.getdata = this.getdata.bind(this);
        this.handleClientLoad = this.handleClientLoad.bind(this);
       // this.download = this.download.bind(this);
        //  this.listFiles=this.listFiles.bind(this);
    }



    
//Firstly Called when page loaded
    componentDidMount() {
        this.handleClientLoad();
    }

    //For Fetching and reading of Csv file
    async handleClientLoad() {

        gapi.load('client:auth2', function () {
            var clientId = 'YOUR Client Id';
            var scope = "https://www.googleapis.com/auth/drive.metadata.readonly";
            var apiKey = 'YOUR api key';
            var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

            //Fetching
            gapi.client.init({
                apiKey: apiKey,
                clientId: clientId,
                scope: scope,
                discoveryDocs: DISCOVERY_DOCS,

            }).then(response => {
                console.log(1);

//
//Reading of csv
                gapi.client.drive.files.list({
                    q: "mimeType='text/csv'",
                    'pageSize': 10,
                    'fields': "nextPageToken, files(id, name)"
                }).then(response => {

                    console.log(2);
                    var files = response.result.files;
                    if (files && files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            console.log(file.name + " " + file.id);
                            if (file.name == "sample.csv") {
                                alert(file.id);
                                var fileId = file.id;

                                gapi.client.drive.files.get({
                                    fileId: fileId,
                                    alt: 'media'
                                }).then(data => {


                                    print(data);
                                })

                            }
                        }
                    } else {
                        console.log('No files found.');
                    }
                });


            }, function (error) {
                console.log("in errror")
                console.log(error);


            }
            );

        });


    }
   

    //User AUthentication
    async getdata(event) {
       
        gapi.auth2.getAuthInstance().signIn();

    }
//

    render() {

        return (


            <div>
                <button type="button" onClick={this.getdata}>Authorize</button>
                <div id="idiv"></div>
                <div id="div"></div>
            </div>


        );

    }
}
export default Reader;