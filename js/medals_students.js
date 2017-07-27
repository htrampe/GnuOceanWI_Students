/* CHARAKTER */
//Load Medals
function loadMedals(){
  db.allDocs({
      include_docs : true,
      attachments: true,
      startkey : "MEDALS",
      endkey : "MEDALS" + "\uffff"
    }).then(function (result) {
       
      newmedalcontent = '  <table class="table table-striped" id="mtable">\
    <thead>\
      <tr>\
        <th>Foto</th>\
        <th>Name</th>\
        <th>Punkte</th>\
        <th>Beschreibung</th>\
      </tr>\
    </thead>\
    <tbody>';

      counter = 0;
      for(i in result["rows"]){

        newmedalcontent += '<tr>\
        <td style="max-width: 25px">\
      <img src="data:image/jpg;base64,'+result["rows"][i]['doc']['_attachments']['medal.png']['data']+'"\
           style="max-width: 75%"/>\
        </td>\
        <td>'+result["rows"][i]['doc']['medalname']+'</td>\
        <td>'+result["rows"][i]['doc']['medalpoints']+'</td>\
        <td>'+result["rows"][i]['doc']['medaldesc']+'</td>\
        </tr>';
        counter++;
      }

      newmedalcontent += '</tbody></table>';
      $("#medalcontent").html(newmedalcontent);
      $("#medal_count").html(counter);
      $('#mtable').DataTable();
    });
}