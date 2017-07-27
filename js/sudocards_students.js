//Load Chars
function loadCards(){
  db.allDocs({
      include_docs : true,
      attachments: true,
      startkey : "CARDS",
      endkey : "CARDS" + "\uffff"
    }).then(function (result) {
       
      newcardcontent = '  <table class="table table-striped" id="sctable">\
    <thead>\
      <tr>\
        <th>Foto</th>\
        <th>Name</th>\
        <th>Punkte</th>\
        <th>Bonus</th>\
        <th>Preis</th>\
        <th>Verkaufspreis</th>\
        <th>Aufladungen</th>\
        <th>Beschreibung</th>\
      </tr>\
    </thead>\
    <tbody>';

      counter = 0;
      for(i in result["rows"]){

      	newcardcontent += '<tr>\
      	<td style="max-width: 50px">\
			<img src="data:image/jpg;base64,'+result["rows"][i]['doc']['_attachments']['cardfoto.png']['data']+'"\
           style="max-width: 100%"/>\
      	</td>\
      	<td>'+result["rows"][i]['doc']['cardname']+'</td>\
      	<td>'+result["rows"][i]['doc']['cardpoints']+'</td>\
      	<td>'+result["rows"][i]['doc']['cardbonus']+'</td>\
      	<td>'+result["rows"][i]['doc']['cardprice']+'</td>\
      	<td>'+result["rows"][i]['doc']['cardsellprice']+'</td>\
      	<td>'+result["rows"][i]['doc']['cardrounds']+'</td>\
      	<td>'+result["rows"][i]['doc']['carddesc']+'</td>\
      	</tr>';
      	counter++;
      }

      newcardcontent += '</tbody></table>';
      $("#cardcontent").html(newcardcontent);
      $("#card_count").html(counter);
      $('#sctable').DataTable();
    });
}
