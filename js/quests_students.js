/* CHARAKTER */
//Load Medals
function loadQuests(){  
  db.allDocs({
      include_docs : true,
      attachments: true,
      startkey : "QUEST",
      endkey : "QUEST" + "\uffff"
    }).then(function (result) {
       
      newquestcontent = '  <table class="table table-striped" id="questtable">\
    <thead>\
      <tr>\
        <th>Titel</th>\
        <th>Coins</th>\
        <th>Inhalt</th>\
      </tr>\
    </thead>\
    <tbody>';

      counter = 0;
      for(i in result["rows"]){
        newquestcontent += '<tr>\
        <td>'+result["rows"][i]['doc']['questname']+'</td>\
        <td>'+result["rows"][i]['doc']['questcoins']+'</td>\
        <td>'+result["rows"][i]['doc']['questdesc']+'</td>\
        </tr>';
        counter++;
      }

      newquestcontent += '</tbody></table>';
      $("#questcontent").html(newquestcontent);
      $("#quest_count").html(counter);
      $('#questtable').DataTable();
    });
}
